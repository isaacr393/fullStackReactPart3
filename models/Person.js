const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
.then( () => console.log('Connected Succesfully'))
.catch( (err) => console.log('Error at connecting' , err.message))

const PhonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})
PhonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
const Person = mongoose.model('Person', PhonebookSchema)

module.exports = Person