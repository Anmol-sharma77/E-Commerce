const fs=require("fs");

const con=require("../../models/database");

const mailer=require("../../services/mails/send mails");

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
async function rejectproduct(request,response)
  {
    const id=request.body.id;
    const file=request.body.img;
    try{
    await queryAsync(`update products set status="reject" where prid='${id}'`);
    response.status(200);
    response.send();
    }catch(err)
    {
      console.log(err);
      response.status(400);
      response.send();
    }
}
functionroutes=require("./function");
async function delpro(request,response){
    const data=request.body;
    const filename=data.file;
    try{
    await queryAsync(`delete from products where prid='${data.id}'`);
      await queryAsync(`delete from cart where prid='${data.id}'`);
            fs.unlink(`uploads/${filename}`, (err) => {
              if (err) {
                console.error("Error deleting image file:", err);
              }
        });
        response.status(200);
        response.send();
      }catch(error){
      response.status(500);
      response.send(error);
    }
  }
  function delcart(request,response){
    let data=request.body;
    data.userid=request.session.userid;
    functionroutes.deletecart(data,function(error){
      if(error){
        console.log(error);
        response.status(400);
        response.send();
      }
      else
      {
        response.status(200);
        response.send();
      }
    });
  }
  async function postreject(request,response)
  {
    const id=request.body.id;
    const file1=request.body.img1;
    const file2=request.body.img2;
    const name=request.session.username;
    const mail=request.body.mail;
    await queryAsync(`delete from users where userid=${id}`);
    con.query(`delete from sellerinfo where sellerid=${id}`,async function(error,data)
    {
      if(error)
      {
        console.log(error);
        response.status(400);
        response.send();
      }
      else
      {
        fs.unlink(`uploads/${file1}`, (err) => {
          if (err) {
            console.error("Error deleting image file:", err);
          }
        });
        fs.unlink(`uploads/${file2}`, (err) => {
          if (err) {
            console.error("Error deleting image file:", err);
          }
        });
        await mailer.sendmail([{Email:mail,Name:name}],`<h1>Welcome to shop Buddy</h1><br><h3>Your request is rejected by Admin....Please Recheck your details and try again</h3>`);
        response.status(200);
        response.send();
      }
    });
  }
module.exports={delpro,
  delcart,
  rejectproduct,
  postreject
};