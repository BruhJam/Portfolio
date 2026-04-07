function initBackButton(){
const backButton=document.getElementById("backButton");
if(!backButton) return;

_resize();

window.addEventListener('resize', () => {
  _resize();
});

function _resize(){
    if(window.innerWidth <= 650){
        backButton.textContent = "←";
    }
    else{
        backButton.textContent = "← Back";
    }
}

if(history.length<=1){
backButton.style.display="none";
}

backButton.addEventListener("click",()=>{
history.back();
});
}

document.addEventListener("DOMContentLoaded",initBackButton);
