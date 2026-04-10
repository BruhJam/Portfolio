/* ===== SETTINGS ===== */

const ENABLE_INFINITE = true
const ENABLE_MOMENTUM = true
const ENABLE_TOUCH_PHYSICS = true


/* ===== ELEMENTS ===== */

const track = document.querySelector(".fp-track")
let cards = Array.from(document.querySelectorAll(".fp-card"))

const prevBtn = document.querySelector(".fp-prev")
const nextBtn = document.querySelector(".fp-next")

let index = 0
let cardWidth = 0

let startX = 0
let currentX = 0
let dragOffset = 0

let velocity = 0
let isDragging = false


/* ===== INFINITE CLONING ===== */

if(ENABLE_INFINITE){

const first = cards[0].cloneNode(true)
const last = cards[cards.length-1].cloneNode(true)

track.appendChild(first)
track.insertBefore(last, cards[0])

cards = Array.from(document.querySelectorAll(".fp-card"))
index = 1
requestAnimationFrame(() => updatePosition(false))

}


/* ===== MEASURE CARD ===== */

function measure(){

cardWidth = cards[0].offsetWidth + 40

}

window.addEventListener("resize",measure)


/* ===== UPDATE POSITION ===== */

function updatePosition(animated=true){

if(animated) track.style.transition="transform 0.45s ease"
else track.style.transition="none"

const card = cards[index]

const offset =
card.offsetLeft
- (track.parentElement.offsetWidth/2)
+ (card.offsetWidth/2)

track.style.transform = `translateX(${-offset}px)`

cards.forEach(c=>c.classList.remove("active"))
card.classList.add("active")

}


/* ===== FIX INFINITE JUMP ===== */

function fixLoop(){

if(!ENABLE_INFINITE) return

if(index <= 0){

track.style.transition="none"
index = cards.length-2
updatePosition(false)

}

if(index >= cards.length-1){

track.style.transition="none"
index = 1
updatePosition(false)

}

}


/* ===== BUTTONS ===== */

function next(){

index++
updatePosition()
setTimeout(fixLoop,450)

}

function prev(){

index--
updatePosition()
setTimeout(fixLoop,450)

}

nextBtn.onclick=next
prevBtn.onclick=prev


/* ===== DRAG START ===== */

function startDrag(e){

if(!ENABLE_TOUCH_PHYSICS) return

isDragging=true
track.classList.add("dragging")

startX = e.type.includes("mouse")
? e.pageX
: e.touches[0].clientX

velocity=0
track.style.transition="none"

}


/* ===== DRAG MOVE ===== */

function drag(e){

if(!isDragging) return

currentX = e.type.includes("mouse")
? e.pageX
: e.touches[0].clientX

dragOffset = currentX-startX

const card = cards[index]

const baseOffset =
card.offsetLeft
- (track.parentElement.offsetWidth/2)
+ (card.offsetWidth/2)

track.style.transform =
`translateX(${-baseOffset + dragOffset}px)`

velocity = dragOffset

}


/* ===== DRAG END ===== */

function endDrag(){

if(!isDragging) return
isDragging=false

track.classList.remove("dragging")

if(Math.abs(dragOffset) > cardWidth/4){

if(dragOffset < 0) next()
else prev()

}
else{

updatePosition()

}


/* ===== MOMENTUM ===== */

if(ENABLE_MOMENTUM){

if(Math.abs(velocity)>120){

if(velocity<0) next()
else prev()

}

}

dragOffset=0

}


/* ===== EVENTS ===== */

track.addEventListener("mousedown",startDrag)
track.addEventListener("touchstart",startDrag)

window.addEventListener("mousemove",drag)
window.addEventListener("touchmove",drag)

window.addEventListener("mouseup",endDrag)
window.addEventListener("touchend",endDrag)


/* ===== INIT ===== */

window.addEventListener("load", () => {

measure()

requestAnimationFrame(() => {
updatePosition(false)
})

})