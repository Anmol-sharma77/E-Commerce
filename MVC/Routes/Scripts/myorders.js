const div=document.getElementById("div1");
const div2=document.getElementById("oops");
const home =document.getElementById("home");
home.addEventListener("click",function(){
        window.location.href="/";
});
getorders(function(err,data){
    if(err)
    {
        console.log(err);
    }else if(data.length==0)
    {
      div.style.display="none";
      div2.style.display="block";
    }
    else
    {
        console.log(new Date(new Date().getTime()+168*60*60*1000));
        data.forEach(function(x){
            addtodom(x);
        });
    }
});
function getorders(callback){
    fetch("/orders").then(function(response){
        if(response.status!=200)
        {
            callback("Something Went Wrong");
            return;
        }
        return response.json();
    }).then(function(data){
        callback(null,data);
        return;
    }).catch(function(error){
        console.log(error);
        callback("Error");
        return;
    })
}
function addtodom(data)
{
    const div1=document.createElement("div");
    const div2=document.createElement("div");
    const div3=document.createElement("div");
    const div4=document.createElement("div");
    const h2=document.createElement("h2");
    const p1=document.createElement("p");
    const p2=document.createElement("p");
    const p3=document.createElement("p");
    const p4=document.createElement("p");
    const p5=document.createElement("p");
    const p6=document.createElement("p");
    const p7=document.createElement("p");
    const p8=document.createElement("p");
    const p9=document.createElement("p");
    const p10=document.createElement("p");
    const img=document.createElement("img");
    const btn=document.createElement("button");
    div1.setAttribute("class","product-container");
    btn.setAttribute("class","cart2");
    div2.setAttribute("class","img-container");
    div3.setAttribute("class","detail-container");
    div4.setAttribute("class","payment-container");
    img.src=data.img;
    h2.innerHTML=data.product;
    btn.innerHTML="Cancel";
    p10.innerHTML="Total Price:"+data.totalbill;
    p4.innerHTML="Quantity:"+data.quantity;
    p1.innerHTML="Name:"+data.name;
    p2.innerHTML="Phone:"+data.phnum;
    p3.innerHTML="Address:"+data.address+','+data.city+','+data.district+','+data.state;
    p5.innerHTML="Pincode:"+data.pincode;
    p6.innerHTML="Payment Method:"+data.paymentmethod;
    if(data.ordstatus=="Dispatched")
    {
        p7.innerHTML="Order Status: Dispatched to "+data.district+" Postal Service";
    }
    else if(data.ordstatus=="Delivery")
    {
        p7.innerHTML="Order Status: Out for delivery";    
    }
    else
        p7.innerHTML="Order Status:"+data.ordstatus;
    p8.innerHTML="Order Date:"+data.placedDate;
    if(data.canceldate)
    {
        p9.innerHTML="Cancelled Date:   "+data.canceldate;
    }
    else if(data.ordstatus=="Delivery")
    {
        p9.innerHTML="Ariving Date:Expected Today";
    }
    else if(data.ordstatus=="Delivered")
    {
        p9.innerHTML="Delivered Date:"+data.arriveDate;
    }
    else
    {
        p9.innerHTML="Ariving Date:Expected on "+new Date(data.arriveDate).toLocaleDateString();
    }
    div.appendChild(div1);
    div1.appendChild(div2);
    div2.appendChild(img);
    div1.appendChild(div3);
    div1.appendChild(div4);
    div3.appendChild(h2);
    div3.appendChild(p4);
    div3.appendChild(p10);
    div3.appendChild(p1);
    div3.appendChild(p2);
    div3.appendChild(p3);
    div3.appendChild(p5);
    div4.appendChild(p6);
    div4.appendChild(p7);
    div4.appendChild(p8);
    div4.appendChild(p6);
    div4.appendChild(p9);
    console.log(data.ordstatus);
    if(data.ordstatus=="Delivered"||data.ordstatus=="canceled")
    {}
    else
        div4.appendChild(btn);
    btn.addEventListener("click",function(){
        window.location.href="/cancel?ordid="+data.orderid;
    });
}