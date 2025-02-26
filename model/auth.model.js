const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    Username :  {type : String, unique : true },
    email :  {type : String, unique : true , required : true },
    password : {type : String , required : true },
})

const User = mongoose.model('user' , UserSchema)



module.exports = User
