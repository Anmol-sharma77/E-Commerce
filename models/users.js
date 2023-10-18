const mongoose=require("mongoose"); 
const usersschema=new mongoose.Schema({
    username:"string",
    mail:"string",
    password:"string",
    isadmin:"Boolean",
    userid:"number",
    verified:"Boolean",
});
const User=mongoose.model("users",usersschema);
module.exports=User;