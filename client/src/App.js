import React, { useEffect, useState } from 'react'
import ClientApi from './client'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ number, setNumber ] = useState('')
  const [ search, setSearch ] = useState('')
  const [message, setmessage] = useState({msg: '', type:''})

  const handleChangeName = (e) =>{
    setNewName(e.target.value)
  }
  const handleChangeNumber = (e) =>{
    setNumber(e.target.value)
  }
  const handleChangeSearch = (e) =>{
    setSearch(e.target.value)
  }

  const handleSubmit = (e) =>{
    e.preventDefault()

    let prevPerson = findPerson(newName)
    if( prevPerson ){
      //alert(`A person with the name ${newName} already exists`)
      if( ! window.confirm( `Are you sure to update ${newName}'s number?`) )
      return false
      else{
        prevPerson.number = number
        ClientApi.updateRegiser(prevPerson)
        .then( () => {
          setPersons(persons.map( person => person.id !== prevPerson.id?person: {...prevPerson }))
          setmessage({msg:'Person Updated succesfully', type:'SUCCESS'})
          setTimeout( () => {
            setmessage({msg:'', type:''})
          }, 3000)
        })
        .catch( err => console.log( err ))
      }
    }else{
      ClientApi.create({name:newName, number:number})
      .then( (data) => {
        setPersons([...persons, data])
        setmessage({msg:'Person created succesfully', type:'SUCCESS'})
        setTimeout( () => {
          setmessage({msg:'', type:''})
        }, 3000)
      })
      .catch( err => console.log( 'Err Here' ,err ))
    }

    setNewName('')
    setNumber('')
  }

  const handleDelete = (id)=>{
    if(window.confirm('Are you sure to delete the person?')){
      ClientApi.deleteRegister(id)
      .then( () => {
        let indexDelete = persons.findIndex( person => person.id === id )
        setPersons([...persons.slice(0,indexDelete), ...persons.slice(indexDelete + 1, persons.length  )])
      })
      .catch( err => {
        setmessage({msg:`The person of id '${id}' does not exist on the server anymore`, type:'ERROR'})
        setTimeout( () => {
          setmessage({msg:'', type:''})
        }, 3000)
      })
    }
    
  }

  const findPerson = (name) => persons.find( person => person.name === name )

  useEffect( () => {
     ClientApi.getAll()
     .then( data => setPersons(data) )
  }, [])

  const personsFiltered = search
  ?persons.filter( person => person.name.toLocaleLowerCase().match(search.toLocaleLowerCase()) || person.number.toLocaleLowerCase().match(search.toLocaleLowerCase()) )
  :persons
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification msg={message.msg} type={message.type} />
      <Filter sarch={search} handleChangeSearch={handleChangeSearch} />
    
      <PersonForm newName={newName} number={number} handleChangeName={handleChangeName} 
                  handleSubmit={handleSubmit} handleChangeNumber={handleChangeNumber}
      />

      <Persons personsFiltered={personsFiltered} handleDelete={handleDelete}/>
      
    </div>
  )
}

const Filter = ({search, handleChangeSearch})=> <>Search: <input value={search} onChange={handleChangeSearch} /> <br /></>

const PersonForm = ({ newName, number, handleChangeName, handleChangeNumber, handleSubmit}) =>{
  return (
    <>
      <h2>Add a new</h2>
      <form onSubmit={handleSubmit} >
        <div>
          name: <input value={newName} onChange={handleChangeName} />
        </div>
        <div>
          number: <input value={number} onChange={handleChangeNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}
  
const Persons = ({personsFiltered, handleDelete})=> {
  const personsList = personsFiltered.map( (person)  => 
  (
    <div key={person.id}>
      <span >
        {person.name} : {person.number} 
      </span>
      <button onClick={() => handleDelete(person.id) }>DELETE</button>
    </div>
  ))
  return(
    <> 
      <h2>Numbers</h2>
      {personsList}
    </>
  )
}

const Notification = ({msg, type}) => {
  if(!msg) 
    return null
  
  let styleClass = {
    borderColor: type ==='ERROR'?'red':'green',
    border: '1px',
    backgroundColor:type ==='ERROR'?'red':'green',
    padding:15,
    margin:10
  }

  return(
    <div style={styleClass}>
      <span>{msg}</span>
    </div>
  )
}
  
    

export default App;
