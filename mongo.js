const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log(`Please provide the password as an argument: node mongo.js <password>
    Additionally you can provide data to add a new person to the phonebook with the format
    <password> <name> <number>`)
    process.exit(1)
}
let type = 'LIST'
if (process.argv.length === 3)
    type = 'LIST'
else if (process.argv.length > 3)
    type = 'CREATE'

const password = process.argv[2]
const url = `mongodb+srv://irivas:${password}@cluster0.iyw8v.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)
const PhonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', PhonebookSchema)

if( type === 'CREATE'){
    const name = process.argv[3]
    const number = process.argv[4]

    let newPerson = new Person({
        name,
        number
    })
    newPerson.save()
    .then(result => {
        console.log(`Person created succesfully ${name}, ${number}`)
        mongoose.connection.close()
        process.exit(1)
    })
}else if (type === 'LIST' ){
    let persons = Person.find({})
    .then(result => {
        result.forEach( person => console.log(person))
        mongoose.connection.close()
        process.exit(1)
    })
    .catch( err => {
        console.log(err)
        mongoose.connection.close()
        process.exit(1)
    })
}
