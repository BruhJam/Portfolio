async function loadComponent(id, files){
    const candidates = Array.isArray(files) ? files : [files];

    for (const file of candidates) {
        const res = await fetch(file);
        if (!res.ok) {
            continue;
        }

        const html = await res.text();
        document.getElementById(id).innerHTML = html;
        return;
    }
}

document.addEventListener("DOMContentLoaded", ()=>{

    if(document.getElementById("header")){
        loadComponent("header",["components/header.html","../components/header.html","../../components/header.html"]);
    }

    if(document.getElementById("footer")){
        loadComponent("footer",["components/footer.html","../components/footer.html","../../components/footer.html"]);
    }

    if(document.getElementById("mheader")){
        loadComponent("mheader",["../components/header.html","../../components/header.html","components/header.html"]);
    }

    if(document.getElementById("mfooter")){
        loadComponent("mfooter",["../components/footer.html","../../components/footer.html","components/footer.html"]);
    }
});
