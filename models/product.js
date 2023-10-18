const mongoose=require("mongoose"); 
const productschema=new mongoose.Schema({
    product:"string",
    des:"string",
    price:"number",
    quantity:"number",
    filename:"string",
    prid:"number",
});
const product=mongoose.model("products",productschema);
module.exports=product;