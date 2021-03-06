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
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
  // handler of requests with unknown endpoint

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(morganLog));

app.get('/persons', (req, res) => {
    Person.find({})
    .then( persons => res.json(persons))
})

app.get('/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then( person => {
        if(person)
        res.json(person)
        else
        res.status(404).end()
    })
    .catch( err =>{
        next(err)
    })
 
    //res.status(404).json({msg: `No entry for id: ${id}`})
})

app.delete('/persons/:id', (req, res, next) => {

    Person.findByIdAndRemove(req.params.id)
    .then( () => res.status(204).end() )
    .catch( err => {
        next(err)
    })

})

app.post('/persons', (req,res, next) => {
    /* if( !req.body.name || !req.body.number){
        return res.status(400).json({error: 'fields incomplete'})
    } */

    let person = new Person({
        name: req.body.name,
        number: req.body.number
    })

    person.save()
    .then( person => res.json(person))
    .catch( err => next(err) )
})

app.put('/persons/:id', (req, res,next) => {
    /* if( !req.body.name || !req.body.number){
        return res.status(400).json({error: 'fields incomplete'})
    } */
    let updatedPerson = {
        name:req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, updatedPerson, {new: true, runValidators: true})
    .then( newPerson => res.json( newPerson ))
    .catch( err => next(err))
})

app.get('/info', (req, res) => {
    Person.estimatedDocumentCount({})
    .then( length => {
        res.end(`PhoneBook has info for ${length} people ${new Date()}`)
    } )
})

const errHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })  
  }

  next(err)

}

app.use(unknownEndpoint)
app.use(errHandler)


const port = process.env.PORT || 3001
app.listen(port)
console.log(`App running in port ${port}`)