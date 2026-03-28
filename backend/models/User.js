//Stores login + role
const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["senior","fresher"]
    },
    college:String,
    branch:String
})

module.exports=mongoose.model("User",userSchema)