const con = require("../../models/database");

const queryAsync = (sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
function waiting2(request, response) {
  if (request.session.role == "seller") {
    request.session.login = false;
    response.render("waiting2");
  }
  else {
    response.redirect("/404");
  }
}
function monthlyreport(request, response) {
  if (request.session.role == "seller") {
    response.render("monthlyrequest");
  }
  else {
    response.redirect("/404");
  }
}
function cancelorder(request, response) {
  if (request.session.role == "seller") {
    response.render("cancelorder");
  }
  else {
    response.redirect("/404");
  }
}
async function allsellers(request, response) {
  try {
    var user = await queryAsync(`select * from sellerinfo`);
    response.status(200);
    response.json(user);
  } catch (error) {
    response.status(400);
    response.send();
  }
}
async function allusers(request, response) {
  try {
    var user = await queryAsync(`select * from users where role='user'`);
    response.status(200);
    response.json(user);
  } catch (error) {
    response.status(400);
    response.send();
  }
}
function sellerpage(request, response) {
  if (request.session.role == "admin") {
    response.render("allseller");
  }
  else {
    response.redirect("/404");
  }
}
function getsellersign(request, response) {
  response.render("sellersign");
}
function buyrequest(request, response) {
  if (request.session.role == "seller") {
    response.render("buyRequest");
  }
  else {
    response.redirect("/404");
  }
}
function approveorder(request, response) {
  if (request.session.role == "seller") {
    response.render("approvedrequest");
  }
  else {
    response.redirect("/404");
  }
}
async function totalproduct(request, response) {
  let count=await queryAsync(`select count(prid) as count from products where status="approved"`);
    response.status(200).json({count:count[0].count});
}
function getseller(request, response) {
  if (request.session.role == "seller")
    response.render("seller");
  else
    response.redirect("/404");
}
const functionroutes = require("./function");
function gethome(request, response) {
  if (request.session.role == "admin") {
    response.redirect("/admin");
  }
  else if (request.session.role == "seller") {
    response.redirect("/sellers");
  }
  else if (request.session.role == "distributer") {
    response.redirect('/distributers');
  } else if (request.session.role == "deliverer") {
    response.redirect('/deliverer');
  }
  else {
    response.redirect("/dashboard");
  }
}

function deliverer(request, response) {
  if (request.session.role == "deliverer")
    response.render("delivery");
  else
    response.redirect("/404");
}
function distributer(request, response) {
  if (request.session.role == "distributer")
    response.render("distributer");
  else
    response.redirect("/404");
}
function getproducts(request, response) {
  functionroutes.getproducts(request, function (error, data) {
    if (error) {
      response.status(401);
      response.send();
    }
    else {
      response.status(200);
      response.json(data);
    }
  });
}
function getdash(request, response) {
  response.render("dashboard", { loggedin:request.session.login||null});
}
function getadmin(request, response) {
  if (!request.session.login) {
    response.redirect("/login");
  }
  else if (request.session.role == "admin") {
    response.render("admin", { error: null });
  }
  else {
    response.redirect("/404");
  }
}
function getcart(request, response) {
  if (request.session.login) {
    if (request.session.role == "user")
      response.render("cart", { error: null });
    else
      response.redirect("/404");
  }
  else {
    response.redirect("/login");
  }
}
function getstyle(request, response) {
  response.sendFile(__dirname + "/style.css");
}
function getlogin(request, response) {
  if (request.session.login) {
    if (request.session.verified) {
      response.redirect("/");
    }
    else {
      response.render("login", { error: null });
    }
  }
  else {
    response.render("login", { error: null });
  }
}
function getsignup(request, response) {
  if (request.session.login) {
    response.redirect("/");
  }
  else {
    response.render("signup", { error: null });
  }
}
function proreq(request, response) {
  if (request.session.role == "admin")
    response.render("productrequest");
  else
    response.redirect("/404");
}
async function proreqdata(request, response) {
  try {
    data = await queryAsync(`select * from products where status = 'pending'`);
    for (i = 0; i < data.length; i++) {
      user = await queryAsync(`select * from sellerinfo where sellerid='${data[i].sellerid}'`);
      data[i].seller = user[0].name;
    }
    response.status(200);
    response.json(data);
  } catch (error) {
    console.log(error);
    response.status(400);
    response.send();
  };
}
async function pendingrequest(request, response) {
  var num = request.query.num;
  num = parseInt(num);
  try {
    let data = await queryAsync(`select * from products where status = 'pending'`);
    if (data.length == 0) {
      response.status(200);
      response.json([]);
    }
    if (data.length != 0) {
      let data2 = [];
      var max = num + 5;
      if (max > data.length) {
        max = data.length;
      }
      for (j = num; j < max; j++) {
        data2.push(data[j]);
      }
      response.status(200);
      response.json(data2);
    }
  } catch (error) {
    console.log(error);
    response.status(400);
    response.send();
  };
}
function allrequest(request, response) {
  if (request.session.role == "seller") {
    response.render("pending");
  }
  else {
    response.redirect("/404");
  }
}
async function getadminproducts(request, response) {
  var num = request.query.num;
  num = parseInt(num);
  try {
    let data = await queryAsync(`select * from products where status = "approved"`);
    if (data.length != 0) {
      let data2 = [];
      var max = num + 5;
      if (max > data.length) {
        max = data.length;
      }
      for (j = num; j < max; j++) {
        data2.push(data[j]);
      }
      response.status(200);
      response.json(data2);
    }
  } catch (error) {
    response.status(400);
    response.send();
  };
}
function getnewpass(request, response) {
  if (request.session.login || request.session.sendmail)
    response.render("newpass");
  else {
    response.redirect("/login");
  }
}
function get404(request, response) {
  response.render("404");
}
function getcartproducts(request, response) {
  var num = request.query.num;
  if (request.session.login) {
    var id = request.session.userid;
    functionroutes.getcart(num, id, function (error, product) {
      if (error) {
        response.status(401);
        console.log(error);
        response.send();
      }
      else
        response.status(200);
      response.json(product);
    });
  }
  else {
    response.redirect("/login");
  }
}
function getverify(request, response) {
  const token = request.query.tokken;
  queryAsync(`update users set verified=${true} where userid=${token}`).then(response)
  {
    request.session.verified = true;
    response.render("verified");
  }
}
function getstar(request, response) {
  response.redirect("/404");
}
function getforgot(request, response) {
  if (!request.session.login)
    response.render("forgot");
  else
    response.redirect("/");
}
function getwaiting(request, response) {
  if (request.session.verified)
    response.redirect("/");
  else
    response.render("waiting");
}
async function getforgotpass(request, response) {
  request.session.sendmail = true;
  const token = request.query.tokken;
  try {
    var data = await queryAsync(`select * from users where userid='${token}'`);
    if (data) {
      response.redirect("/newpass");
    }
    else {
      response.redirect("*");
    }
  } catch (error) {
    response.redirect("*");
  }
}
function getlogout(request, response) {
  request.session.destroy();
  j = 0;
  k = 0;
  response.redirect("/login");
}
function getselreq(request, response) {
  if (request.session.role == "admin")
    response.render("sellerreq");
  else
    response.redirect("/404");
}
function getsignstyle(request, response) {
  response.sendFile(__dirname + "/sign style.css");
}
async function selreqdata(request, response) {
  try {
    data = await queryAsync(`select * from sellerinfo where approved is false`);
    response.status(200);
    response.json(data);
  } catch (error) {
    response.status(400);
    response.send();
  };
}
async function rejectrequest(request, response) {
  var num = request.query.num;
  num = parseInt(num);
  try {
    let data = await queryAsync(`select * from products where status = 'reject'`);
    if (data.length == 0) {
      response.status(200);
      response.json([]);
    }
    if (data.length != 0) {
      let data2 = [];
      var max = num + 5;
      if (max > data.length) {
        max = data.length;
      }
      for (j = num; j < max; j++) {
        data2.push(data[j]);
      }
      response.status(200);
      response.json(data2);
    }
  } catch (error) {
    console.log(error);
    response.status(400);
    response.send();
  };
}
function buyproduct(request, response) {
  if (request.session.role == "user") {
    response.render("buypage");
  }
  else {
    response.redirect("/404");
  }
}
async function sellerpro(request, response) {
  var num = request.query.num;
  num = parseInt(num);
  try {
    let data2 = [];
    let data = await queryAsync(`select * from products where sellerid ='${request.session.userid}' and status='approved'`);
    if (data.length != 0) {
      var max = num + 5;
      if (max > data.length) {
        max = data.length;
      }
      for (j = num; j < max; j++) {
        data2.push(data[j]);
      }
    }
    response.status(200);
    response.json(data2);
  } catch (error) {
    response.status(400);
    response.send();
  };
}
function myorders(request, response) {
  if (request.session.role == "user") {
    response.render("myorders");
  }
  else {
    response.redirect("/404");
  }
}
async function buyproducts(request, response) {
  try {
    id = request.session.userid;
    data = await queryAsync(`select * from cart where userid=${id}`);
    let data2 = [];
    for (i = 0; i < data.length; i++) {
      products = await queryAsync(`SELECT product,price FROM products WHERE prid='${data[i].prid}'`);
      products[0].quantity = data[i].quantity;
      data2.push(products);
    }
    response.status(200);
    response.json(data2);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
async function orders(request, response) {
  try {
    var id = request.session.userid;
    var orders = await queryAsync(`select * from orders where userid=${id}`);
    let data2 = [];
    for (i = 0; i < orders.length; i++) {
      var product = await queryAsync(`select product,price,filename from products where prid=${orders[i].prid}`);
      orders[i].product = product[0].product;
      orders[i].price = product[0].price;
      orders[i].img = product[0].filename;
      data2.push(orders[i]);
    };
    response.status(200);
    response.json(data2);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
async function buyorders(request, response) {
  try {
    var id = request.session.userid;
    var orders = await queryAsync(`select * from orders where sellerid=${id} and ordstatus="pending"`);
    let data2 = [];
    for (i = 0; i < orders.length; i++) {
      var product = await queryAsync(`select product,price,filename from products where prid=${orders[i].prid}`);
      orders[i].product = product[0].product;
      orders[i].price = product[0].price;
      orders[i].img = product[0].filename;
      data2.push(orders[i]);
    };
    response.status(200);
    response.json(data2);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
function deliveredorder(request, response) {
  if (request.session.role == "seller") {
    response.render("deliveredorders");
  }
  else {
    response.redirect("/404");
  }
}
async function cancelorders(request, response) {
  id = request.session.userid;
  try {
    var orders = await queryAsync(`select *,orders.quantity as quantity from orders cross JOIN products on products.prid=orders.prid where orders.ordstatus="canceled" and orders.sellerid=${id};`)
    response.status(200);
    response.json(orders);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
async function deliversorders(request, response) {
  id = request.session.userid;
  try {
    var orders = await queryAsync(`select *,orders.quantity as quantity from orders cross JOIN products on products.prid=orders.prid where orders.ordstatus="delivered" and orders.sellerid=${id};`);
    response.status(200);
    response.json(orders);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
async function deliverorders(request, response) {
  try {
    var orders = await queryAsync(`select * from orders where ordstatus="Delivery"`);
    let data2 = [];
    for (i = 0; i < orders.length; i++) {
      var product = await queryAsync(`select product,price,filename from products where prid=${orders[i].prid}`);
      orders[i].product = product[0].product;
      orders[i].price = product[0].price;
      orders[i].img = product[0].filename;
      data2.push(orders[i]);
    };
    response.status(200);
    response.json(data2);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
function cancelpage(request, response) {
  id = request.query.ordid;
  request.session.cancelid = id;
  if (request.session.role == "user") {
    response.render("cancel page");
  }
  else {
    response.redirect("/404");
  }
}
async function dispatchedorders(request, response) {
  try {
    var orders = await queryAsync(`select * from orders where ordstatus="Dispatched"`);
    let data2 = [];
    for (i = 0; i < orders.length; i++) {
      var product = await queryAsync(`select product,price,filename from products where prid=${orders[i].prid}`);
      orders[i].product = product[0].product;
      orders[i].price = product[0].price;
      orders[i].img = product[0].filename;
      data2.push(orders[i]);
    };
    response.status(200);
    response.json(data2);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
async function approveorders(request, response) {
  try {
    var id = request.session.userid;
    var orders = await queryAsync(`select * from orders where sellerid=${id} and ordstatus="approved"`);
    let data2 = [];
    for (i = 0; i < orders.length; i++) {
      var product = await queryAsync(`select product,price,filename from products where prid=${orders[i].prid}`);
      orders[i].product = product[0].product;
      orders[i].price = product[0].price;
      orders[i].img = product[0].filename;
      data2.push(orders[i]);
    };
    response.status(200);
    response.json(data2);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
async function getreport(request, response) {
  id = request.session.userid;
  month = request.query.month;
  year = request.query.year;
  try {
    var report = await queryAsync(`SELECT o.sellerid, o.prid, o.arrivedate AS deliverymonth, SUM(o.quantity) AS totalquantity
      FROM orders o
      WHERE o.arrivedate like "%${month}% ${year}%" and ordstatus="delivered" and sellerid=${id}
      GROUP BY o.sellerid, o.prid,DATE_FORMAT(o.arrivedate, '%b %Y')`);
    let obj = [];
    for (i = 0; i < report.length; i++) {
      let data = await queryAsync(`select price,product from products where prid=${report[i].prid}`);
      data[0].quantity = report[i].totalquantity;
      obj.push(data[0]);
    }
    response.status(200);
    response.json(obj);
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
  }
}
module.exports = {
  gethome,
  getdash,
  getadmin,
  getproducts,
  getcart,
  getstyle,
  getlogin,
  getsignup,
  getadminproducts,
  getnewpass,
  get404,
  getcartproducts,
  getverify,
  getstar,
  getforgot,
  getwaiting,
  getforgotpass,
  getlogout,
  totalproduct,
  getsellersign,
  getsignstyle,
  getselreq,
  selreqdata,
  getseller,
  sellerpro,
  proreq,
  proreqdata,
  allrequest,
  pendingrequest,
  rejectrequest,
  sellerpage,
  allsellers,
  allusers,
  buyproduct,
  buyproducts,
  myorders,
  orders,
  buyrequest,
  buyorders,
  approveorder,
  approveorders,
  dispatchedorders,
  distributer,
  deliverorders,
  deliverer,
  cancelpage,
  cancelorder,
  cancelorders,
  deliveredorder,
  deliversorders,
  monthlyreport,
  getreport,
  waiting2
};