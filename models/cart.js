const mongoose=require("mongoose"); 
const cartschema=new mongoose.Schema({
    prid:"number",
    userid:"number",
    quantity:"number",
});
const cart=mongoose.model("cart",cartschema);
module.exports=cart;