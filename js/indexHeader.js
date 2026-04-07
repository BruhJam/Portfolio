canMoveDown = false;

function createStickyHeader() {
const stickyHeader = document.createElement("header");
stickyHeader.className = "sheader";
stickyHeader.innerHTML = `
<div class="pcontainer">
<nav class="pnav">
<a class="pill" href="/Portfolio/index.html">Home</a>
<a class="pill" href="/Portfolio/mainPages/projects.html">Projects</a>
<a class="pill" href="/Portfolio/mainPages/about.html">About</a>
<a class="pill" href="/Portfolio/mainPages/contact.html">Contact</a>
</nav>
</div>
`;

document.body.appendChild(stickyHeader);
return stickyHeader;
}

function initIndexStickyHeader(){
    const headerMount = document.getElementById("header");
    const headerMount1 = document.getElementById("mheader");

    _initIndexStickyHeader(headerMount);
    _initIndexStickyHeader(headerMount1);
}

function _initIndexStickyHeader(headerMount) {
//const headerMount = document.getElementById("header", "mheader");
if (!headerMount) return;

let initialized = false;

const setup = () => {
if (initialized) return true;

const headerElement = headerMount.querySelector(".header");
if (!headerElement) return false;

initialized = true;

const stickyHeader = createStickyHeader();

const updateStickyState = () => {
const threshold = headerElement.offsetHeight;
    if (window.scrollY > threshold) {
        stickyHeader.classList.add("is-visible");
    } else {
        stickyHeader.classList.remove("is-visible");
    }

    if (window.scrollY > threshold - 200) {
        canMoveDown = true;
    } else {
        canMoveDown = false;
    }

    initBackButton();
};

updateStickyState();
window.addEventListener("scroll", updateStickyState, { passive: true });
window.addEventListener("resize", updateStickyState);

return true;
};

if (setup()) return;

const observer = new MutationObserver(() => {
if (setup()) {
observer.disconnect();
}
});

observer.observe(headerMount, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", initIndexStickyHeader);

function initBackButton(){

const backButton = document.getElementById("backButton");
const _mheader = document.getElementById("mheader");
if(!_mheader) return;
if(!backButton) return;

/* editable settings */

const maxwidth = 560;   // distance allowed before pushing (px)
const pushAmount = 60;         // how far to push down (px)

/* hide button if no history */

if(history.length <= 1){
    backButton.style.display = "none";
}

/* detect overlap with header */

if(window.innerWidth <= maxwidth && canMoveDown){
    backButton.style.top = (20 + pushAmount) + "px";
    if(window.innerWidth <= 420)
        backButton.style.left = (40) + "px";
    else
        backButton.style.left = (20) + "px";
}
else{
    console.log("Push Up");
    backButton.style.top = (20) + "px";
    backButton.style.left = (20) + "px";
}

backButton.addEventListener("click",()=>{
    history.back();
});

}

document.addEventListener("DOMContentLoaded",initBackButton);