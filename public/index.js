const dragField = document.querySelector(".dragField")
const box = document.querySelector(".box")
const borderRadius = document.querySelector(".border-radius")
const span = document.querySelector("span")
const parentElement = dragField

span.addEventListener("mousedown", function(event) {
    document.addEventListener("mousemove", moveOnDrag)
})

function leaveDrag(event) {
    document.removeEventListener("mousemove", moveOnDrag)
    document.removeEventListener("mouseup", leaveDrag)
}

function moveOnDrag(event) {
    document.addEventListener("mouseup", leaveDrag)

    const parentPosition = getPosition(parentElement)
    const mouseX = (event.clientX - parentPosition.x) < 0 ? 0 : (event.clientX - parentPosition.x) > 346 ? 346 : event.clientX - parentPosition.x
    span.style.left = `${mouseX}px`
    borderRadius.style["border-radius"] = `${mouseX}px 0px 0px 0px / ${mouseX}px 0px 0px 0px`
}



function getPosition(element) {
    let xPosition = 0,
        yPosition = 0

    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft)
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop)
        element = element.offsetParent
    }

    return {
        x: xPosition,
        y: yPosition
    }
}