const con=require("../../models/database");

const mailer=require("../../services/mails/send mails");

var j=0,k=0;

con.connect(function(error){
  if(error) console.log(error);
});

async function saveuser(user,callback)
{
  var d=await queryAsync(`select * from users where mail='${user.mail}'`);
    if(d.length!=0)
    {
      callback("email Exist");
      return;
    }
    else
    {
      user.userid=Math.random();
      id=user.userid;
      user.verified=false;
      con.query("insert into users values('"+user.username+"','"+user.mail+"','"+user.password+"','"+id+"','"+user.verified+"','user')",async function(error,result){
        if(error){
          console.log(error);
        callback(error);
        return;
        }
        else{
        var result=await mailer.sendmail([{Email:user.mail,Name:user.username}],`Wellcome to shop Buddy ${"http://localhost:8000/verify"}?tokken=${id}`);
        callback();
        return;
        }
      });
    }
}
async function deletecart(ob,callback)
{
  try{
    await queryAsync(`delete from cart where prid=${ob.prid} and userid=${ob.userid}`);
    callback();
    return;
  }catch(err)
  {
    callback(err);
    return;
  }
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
async function getcart(num,id, callback) {
  try {
    var carto=[];
    var data=await queryAsync(`select * from cart where userid='${id}'`);
    for(var i=0;i<data.length;i++)
        {
          var data2=await queryAsync(`select * from products where prid=${data[i].prid}`);
          data2[0].quantity2=data[i].quantity;
          carto.push(data2[0]);
        }
        var data3=[];
        var max=num+5;
        if(max>carto.length)
        {
          max=carto.length;
        }
        for(j=num;j<max;j++)
        {
          data3.push(carto[j]);
        }
    callback(null, data3);
  } catch (error) {
    callback(error, null);
  }
}

async function checklogin(log,callback)
{
  var d=await queryAsync(`select * from users where mail='${log.mail}' AND pass='${log.password}'`);
    if(d.length==0)
    {
      callback("Wrong credentials",null);
      return;
    }
    else{
      if(d[0].role=="seller")
      {
        var b=await queryAsync(`select * from sellerinfo where mail='${log.mail}'`);
          if(b.length==0)
          {
            callback("Wrong credentials",null);
            return;
          }
          else{
            d[0].approved=b[0].approved;
            callback(null,d);
            return;
          }
      }
      callback(null,d);
      return;
    }
}
function getproducts(request,callback){
    let pageno=request.query.page||1;
    let itemscount=request.query.item||5;
    let startindex=(pageno-1)*itemscount;
    con.query(`select * from products where status = 'approved' limit ${itemscount} OFFSET ${startindex}`,function(error,data){
      if(error){
      callback(error,[]);
      return;}
      else{
      callback(null,data);
      return;
      }
    });
  }
function saveproduct(data,callback)
{
  con.query("insert into products values('"+data.product+"','"+data.des+"','"+data.price+"','"+data.filename+"','"+data.prid+"','"+data.quantity+"','"+data.sellerid+"','false','pending')",function(error,result){
    if(error){    
      callback(error);
      return;
    }
    else{
    callback();
    return;
    }
  });
}
function updateproduct(data,callback)
{
  con.query(`update products set quantity='${data.quantity}',price='${data.price}',des='${data.desc}',product='${data.product}' where prid='${data.id}'`,function(error,result){
    if(error){    
      callback(error);
      return;
    }
    else{
    callback();
    return;
    }
  });
}
module.exports={
    saveuser,
    saveproduct,
    getproducts,
    checklogin,
    getcart,
    deletecart,
    updateproduct
};