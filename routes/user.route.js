const route = require("express").Router()
const userControl = require("../controllers/user.controller")

route.get("/addUser", userControl.addUserScreen)
route.post("/addUser", userControl.addUserLogic)

route.get("/showUser/:id", userControl.userDetails)

route.get("/deleteUser/:id", userControl.deleteUser)
route.get("/deleteAll", userControl.deleteUsers)

route.get("/editUser/:id", userControl.editUser)
route.post("/editUser/:id", userControl.editUserLogic)

route.get("/addBalance/:id", userControl.addBalance)
route.post("/addBalance/:id", userControl.addBalanceLogic)

route.get("/withdraw/:id", userControl.withdraw)
route.post("/withdraw/:id", userControl.withdrawLogic)
route.get("/", userControl.homeScreen)


module.exports = route