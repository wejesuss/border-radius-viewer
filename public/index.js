const dragField = document.querySelector(".dragField")
const box = document.querySelector(".box")
const borderRadius = document.querySelector(".border-radius")
let parentElement = dragField

const topLeft = document.querySelector(".topLeft")
const topRight = document.querySelector(".topRight")
const bottomLeft = document.querySelector(".bottomLeft")
const bottomRight = document.querySelector(".bottomRight")

let actualTarget = null

const borderRadiusValues = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
}

const positions = {
    spanTopLeft: {
        topLeft,
        changePosition: function(position) {
            this.topLeft.style.left = `${position}px`
        }
    },
    spanTopRight: {
        topRight,
        changePosition: function(position) {
            this.topRight.style.top = `${position}px`
        }
    },
    spanBottomLeft: {
        bottomLeft,
        changePosition: function(position) {
            this.bottomLeft.style.bottom = `${position}px`
        }
    },
    spanBottomRight: {
        bottomRight,
        changePosition: function(position) {
            this.bottomRight.style.right = `${position}px`
        }
    }
}

topLeft.addEventListener("mousedown", function(event) {
    actualTarget = "topLeft"
    document.addEventListener("mousemove", moveOnDrag)
})

topRight.addEventListener("mousedown", function(event) {
    actualTarget = "topRight"
    document.addEventListener("mousemove", moveOnDrag)
})

bottomRight.addEventListener("mousedown", function(event) {
    actualTarget = "bottomRight"
    document.addEventListener("mousemove", moveOnDrag)
})

bottomLeft.addEventListener("mousedown", function(event) {
    actualTarget = "bottomLeft"
    document.addEventListener("mousemove", moveOnDrag)
})

function leaveDrag(event) {
    document.removeEventListener("mousemove", moveOnDrag)
    document.removeEventListener("mouseup", leaveDrag)
    actualTarget = null
}

function moveOnDrag(event) {
    document.addEventListener("mouseup", leaveDrag)
    let mousePosition = 0

    if(actualTarget && (actualTarget === "topRight" || actualTarget === "bottomLeft")) {
        const parentPosition = getPosition(parentElement)
        const boxPosition = box.getBoundingClientRect()
        mousePosition = (event.clientY - parentPosition.y - boxPosition.y) < 0 ? 0 : (event.clientY - parentPosition.y - boxPosition.y) > 346 ? 346 : (event.clientY - parentPosition.y - boxPosition.y)
    } else {
        const parentPosition = getPosition(parentElement)
        mousePosition = (event.clientX - parentPosition.x) < 0 ? 0 : (event.clientX - parentPosition.x) > 346 ? 346 : event.clientX - parentPosition.x    
    }

    if(actualTarget && (actualTarget === "bottomRight" || actualTarget === "bottomLeft"))
        mousePosition = 346 - mousePosition

    if(actualTarget) 
        borderRadiusValues[actualTarget] = mousePosition

    const result = updateSpanPosition(mousePosition, actualTarget)
    if(result)
        updateRadius()
}

function updateSpanPosition(position, actualTarget) {
    const target = "span" + actualTarget.slice(0, 1).toUpperCase() + actualTarget.slice(1)

    if(positions[target]) {
        positions[target].changePosition(position)
        return true
    } else {
        return false
    }
}

function updateRadius() {
    const topLeft = borderRadiusValues.topLeft
    const topRight = borderRadiusValues.topRight
    const bottomLeft = borderRadiusValues.bottomLeft
    const bottomRight = borderRadiusValues.bottomRight

    borderRadius.style["border-radius"] = 
    `${topLeft}px ${346 - topLeft}px ${bottomRight}px ${346 - bottomRight}px
    / ${346 - bottomLeft}px ${topRight}px ${346 - topRight}px ${bottomLeft}px
    `
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