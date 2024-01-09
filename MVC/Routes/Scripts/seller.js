const div1=document.getElementById("div1");
const div2=document.getElementById("div2");
const lgout=document.getElementById("lgout");
num=0;
const mreport=document.getElementById("monthlyreport");
const more=document.getElementById("view");
const btn=document.getElementById("btn");
const reset=document.getElementById("reset");
const product=document.getElementById("pr");
const p=document.createElement("p");
const p1=document.createElement("p");
const des=document.getElementById("des");
const price=document.getElementById("price");
const quan=document.getElementById("quan");
const fimg=document.getElementById("file").size;
const reqbtn=document.getElementById("selreq");
const fileInput = document.querySelector('input[type="file"]');
getproduct(function(error,data){
    if(error)
    {
        console.log(error);
    }
    else{
        if(data.length==0||data.length<5)
        {
            more.style.display="none";
        }
        else
        {
            more.style.display="block";
        }
    num+=5;
    data.forEach(function(x){
        addtodom(x);
    });
}
});
reset.addEventListener("click",function()
{
    window.location.href="/newpass";
});
more.addEventListener("click",function(){
        getproduct(function(error,data){
        if(error)
        {
            console.log(error);
        }
        else{
        if(data.length==0||data.length<5)
        {
            more.style.display="none";
        }
        num+=5;
        data.forEach(function(x){
         addtodom(x);
        })
    }
    });
});
btn.addEventListener("click",function(){
    p.innerHTML="";
    p1.innerHTML="";
    if(product.value===""||des.value===""||price.value===""||quan.value===""||fimg.value==="")
    {
        p1.style.color="red";
        p1.innerHTML="Fill all fields";
        div2.appendChild(p1);
        setTimeout(function(){
            div2.removeChild(p1);
            },2000);
    }  
    else
    {
        const selectedFile = fileInput.files[0];
        const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
  const maxSizeInBytes = 250 * 1024;

  if (selectedFile) {
    const fileName = selectedFile.name;
    const fileExtension = fileName.split(".").pop();

    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      alert("Invalid file extension. Please upload an image with .jpg, .jpeg, .png, or .gif extension.");
      fileInput.value = ""; 
    }

    else if (selectedFile.size > maxSizeInBytes) {
      alert("File size exceeds the limit. Please upload an image with a size less than 250kb.");
      fileInput.value = ""; 
    }
    else{
            const formData = new FormData();
            formData.append("product", product.value);
            formData.append("des", des.value);
            formData.append("price", price.value);
            formData.append("quantity", quan.value);
            formData.append("img", selectedFile);
            product.value="";
            des.value="";
            price.value="";
            quan.value="";
            fimg.value=""; 
        fetch("/product",{
            method:"POST",
            body:formData,
        }).then(function(response)
        { 
            if(response.status!==200)
            {
                console.log("Error")
            }
            else{
                return response.json();
            }
        }).then(function(data){
            p1.style.color="blue";
            p1.innerHTML="Saved succesfully";
            div2.appendChild(p1);
            setTimeout(function(){
                div2.removeChild(p1);
                },2000);
        })
        .catch(function(error){
            console.log(error);
        });
    }
}
    }
});
lgout.addEventListener("click",function(){
    div1.innerHTML="";
    window.location.href="/logout";
});
function addtodom(prdct)
{
    const divv=document.createElement("div");
    const label1=document.createElement("label");
    const label2=document.createElement("label");
    const label3=document.createElement("label");
    const label4=document.createElement("label");
    const h2=document.createElement("h2");
    const inp1=document.createElement("input");
    const inp2=document.createElement("input");
    const inp3=document.createElement("input");
    const inp4=document.createElement("input");
    const img=document.createElement("img");
    const btn1=document.createElement("button");
    const btn2=document.createElement("button");
    label1.innerHTML="Product Name: ";
    label2.innerHTML="Product Desc: ";
    label3.innerHTML="Product Price: "; 
    label4.innerHTML="Product Quantity: ";
    inp1.value=prdct.product;
    inp2.value=prdct.des;
    inp3.value=prdct.price;
    inp4.value=prdct.quantity;
    divv.setAttribute("class","product-container");
    btn1.setAttribute("class","btn");
    btn2.setAttribute("class","btn");
    img.src=prdct.filename;
    btn1.innerHTML="update";
    btn2.innerHTML="Delete";
    div1.appendChild(divv);
    divv.appendChild(img);
    divv.appendChild(label1);
    label1.appendChild(inp1);
    divv.appendChild(label2);
    label2.appendChild(inp2);
    divv.appendChild(label3);
    label3.appendChild(inp3);
    divv.appendChild(label4);
    label4.appendChild(inp4);
    divv.appendChild(btn1);
    divv.appendChild(btn2);
    btn2.addEventListener("click",function(){
        p.innerHTML="";
        p1.innerHTML="";
        fetch("/delpro",{
            method:"DELETE",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({id:prdct.prid,file:prdct.filename})
        }).then(function(response){
            if(response.status===200)
            {
                p.style.color="blue";
                p.innerHTML="Deleted Succesfully";
                div2.appendChild(p);
                div1.removeChild(divv);
                setTimeout(function(){
                    div2.removeChild(p);
                    },2000);
            }
            else{
                console.log("Something went wrong");
            }
        }).catch(function(error){
            console.log(error);
        });
  });
  btn1.addEventListener("click",function(){
    p.innerHTML="";
    p1.innerHTML="";
    fetch("/update",{
        method:"POST",
        headers:{'Content-Type':"application/json"},
        body:JSON.stringify({id:prdct.prid,product:inp1.value,desc:inp2.value,price:inp3.value,quantity:inp4.value})
    }).then(function(response){
        if(response.status===200)
        {
            p.style.color="blue";
            p.innerHTML="Updated";
            div2.appendChild(p);
            setTimeout(function(){
                div2.removeChild(p);
                },2000);
        }
        else{
            console.log('something is not right');
        }
    }).catch(function(error){
        console.log(error);
    });
  });
}
function getproduct(callback){
    fetch("/sellerproducts?num="+num).then(function(response)
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
reqbtn.addEventListener("click",function(){
    window.location.href="/allrequest";
});
mreport.addEventListener("click",function(){
    window.location.href="/monthlyreport";
});