const div=document.getElementById("div1");
const div2=document.getElementById("oops");
const back=document.getElementById("back");
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
    fetch("/selreqdata").then(function(response)
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
function addtodom(data)
{
    console.log(data);
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
    btn3.setAttribute("class","btn2");
    btn2.setAttribute("class","btn");
    btn1.innerHTML="Aprove";
    btn2.innerHTML="Reject";
    btn3.innerHTML="details";
    h2.innerHTML=data.name;
    p.innerHTML=data.mail;
    p2.innerHTML=data.orgname;
    img.src=data.sellerimg;
    div.appendChild(divv);
    divv.appendChild(img);
    divv.appendChild(h2);
    divv.appendChild(p);
    divv.appendChild(p2);
    divv.appendChild(btn1);
    divv.appendChild(btn2);
    divv.appendChild(btn3);
    btn1.addEventListener("click",function(){
        fetch("/aprove",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:data.sellerid,mail:data.mail})
        }).then(function(response)
        {
            if(response==200)
            {
                div.removeChild(divv);
                if(!div.hasChildNodes())
                {
                div.style.display="none";
                div2.style.display="block";
                more.style.display="none";
                }
            }
            else{
                console.log("Error");
            }
        }
    );
    });
    btn2.addEventListener("click",function(){
        fetch("/reject",{
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:data.sellerid,img1:data.sellerimg,img2:data.image,mail:data.mail})
        }).then(function(response)
        {
            if(response.status==200)
            {
                div.removeChild(divv);
            }
            else{
                console.log("Error");
            }
        }
        )
    });
    btn3.addEventListener("click",function(){
        openPopup(data);
    });
}
function openPopup(data) {
    const popupContent = document.querySelector(".popup-content");
    popupContent.innerHTML = `
     <span class="close-button" id="close" >&times;</span>
      <img src="${data.sellerimg}" alt="${data.name}">
      <h2>${data.name}</h2>
      <p>Age: ${data.age}</p>
      <p>Mail:${data.mail}
      <p>Organisation: ${data.orgname}</p>
      <p>District:${data.district}</p>
      <p>State:${data.state}</p>
      <img src="${data.image}" alt="adhaar">
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