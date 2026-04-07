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

function initIndexStickyHeader() {
const headerMount = document.getElementById("header");
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
