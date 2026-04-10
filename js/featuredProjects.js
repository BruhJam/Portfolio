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
let startX = 0
let currentX = 0
let dragOffset = 0
let velocity = 0
let isDragging = false


/* ===== INFINITE SETUP ===== */

if(ENABLE_INFINITE){

const clonesBefore = []
const clonesAfter = []

cards.forEach(card=>{
clonesBefore.push(card.cloneNode(true))
clonesAfter.push(card.cloneNode(true))
})

clonesBefore.reverse().forEach(c=>track.insertBefore(c,track.firstChild))
clonesAfter.forEach(c=>track.appendChild(c))

cards = Array.from(document.querySelectorAll(".fp-card"))

index = clonesBefore.length

}


/* ===== CENTER CARD ===== */

function centerCard(animated=true){

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


/* ===== LOOP FIX ===== */

function checkLoop(){

if(!ENABLE_INFINITE) return

const realCount = cards.length/3

if(index >= realCount*2){

index -= realCount
centerCard(false)

}

if(index < realCount){

index += realCount
centerCard(false)

}

}


/* ===== NAVIGATION ===== */

function next(){

index++
centerCard()
setTimeout(checkLoop,460)

}

function prev(){

index--
centerCard()
setTimeout(checkLoop,460)

}

nextBtn.onclick = next
prevBtn.onclick = prev


/* ===== DRAG START ===== */

function startDrag(e){

if(!ENABLE_TOUCH_PHYSICS) return

isDragging = true
track.classList.add("dragging")

startX = e.type.includes("mouse")
? e.pageX
: e.touches[0].clientX

velocity = 0
track.style.transition="none"

}


/* ===== DRAG MOVE ===== */

function drag(e){

if(!isDragging) return

currentX = e.type.includes("mouse")
? e.pageX
: e.touches[0].clientX

dragOffset = currentX - startX

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

if(Math.abs(dragOffset) > 120){

if(dragOffset < 0) next()
else prev()

}else{

centerCard()

}


/* ===== MOMENTUM ===== */

if(ENABLE_MOMENTUM){

if(Math.abs(velocity) > 260){

if(velocity < 0) next()
else prev()

}

}

dragOffset = 0

}


/* ===== EVENTS ===== */

track.addEventListener("mousedown",startDrag)
track.addEventListener("touchstart",startDrag)

window.addEventListener("mousemove",drag)
window.addEventListener("touchmove",drag)

window.addEventListener("mouseup",endDrag)
window.addEventListener("touchend",endDrag)


/* ===== INIT ===== */

window.addEventListener("load",()=>{

requestAnimationFrame(()=>{
centerCard(false)
})

})