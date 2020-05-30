const express = require("express")
const app = express()

app.use(express.static("public"))

app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/views/index.html")
})

app.listen(3000, () => {
    console.log("I am here")
})