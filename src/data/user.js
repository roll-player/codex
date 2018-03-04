const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: mongoose.Schema.ObjectID,
    nickname: String,
    authBit: String
})

export default userSchema