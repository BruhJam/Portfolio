function initBackButton(){

const backButton = document.getElementById("backButton");
if(!backButton) return;

/* resize behaviour */

function resize(){
    if(window.innerWidth <= 650){
        backButton.textContent = "←";
    }else{
        backButton.textContent = "← Back";
    }
}

resize();
window.addEventListener("resize", resize);

/* hide button on homepage */

if(
window.location.pathname === "/Portfolio/" ||
window.location.pathname.endsWith("index.html")
){
backButton.style.display = "none";
}

/* back button behaviour */

backButton.addEventListener("click", ()=>{

const ref = document.referrer;

if(ref && ref.includes(window.location.hostname)){
    history.back();
}else{
    window.location.href = "/Portfolio/";
}

});

}

document.addEventListener("DOMContentLoaded", initBackButton);