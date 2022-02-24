require("dotenv").config()
const express = require("express")
const hbs = require("hbs")
const path = require("path")
const app = express()

//To fetch url params
app.use(express.urlencoded({extended:true}))

//Define template language engine
app.set("view engine", "hbs")

//Files Directory...!
app.use(express.static(path.join(__dirname, "../public")))
app.set("views", path.join(__dirname, "../frontend/views"))
hbs.registerPartials(path.join(__dirname, "../frontend/layouts"))

//Routes Relation
userRouter = require("../routes/user.route")
app.use(userRouter)

//handling error for any other Path of extension
app.get( "*", (req, res)=>{
    res.render("error404", { 
        PageTitle: "Invalid Page", 
        message: "Requested Route Not Found...!"
    })
})

module.exports = app