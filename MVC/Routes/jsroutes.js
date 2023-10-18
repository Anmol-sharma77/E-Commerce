function getcartsjs(request,response){
    response.sendFile(__dirname+"/Scripts/cart.js");
  }
  function getdashjs(request,response){
    response.sendFile(__dirname+"/Scripts/dashboard.js")
  }
  function getnewpassjs(request,response){
    response.sendFile(__dirname+"/Scripts/newpass.js");
  }
  function getadminjs(request,response){
    response.sendFile(__dirname+"/Scripts/admin.js");
  }
  function getselreqjs(request,response){
    response.sendFile(__dirname+"/Scripts/sellerreq.js");
  }
  function getseller(request,response)
  {
    response.sendFile(__dirname+"/Scripts/seller.js");
  }
  function proreq(request,response)
  {
    response.sendFile(__dirname+"/Scripts/productrequest.js");
  }
  function myorders(request,response)
  {
    response.sendFile(__dirname+"/Scripts/myorders.js");
  }
  module.exports={
    getcartsjs,
    getdashjs,
    getnewpassjs,
    getadminjs,
    getselreqjs,
    getseller,
    proreq,
    myorders
  }