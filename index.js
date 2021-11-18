require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// MODELS 
const Person = require('./models/Person')

const app = express()

const morganLog = (token, req, res) => {
    return ` ${req.method} -  ${req.url} -  ${JSON.stringify( req.body )} -  ${token['response-time'](req, res)} -ms`
}

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(morganLog));


let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/persons', (req, res) => {
    Person.find({})
    .then( persons => res.json(persons))
})

app.get('/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then( person => res.json(person) )
    .catch( err => res.json( err ) )
 
    //res.status(404).json({msg: `No entry for id: ${id}`})
})

app.delete('/persons/:id', (req, res) => {
    const id = Number( req.params.id )

    data = data.filter( person => person.id !== id)

    res.status(204).end()
})

app.post('/persons', (req,res) => {
    if( !req.body.name || !req.body.number){
        return res.status(400).json({error: 'fields incomplete'})
    }

    let person = new Person({
        name: req.body.name,
        number: req.body.number
    })

    person.save()
    .then( person => res.json(person))
    .catch( err => res.status(500).end('Error at registering') )
})

app.put('/persons/:id', (req, res) => {
    if( !req.body.name || !req.body.number){
        return res.status(400).json({error: 'fields incomplete'})
    }
    data = data.map( person => {
        if( person.id != req.params.id )
            return person
        else    
            return {
                ...person,
                name:req.body.name,
                number: req.body.number
            }
    })
    return res.json( {...req.body} )
})

app.get('/info', (req, res) => {
    res.end(`PhoneBook has info for ${data.length} people
    
    ${new Date()}`)
})


const port = process.env.PORT || 3001
app.listen(port)
console.log(`App running in port ${port}`)