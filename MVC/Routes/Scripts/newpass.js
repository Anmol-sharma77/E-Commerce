const pass=document.getElementById("p1");
const conpass=document.getElementById("p2");
const btn=document.getElementById("btn");
const task1=document.getElementById("task1");
const task2=document.getElementById("task2");
const task3=document.getElementById("task3");
const btn2=document.getElementById("home");
const p=document.createElement("p");
const div1=document.getElementById("div1");
var format = /^(?=.*[-#$.%&@!+=\\*])(?=.*\d)/;
var t1=0,t2=0,t3=0;
btn2.addEventListener("click",function(){
    window.location.href="/";
});
pass.addEventListener("keyup",function(){
    let value=pass.value;
    if(value.length<8)
    {
        t1=1;
        task1.style.color="red";
    }
    else
    {
        t1=0;
        task1.style.color="green";
    }
    if(value.match(format))
    {
        t2=1;
        task2.style.color="green";
    }
    else
    {
        t2=0;
        task2.style.color="red";
    }
    if(conpass.value==value&&conpass.value!="")
    {
        t3=1;
        task3.style.color="green";
    }
    else
    {
        t3=0;
        task3.style.color="red";
    }
});
conpass.addEventListener("keyup",function(){
    let value=conpass.value;
    if(value==pass.value&&conpass.value!="")
    {
        t3=0;
        task3.style.color="green";
    }
    else
    {
        t3=0;
        task3.style.color="red";
    }
});
btn.addEventListener("click",function(){
    if(pass.value.length>=8&&pass.value.match(format)&&conpass.value!=""&&pass.value!=""&&pass.value==conpass.value){
        fetch("/changepass",{
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify({pass:pass.value}),
        }).then(function(response)
        {
            if(response.status===200)
            {
                p.innerHTML="Saved succesfull";
                div1.appendChild(p);
            }
            else
            {
                p.innerHTML="Error Occured";
                div1.appendChild(p);
            }
            setTimeout(function(){
                div1.removeChild(p);
            },2000);
        });
    }
    else
    {
        p.innerHTML="Please Satisfy all conditions";
        div1.appendChild(p);
        setTimeout(function(){
            div1.removeChild(p);
        },2000);
    }
});