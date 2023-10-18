const home=document.getElementById("home");
const div1=document.getElementById("div1");
const more=document.getElementById("view");
const div2=document.getElementById("oops");
const buy=document.getElementById("buy");
// const swal=require('sweetalert2');
var num=0;
var obj;
getproduct(function(error,data){
    if(error)
    {
        console.log(error);
    }
    else{
        if(data.length==0)
        {
            div1.style.display="none";
            div2.style.display="block";
            more.style.display="none";
            buy.style.display="none";
        }
        if(data.length<5)
        {
            more.style.display="none";
        }
        obj=data;
        num+=5;
        data.forEach(function(x){
         addtodom(x);
    });
}
});
buy.addEventListener("click",function(){
    var count=0;
    obj.forEach(function(x){
        if(x.quantity<x.quantity2)
        {
            swal({
                title: 'Error!',
                text: 'Product is out of stock',
                icon: 'error',
                confirmButtonText: 'Cool'
              });
              count++;
        }
    });
    if(count==0)
    window.location.href="/buyproduct";
});
function getproduct(callback){
    fetch("/cartproduct?num="+num).then(function(response)
    {
        if(response.status!==200)
        {
            throw new Error("something went wrong");
        }
        return response.json();
    }).then(function(pr){
        callback(null,pr);
    }).catch(function(error){
        callback(error,null);
    });
}
function addtodom(prdct)
{
    const divv=document.createElement("div");
    const h2=document.createElement("h2");
    const p=document.createElement("p");
    const img=document.createElement("img");
    const btn1=document.createElement("button");
    const btn2=document.createElement("button");
    const quan=document.createElement("span");
    const p3=document.createElement("p");
    const alert=document.createElement("p");
    p3.style.color="#ff4500";
    p3.style.textAlign="center";
    divv.setAttribute("class","product-container");
    const p2=document.createElement("p");
    const add=document.createElement("button");
    const sub=document.createElement("button");
    btn1.setAttribute("class","btn");
    btn2.setAttribute("class","btn");
    quan.innerHTML=prdct.quantity2;
    add.innerHTML="+";
    sub.innerHTML="-";
    add.style.marginLeft="10px";
    sub.style.marginLeft="10px";
    quan.style.marginLeft="10px";
    p2.innerHTML="Quantity:";
    img.src=prdct.filename;
    p.innerHTML="Price: "+prdct.price+" $";
    h2.innerHTML=prdct.product;
    btn1.innerHTML="Delete";
    btn2.innerHTML="View desc";
    var removed=false;
    div1.appendChild(divv);
    divv.appendChild(img);
    divv.appendChild(h2);
    divv.appendChild(p);
    if(prdct.quantity<prdct.quantity2)
    {
        alert.style.textAlign="center";
        alert.innerHTML="Out of stock!";
        alert.style.color="#ff4500";
        divv.appendChild(alert);
    }
    else{
        divv.appendChild(p2);
        p2.appendChild(quan);
        p2.appendChild(add);
        p2.appendChild(sub);
    }
    divv.appendChild(btn1);
    divv.appendChild(btn2);
    btn2.addEventListener("click", function (event) {
        openPopup(prdct);
      });
    btn1.addEventListener("click",function(){
        deletecart(prdct,function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                var ob2=[];
                ob2=obj.filter(function(x){
                    return x._id!=prdct._id
                });
                obj=ob2;
                div1.removeChild(divv);
                if(!div1.hasChildNodes())
                {
                div1.style.display="none";
                div2.style.display="block";
                more.style.display="none";
                buy.style.display="none";
                }
            }
        });
    });
    add.addEventListener("click",function(event)
    {
        event.preventDefault();
        if(prdct.quantity<=prdct.quantity2)
        {
            p3.innerHTML="You have reached the maximum limit";
            removed=false;
                divv.appendChild(p3);
                setTimeout(function(){
                    if(!removed){
                    divv.removeChild(p3);
                    removed=true;
                    }
                    },2000);
        }
        else{
        cartbutton(1,0,prdct,function(error,q){
        if(error)
        {
            console.log(error);
        }
        else{
                prdct.quantity2=q;
                quan.innerHTML=q;
            }
    });}
    });
    sub.addEventListener("click",function(event)
    {
        event.preventDefault();
        if(prdct.quantity2>1)
        {
        cartbutton(0,1,prdct,function(error,q){
        if(error)
        {
            console.log(err);
        }
        else{
            quan.innerHTML=q;
            prdct.quantity2=q;
        }
    });
}
     else
     {
        p3.innerHTML="You have reached the minimum limit";
        divv.appendChild(p3);
        removed=false;
        setTimeout(function(){
            if(!removed){
            divv.removeChild(p3);
            removed=true;
            }
            },2000);
     }
    });
}
function cartbutton(add,sub,data,callback){
    fetch("/addsub",{
        method:"POST",
        headers:{ "Content-Type": "application/json" },
        body:JSON.stringify({"id":data.prid,"add":add,"sub":sub,"quan":data.quantity2,"quan2":data.quantity}) 
    }).then(function(response){
        if(response.status===200)
        {
            return response.json()
        }
    }).then(function(x){
        callback(null,x);
    })
}
home.addEventListener("click",function(){
    window.location.href="/";
});
function deletecart(data,callback)
{
    fetch("/delcart",{
        method:"DELETE",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({prid:data.prid,userid:data.userid}),
    }).then(function(response){
        if(response.status===200)
        {
            callback();
            return;
        }
        else
        {
            callback("Something Went Wrong");
            return;
        }
    })
}
more.addEventListener("click",function(){
    getproduct(function(error,data){
        if(error)
        {
            console.log(error);
        }
        else{
            if(data.length<5||data.length==0)
            {
                more.style.display="none";
            }
            num+=5;
            data.forEach(function(x){
             addtodom(x);
        });
    }
    });
});
function openPopup(prdct) {
    const popupContent = document.querySelector(".popup-content");
    popupContent.innerHTML = `
     <span class="close-button" id="close" >&times;</span>
      <img src="${prdct.filename}" alt="${prdct.product}">
      <h2>${prdct.product}</h2>
      <p>Price:$ ${prdct.price}</p>
      <p>Description: ${prdct.des}</p>
    `;
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("close");
    popup.style.display = "block";
    closeBtn.addEventListener("click", function () {
      popup.style.display = "none";
    });
    window.addEventListener("click", function (e) {
      if (e.target === popup) {
        popup.style.display = "none";
      }
    });
  }