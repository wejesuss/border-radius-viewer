let dragField = document.querySelector(".dragField")

const borderRadius = document.querySelector(".border-radius")
const span = document.querySelector("span")

let x = 0
let pixel = 0
span.ondrag = function drag(e) {
    span.style.top = "0px"

    if(x <= 0) {
        x = 0
    }

    if(x >= 346) {
        x = 346
    }

    if(e.clientX > dragField.getBoundingClientRect().left - 6
    && e.clientX < dragField.getBoundingClientRect().right - 6) {
        x = e.clientX - 18/2 - 60

        if(x > 0 && x < 346) {
            pixel = x
            
            span.style.left = pixel + "px"
            borderRadius.style["border-radius"] = `${x}px 0px 0px 0px / ${x}px 0px 0px 0px`
        }
    }
}