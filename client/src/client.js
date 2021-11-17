import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () =>{
    const request = axios.get(baseUrl)
    return request.then( response => response.data )
}

const create = (personPhone)=>{
    const request = axios.post(baseUrl,personPhone)
    return request.then( (response) => response.data) 
}

const deleteRegister = (id) =>{
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then( res => res.data )
}

const updateRegiser = (person) => {
    const request = axios.put(`${baseUrl}/${person.id}`, person)
    return request.then( res => res.data )
}

const exportedObject = {
    getAll,
    create,
    deleteRegister,
    updateRegiser
}

export default exportedObject