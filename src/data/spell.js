const mongoose = require('mongose')

const Spell = mongoose.Schema({
    id: mongoose.Schema.ObjectID,
    name: String,
    description: String,
    level: Number
})

export default Spell