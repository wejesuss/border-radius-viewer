const width = document.getElementById("width")
const height = document.getElementById("height")

if(window.innerWidth > 700) {
    width.value = 310
    height.value = 310
}

if(window.innerWidth >= 1600) {
    width.value = 450
    height.value = 450
}

if(window.innerWidth < 700) {
    width.value = 280
    height.value = 280
}