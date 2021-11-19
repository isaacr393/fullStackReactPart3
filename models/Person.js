const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI

mongoose.connect(url)
.then( () => console.log('Connected Succesfully'))
.catch( (err) => console.log('Error at connecting' , err.message))

const PhonebookSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, minLength: 8},
    number: { type: String, required: true, unique: true }
})
PhonebookSchema.plugin(uniqueValidator)

PhonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
const Person = mongoose.model('Person', PhonebookSchema)

module.exports = Person