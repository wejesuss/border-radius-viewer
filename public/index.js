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
            this.topLeft.style.left = `${position}%`
        }
    },
    spanTopRight: {
        topRight,
        changePosition: function (position) {
            this.topRight.style.top = `${position}%`
        }
    },
    spanBottomLeft: {
        bottomLeft,
        changePosition: function (position) {
            this.bottomLeft.style.bottom = `${position}%`
        }
    },
    spanBottomRight: {
        bottomRight,
        changePosition: function (position) {
            this.bottomRight.style.right = `${position}%`
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

function insertChangeBoxSizeListener() {
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
    let mousePosition = 0,
        percentRadius = 0

    if (actualTarget && (actualTarget === "topRight" || actualTarget === "bottomLeft")) {
        const parentPosition = getPosition(parentElement)
        const boxPosition = box.getBoundingClientRect()
        mousePosition = (event.clientY - parentPosition.y - boxPosition.y) < 0 ? 0 : (event.clientY - parentPosition.y - boxPosition.y) > boxSize.height ? boxSize.height : (event.clientY - parentPosition.y - boxPosition.y)
        percentRadius = Math.round(convertPixelToPercentage(mousePosition, "height"))
    } else {
        const parentPosition = getPosition(parentElement)
        mousePosition = (event.clientX - parentPosition.x) < 0 ? 0 : (event.clientX - parentPosition.x) > boxSize.width ? boxSize.width : (event.clientX - parentPosition.x)
        percentRadius = Math.round(convertPixelToPercentage(mousePosition, "width"))
    }

    if (actualTarget && actualTarget === "bottomRight") {
        mousePosition = boxSize.width - mousePosition
        percentRadius = Math.round(convertPixelToPercentage(mousePosition, "width"))
    }

    if (actualTarget && actualTarget === "bottomLeft") {
        mousePosition = boxSize.height - mousePosition
        percentRadius = Math.round(convertPixelToPercentage(mousePosition, "height"))
    }

    if (actualTarget) {
        borderRadiusValues[actualTarget] = percentRadius
    }
    
    const result = updateSpanPosition(percentRadius, actualTarget)
    if (result) {
        const border = updateRadius()
        showBorderRadiusProperty(border)
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
    const border = `${topLeft}% ${100 - topLeft}% ${bottomRight}% ${100 - bottomRight}%
    / ${100 - bottomLeft}% ${topRight}% ${100 - topRight}% ${bottomLeft}%
    `

    borderRadius.style["border-radius"] = border
    return border
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

function showBorderRadiusProperty(border) {
    let borderRadiusOfXAndY = border
    .split("/")
    .map(border => border
        .trim()
        .split("%")
        .map(border => Number(border.trim()) + "%")
    )
    .map(border => border.slice(0, -1))

    document.querySelector(".borderRadiusValues output").innerHTML = borderRadiusOfXAndY
}

function convertPixelToPercentage(pixelValue, baseComparation) {
    const percent = Number(pixelValue / boxSize[baseComparation] * 100)

    return percent
}

insertChangeBoxSizeListener()

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