const div1=document.getElementById("div1");
const view=document.getElementById("view");
const crt=document.getElementById("cart");
const log=document.getElementById("log");
const out=document.getElementById("out");
const orders=document.getElementById("orders");
const reset=document.getElementById("reset");
checklogin(function(err)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        log.style.display="none";
        out.style.display="block";
        reset.style.display="block";
        orders.style.display="block";
    }
});
orders.addEventListener("click",function(){
    window.location.href="/myorders";
});
function checklogin(callback)
{
    fetch("/check").then(function(response){
        if(response.status===200)
        {
            callback();
            return;
        }
        else
        {
            callback("something went wrong");
        }
    });
}
getproduct(1,function(error,data){
    if(error)
    {
        console.log(error);
    }
    else{
        if(data.length<5||data.length==0)
        {
            view.style.display="none";
        }
        data.forEach(function(x){
            addtodom(x);
        });
    }
});
function getproduct(all,callback){
    fetch("/products?refresh="+all).then(function(response)
    {
        if(response.status===401)
        {
            throw new Error("something went wrong");
        }
        return response.json();
    }).then(function(pr){
        callback(null,pr);
        return;
    }).catch(function(error){
        callback(error,null);
        return;
    });
}
reset.addEventListener("click",function()
{
    window.location.href="/newpass";
});
log.addEventListener("click",function(event){
    window.location.href="/login";
});
out.addEventListener("click",function(event){
    log.style.display="block";
    out.style.display="none";
    window.location.href="/logout";
});
view.addEventListener("click",function(event){
    getproduct(0,function(error,data)
    {
        if(error)
    {
        console.log(error);
    }
    else{
        if(data.length<5||data.length==0)
        {
            view.style.display="none";
        }
        data.forEach(function(x){
            addtodom(x);
        });   
}
    });
});
function addtodom(prdct)
{
    const divv=document.createElement("div");
    const h2=document.createElement("h2");
    const p=document.createElement("p");
    const p2=document.createElement("p");
    const alert=document.createElement("p");
    const img=document.createElement("img");
    const btn1=document.createElement("button");
    const btn2=document.createElement("button");
    divv.setAttribute("class","product-container");
    btn1.setAttribute("class","btn");
    btn2.setAttribute("class","btn");
    img.src=prdct.filename;
    p.innerHTML="Price: "+prdct.price+"$";
    h2.innerHTML=prdct.product;
    btn1.innerHTML="Add to cart";
    btn2.innerHTML="View desc";
    div1.appendChild(divv);
    divv.appendChild(img);
    divv.appendChild(h2);
    divv.appendChild(p);
    if(prdct.quantity<=0)
    {
        alert.style.textAlign="center";
        alert.innerHTML="Out of stock!";
        alert.style.color="#ff4500";
        alert.style.margin=0;
        btn2.style.marginTop="20px";
        btn2.style.marginLeft="50px";
        divv.appendChild(alert);
        divv.appendChild(btn2);
    }
    else{
    divv.appendChild(btn1);
    divv.appendChild(btn2);
    }
    btn2.addEventListener("click", function (event) {
        openPopup(prdct);
      }); 
    btn1.addEventListener("click",function(event){
        addcart(prdct,function(error)
        {
            if(error==="123")
            {
                window.location.href="/login";
            }
            else if(error)
            {
                p2.style.color="red";
                p2.style.textAlign="center";
                p2.style.margin=0;
                p2.innerHTML="Already Added";
                divv.appendChild(p2);
                setTimeout(function(){
                    divv.removeChild(p2);
                },2000);
            }
            else
            {
                log.style.display="none";
                out.style.display="block";
                reset.style.display="block";
                btn1.innerHTML="Added";
            }
        });
    });
    return;
}
function addcart(pr,callback){
    fetch("/carts",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({prid:pr.prid}),
    }).then(function (response){
        if (response.status === 200) {
          callback();
        }
        else if(response.status===500){
            callback("123");
        }
         else {
          callback("Something went wrong");
        }
      });
}
crt.addEventListener("click",function(event){
    window.location.href="/cart";
});
function openPopup(prdct) {
  const popupContent = document.querySelector(".popup-content");
  popupContent.innerHTML = `
   <span class="close-button" id="close" >&times;</span>
    <img src="${prdct.filename}" alt="${prdct.product}">
    <h2>${prdct.product}</h2>
    <p>Price: ${prdct.price} $</p>
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
