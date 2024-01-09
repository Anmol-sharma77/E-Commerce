const div1=document.getElementById("div1");
var num=0;
const more=document.getElementById("view");
const lgout=document.getElementById("lgout");
const reqbtn=document.getElementById("selreq");
const proreq=document.getElementById("proreq");
const seller=document.getElementById("seller");
const reset=document.getElementById("reset");
getproduct(function(error,data){
    if(error)
    {
        console.log(error);
    }
    else{
        if(data.length==0||data.length<5){
            more.style.display="none";
        }else{
            more.style.display="block";
        }
    num+=5;
    data.forEach(function(x){
     addtodom(x);
    })
}
});
reset.addEventListener("click",function()
{
    window.location.href="/newpass";
});
lgout.addEventListener("click",function(){
    window.location.href="/logout";
});
seller.addEventListener("click",function(){
    window.location.href="/sellerpage";
});
function addtodom(prdct)
{
    const divv=document.createElement("div");
    const h2=document.createElement("h2");
    const p=document.createElement("p");
    const p2=document.createElement("p");
    const img=document.createElement("img");
    const btn2=document.createElement("button");
    divv.setAttribute("class","product-container");
    btn2.setAttribute("class","btn");
    img.src=prdct.filename;
    p.innerHTML="Price: "+prdct.price;
    h2.innerHTML=prdct.product;
    btn2.innerHTML="View desc";
    div1.appendChild(divv);
    divv.appendChild(img);
    divv.appendChild(h2);
    divv.appendChild(p);
    divv.appendChild(btn2);
    btn2.addEventListener("click", function (event) {
        openPopup(prdct);
      });
}
function getproduct(callback){
    fetch("/adminproducts?num="+num).then(function(response)
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
reqbtn.addEventListener("click",function(){
    window.location.href="/selreq";
});
proreq.addEventListener("click",function(){
    window.location.href="/productrequest";
});
function openPopup(prdct) {
    const popupContent = document.querySelector(".popup-content");
    popupContent.innerHTML = `
     <span class="close-button" id="close" >&times;</span>
      <img src="${prdct.filename}" alt="${prdct.product}">
      <h2>${prdct.product}</h2>
      <p>Price: ${prdct.price}</p>
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
  more.addEventListener("click",function()
  {
    getproduct(function(error,data){
        if(error)
        {
            console.log(error);
        }else{
            if(data.length==0||data.length<5)
            {
                more.style.display="none";
            }
            num+=5;
            data.forEach(function(x){
             addtodom(x);
            });
        }
    });
  })