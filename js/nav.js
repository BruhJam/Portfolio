function initBackButton(){
const backButton=document.getElementById("backButton");
if(!backButton) return;

if(history.length<=1){
backButton.style.display="none";
}

backButton.addEventListener("click",()=>{
history.back();
});
}

document.addEventListener("DOMContentLoaded",initBackButton);
