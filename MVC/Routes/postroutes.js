const mailer=require("../../services/mails/send mails");

const con=require("../../models/database");

const functionroutes=require("./function");

function postproduct(request,response){
    const data=request.body;
    const img=request.files;
    data.prid=Math.random();
    data.filename=img[0].filename;
    data.sellerid=request.session.userid;
    functionroutes.saveproduct(data,function(error){
      if(error)
      {
        response.status(400);
        response.send();
      }
      else
      response.status(200);
      response.json(data);
    })
  }
  async function postseller(request,response)
  {
    data=request.body;
    data.sellerid=Math.random();
    data.adhaar=request.files[1].filename;
    data.sellimg=request.files[0].filename;
    try{
      user= await queryAsync(`select * from users where mail='${data.mail}'`);
      if(user.length==0){
    await queryAsync(`insert into users values('${data.name}','${data.mail}','${data.pass}','${data.sellerid}',false,"seller")`);
    await queryAsync(`insert into sellerinfo values('${data.name}','${data.age}','${data.dis}','${data.state}','${data.orgn}','${data.mail}','${data.sellerid}','${data.adhaar}',false,'${data.pass}',${data.accnum},'${data.ifsccode}','${data.gstnum}','${data.sellimg}')`);
    await mailer.sendmail([{Email:data.mail,Name:data.name}],`<h1>Welcome to shop Buddy</h1><br><h3>We got your request to be a seller .To be A sellor<a href=${"http://localhost:8000/verify"}?tokken=${data.sellerid}> Click here to verify</a></h3>`);
    response.status(200)
    response.send();
      }
      else
      {
        response.status(500);
        response.send();
      }
    }catch(err)
    {
      console.log(err);
      response.status(400);
      response.send();
    }
  }
  async function approvebyseller(request,response)
  {
    id=request.body.id;
    console.log(id);
    try{
    await queryAsync(`update orders set ordstatus="approved" where orderid=${id}`);
    console.log(data);
    response.status(200);
    response.send();
    }catch(error)
    {
      console.log(error);
      response.status(500);
      response.send();
    }
  }
  async function deliveredbydeliverer(request,response)
  {
    id=request.body.id;
    try{
    await queryAsync(`update orders set ordstatus="Delivered",arriveDate='${Date(Date.now())}' where orderid=${id}`);
    response.status(200);
    response.send();
    }catch(error)
    {
      console.log(error);
      response.status(500);
      response.send();
    }
  }
  async function deliverbydistributer(request,response)
  {
    id=request.body.id;
    try{
    await queryAsync(`update orders set ordstatus="Delivery" where orderid=${id}`);
    response.status(200);
    response.send();
    }catch(error)
    {
      console.log(error);
      response.status(500);
      response.send();
    }
  }
  async function dispatchbyseller(request,response)
  {
    id=request.body.id;
    try{
    await queryAsync(`update orders set ordstatus="Dispatched" where orderid=${id}`);
    response.status(200);
    response.send();
    }catch(error)
    {
      console.log(error);
      response.status(500);
      response.send();
    }
  }
  async function cancelproduct(request,response){
    var orderid=request.session.cancelid;
    body=request.body;
    try{
      var x=await queryAsync(`select prid,quantity from orders where orderid=${orderid}`);
      await queryAsync(`update orders set ordstatus="canceled",canceldate='${Date(Date.now())}',cancelreason='${body.reason}',cancelcomment='${body.comment}' where orderid=${orderid}`);
      await queryAsync(`update products set quantity=quantity+${x[0].quantity} where prid=${x[0].prid}`);
      response.status(200);
      response.send();
    }catch(err){
      console.log(err);
      response.status(500);
      response.send();
    }
  }
  async function buycart(request,response){
    try{
        let id=request.session.userid;
        let body=request.body;
          let cart=await  queryAsync(`select * from cart where userid=${id}`);
          cart.forEach(async function(x)
          {
            let seller=await queryAsync(`select quantity,sellerid,price from products where prid=${x.prid}`);
            queryAsync(`insert into orders values('${Math.random()}','${x.prid}','${id}','${seller[0].sellerid}','${body.name}','${body.phn}','${Date(Date.now())}',"pending",'${new Date(new Date().getTime()+168*60*60*1000)}','${body.adr}','${body.state}','${body.dis}','${body.method}','pending','${x.quantity}','${x.quantity*seller[0].price}','${body.pincode}', NULL,NULL,'${body.city}',NULL)`);
            await queryAsync(`delete from cart where prid=${x.prid}`);
            await queryAsync(`update products set quantity=${seller[0].quantity-x.quantity} where prid=${x.prid}`);
            
          });
          response.status(200);
          response.send();
    }catch(error)
    {
      console.log(error);
      response.status(500);
      response.send();
    }
  }
  function postlogin(request,response)
  {
    const log=request.body;
    if(log.mail===""&&log.password==="")
    {
      response.render("login",{error:"Please enter details"});
    }
    functionroutes.checklogin(log,function(error,user){
      if(error)
      {
        response.status(200);
        response.render("login",{error:"Invalid credentials"});
        response.send();
      }
      else{
        response.status(200);
        user=user[0];
        if(user.verified||user.approved)
        request.session.login=true;
        request.session.userid=user.userid;
        request.session.username=user.username;
        request.session.role=user.role;
        request.session.verified=user.verified;
        request.session.approved=user.approved;
        if(user.role=="seller")
        {
          if(user.approved)
          {
            if(user.verified)
            response.redirect("/");
            else
            response.redirect("/waiting");
          }
          else
          {
            response.redirect("/waiting2")
          }
        }
        else if(user.verified)
        response.redirect("/");
        else
        {
          response.redirect("/waiting");
        }
      }
    })
  }
  async function approveproduct(request,response)
  {
    const id=request.body.id;
    try{
    await queryAsync(`update products set status="approved" where prid=${id}`);
    response.status(200);
    response.send();
    }catch(err)
    {
      response.status(400);
      response.send();
    }
}
  function postsignup(request,response){
    const data=request.body;
    if(data.mail===""||data.username===""||data.password==="")
    {
      response.render("signup",{error:"Please enter something"});
    }
    else
    functionroutes.saveuser(data,function(err)
    {
      if(err)
      {
        response.render("signup",{error:"Email is already exist"});
      }
      else{
        response.status(200);
        response.redirect("/waiting");
      }
    })
  }
  const queryAsync = (sql) => {
    return new Promise((resolve, reject) => {
      con.query(sql ,(err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  async function postchangepass(request,response){
    const userid = request.session.userid;
    const data=request.body;
    try{
      console.log("body",data);
    var user=await queryAsync(`select * from users where userid=${userid}`);
      user=user[0];
      await queryAsync(`update users set pass='${data.pass}' where userid=${userid}`);
      await mailer.sendmail([{Email:user.mail,Name:user.username}],`Wellcome to shop Buddy <br>Dear cutomer with mail: ${user.mail}<br>Your Password is changed sucessfully`);
        response.status(200);
        response.send();
  }catch(error){
      response.status(500);
      response.send();
    };
  }
 async function postforgots(request,response){
    const mail=request.body.email;
    queryAsync(`select * from users where mail='${mail}'`).then(async function(user){
      if(!user)
      {
        response.status(400);
        response.send();
      }
      else
      {
        user=user[0];
        request.session.userid=user.userid;
        await mailer.sendmail([{Email:user.mail,Name:user.username}],`Wellcome to shop Buddy<br>This mail is for Forgot password..If this request is not from you then ignore it <br> <a href=${"http://localhost:8000/forgotpass"}?tokken=${user.userid}>Click Here To Verify</a>`);
        response.status(200);
        response.send();
      }
    }).catch(function(error){
        response.status(402);
        response.send();
    });
  }
  function postupdate(request,response){
    const data = request.body;
    functionroutes.updateproduct(data,function(err){
      if(err)
      {
        response.status(500);
        response.send();
      }
      else{
        response.status(200);
        response.send();
      }
    })
  }
  function postaprove(request,response)
  {
    const id=request.body.id;
    const name=request.session.username;
    const mail=request.body.mail;
    con.query(`update sellerinfo set approved=true where sellerid='${id}'`,async function(error,data)
    {
      if(error)
      {
        console.log(error);
        response.status(400);
        response.send();
      }
      else
      {
        await mailer.sendmail([{Email:mail,Name:name}],`<h1>Welcome to shop Buddy</h1><br><h3>Congratulation for becoming a Seller...Your request is Approved by Admin</h3>`);
        response.status(200);
        response.send();
      }
    });
  }
  async function postcarts(request,response){
    if(request.session.login)
    {
    var data=request.body;
    data.userid=request.session.userid;
    data.quantity=1;
      con.query(`select * from cart where prid='${data.prid}'and userid='${data.userid}'`,function(error,res){
        if(res.length==0)
        {
          con.query(`insert into cart values('${data.prid}','${data.userid}','${1}')`,function(error,res){
          response.status(200);
          response.send();
          });
        }
        else
      {
        response.status(400)
        response.send();
      }
    });
  }
    else
    {
      response.status(500);
      response.send();
    }
  }
  async function postaddsub(request,response){
    var data=request.body;
    id=request.session.userid;
    if(data.add)
    {
      await queryAsync(`update cart set quantity='${data.quan+1}' where prid='${data.id}' and userid='${id}' `);
        response.status(200);
        response.json(data.quan+1);
    }
    else
    {
      await queryAsync(`update cart set quantity='${data.quan-1}' where prid='${data.id}'and userid='${id}'`);
        response.status(200);
        response.json(data.quan-1);
    }
  }
module.exports={
    postproduct,
    postlogin,
    postsignup,
    postforgots,
    postchangepass,
    postupdate,
    postcarts,
    postaddsub,
    postseller,
    postaprove,
    approveproduct,
    buycart,
    approvebyseller,
    dispatchbyseller,
    deliverbydistributer,
    deliveredbydeliverer,
    cancelproduct
};
