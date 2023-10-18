const div=document.getElementById("div1");
const back=document.getElementById("back");
const div2=document.getElementById("oops");
getreq(function(error,data){
    if(error)
    {
        console.log(error);
    }else if(data.length==0)
    {
      div.style.display="none";
      div2.style.display="block";
    }
    else
    data.forEach(function(x){
console.log(x);
     addtodom(x);
    });
});
back.addEventListener("click",function(event){
    window.location.href="/admin";
});
function getreq(callback)
{
    fetch("/proreqdata").then(function(response)
    {
        if(response.status===401)
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
    const p2=document.createElement("p");
    const img=document.createElement("img");
    const btn1=document.createElement("button");
    const btn2=document.createElement("button");
    const btn3=document.createElement("button");
    divv.setAttribute("class","product-container");
    btn1.setAttribute("class","btn");
    btn2.setAttribute("class","btn3");
    btn3.setAttribute("class","btn");
    img.src=prdct.filename;
    p.innerHTML="Price: "+prdct.price;
    h2.innerHTML=prdct.product;
    btn1.innerHTML="approve";
    btn3.innerHTML="reject";
    btn2.innerHTML="View desc";
    div.appendChild(divv);
    divv.appendChild(img);
    divv.appendChild(h2);
    divv.appendChild(p);
    divv.appendChild(btn1);
    divv.appendChild(btn3);
    divv.appendChild(btn2);
    btn1.addEventListener("click",function(){
        fetch("/approveproduct",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:prdct.prid})
        }).then(function(response){
            if(response.status==200)
            {
                div.removeChild(divv);
                if(!div.hasChildNodes())
                {
                div.style.display="none";
                div2.style.display="block";
                }
            }
            else
            {
                console.log("Error");
            }
        });
    });
    btn3.addEventListener("click",function(){
        fetch("/rejectproduct",{
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:prdct.prid,img:prdct.filename})
        }).then(function(response){
            if(response.status==200)
            {
                div.removeChild(divv);
                if(!div.hasChildNodes())
                {
                div.style.display="none";
                div2.style.display="block";
                }
            }
            else
            {
                console.log("Error");
            }
        });
    });
    btn2.addEventListener("click", function (event) {
        openPopup(prdct);
      });
}
function openPopup(prdct) {
    const popupContent = document.querySelector(".popup-content");
    popupContent.innerHTML = `
     <span class="close-button" id="close" >&times;</span>
      <img src="${prdct.filename}" alt="${prdct.product}">
      <h2>${prdct.product}</h2>
      <p>Seller: ${prdct.seller}</p>
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