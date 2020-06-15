function getElements() {
    const topLeft = document.querySelector(".topLeft")
    const topRight = document.querySelector(".topRight")
    const bottomLeft = document.querySelector(".bottomLeft")
    const bottomRight = document.querySelector(".bottomRight")
    const box = document.querySelector(".box")
    const borderRadius = document.querySelector(".border-radius")
    const dragField = document.querySelector(".dragField")
    const parentElement = dragField

    return {
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
        box,
        borderRadius,
        dragField,
        parentElement
    }
}

let { topLeft, topRight, bottomLeft, bottomRight, dragField, box, borderRadius, parentElement } = getElements()

function getSizes() {
    const sizes = {
        width: borderRadius.offsetWidth,
        height: borderRadius.offsetHeight
    }

    return sizes
}

let boxSize = getSizes()

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
        changePosition: function (position) {
            this.topLeft.style.left = `${position}px`
        }
    },
    spanTopRight: {
        topRight,
        changePosition: function (position) {
            this.topRight.style.top = `${position}px`
        }
    },
    spanBottomLeft: {
        bottomLeft,
        changePosition: function (position) {
            this.bottomLeft.style.bottom = `${position}px`
        }
    },
    spanBottomRight: {
        bottomRight,
        changePosition: function (position) {
            this.bottomRight.style.right = `${position}px`
        }
    }
}


function restart() {
    topLeft = getElements().topLeft
    topRight = getElements().topRight
    bottomLeft = getElements().bottomLeft
    bottomRight = getElements().bottomRight
    dragField = getElements().dragField
    box = getElements().box
    borderRadius = getElements().borderRadius
    parentElement = getElements().parentElement

    boxSize = getSizes()
}

function changeBoxSize() {
    const widthInput = document.getElementById("width")
    const heightInput = document.getElementById("height")
    widthInput.onchange = () => {
        box.style.width = widthInput.value  + "px"
        dragField.style.width = widthInput.value + "px"
        restart()
    }
    heightInput.onchange = () => {
        box.style.height = heightInput.value  + "px"
        dragField.style.height = heightInput.value  + "px"
        restart()
    }
}

function leaveDrag(event) {
    document.removeEventListener("mousemove", moveOnDrag)
    document.removeEventListener("mouseup", leaveDrag)
    actualTarget = null
}

function moveOnDrag(event) {
    document.addEventListener("mouseup", leaveDrag)
    let mousePosition = 0

    if (actualTarget && (actualTarget === "topRight" || actualTarget === "bottomLeft")) {
        const parentPosition = getPosition(parentElement)
        const boxPosition = box.getBoundingClientRect()
        mousePosition = (event.clientY - parentPosition.y - boxPosition.y) < 0 ? 0 : (event.clientY - parentPosition.y - boxPosition.y) > boxSize.height ? boxSize.height : (event.clientY - parentPosition.y - boxPosition.y)
    } else {
        const parentPosition = getPosition(parentElement)
        mousePosition = (event.clientX - parentPosition.x) < 0 ? 0 : (event.clientX - parentPosition.x) > boxSize.width ? boxSize.width : (event.clientX - parentPosition.x)
    }

    if (actualTarget && actualTarget === "bottomRight") {
        mousePosition = boxSize.width - mousePosition
    }

    if (actualTarget && actualTarget === "bottomLeft") {
        mousePosition = boxSize.height - mousePosition
    }

    if (actualTarget) {
        borderRadiusValues[actualTarget] = mousePosition
    }

    const result = updateSpanPosition(mousePosition, actualTarget)
    if (result) {
        updateRadius()
    }
}

function updateSpanPosition(position, actualTarget) {
    const target = "span" + actualTarget.slice(0, 1).toUpperCase() + actualTarget.slice(1)

    if (positions[target]) {
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
        `${topLeft}px ${boxSize.width - topLeft}px ${bottomRight}px ${boxSize.width - bottomRight}px
    / ${boxSize.height - bottomLeft}px ${topRight}px ${boxSize.height - topRight}px ${bottomLeft}px
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

changeBoxSize()

topLeft.addEventListener("mousedown", function (event) {
    actualTarget = "topLeft"
    document.addEventListener("mousemove", moveOnDrag)
})

topRight.addEventListener("mousedown", function (event) {
    actualTarget = "topRight"
    document.addEventListener("mousemove", moveOnDrag)
})

bottomRight.addEventListener("mousedown", function (event) {
    actualTarget = "bottomRight"
    document.addEventListener("mousemove", moveOnDrag)
})

bottomLeft.addEventListener("mousedown", function (event) {
    actualTarget = "bottomLeft"
    document.addEventListener("mousemove", moveOnDrag)
})

document.addEventListener("dragstart", (event) => event.preventDefault())