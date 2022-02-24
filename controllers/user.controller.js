const {MongoClient, ObjectId} = require("mongodb")

const DbConnection = (cb)=>{
    MongoClient.connect("mongodb://localhost:27017",(err, db)=>{
        if(err) cb(err, false)
        const DbName = db.db("Bank-Task")
        return cb(false, DbName)
    })
}

const addUserScreen = (req, res) =>{
    res.render("register", {
        PageTitle: "Add new user"
    })
}

const addUserLogic = (req, res) =>{
    let newUser = {...req.body, transaction:[]}
    DbConnection( (err, DbName)=>{
        if(err) throw new Error("Failed to connect to Database")
        DbName.collection("Users").insertOne(newUser, (e, r)=>{
            if(e) res.send("DB error!")
            res.redirect("/")
        })
    })
}

const homeScreen = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").find().toArray( (err, data)=>{
            if(err) res.send("Database Error :c")
            res.render("Home", {
                PageTitle: "Home Page",
                allUseres: data,
                noData: data.length==0?true:false
            })
        })
    })
}

const userDetails = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").findOne({_id: new ObjectId(req.params.id)}, (e, d)=>{
            if(e) throw new Error("Failed to connect to Database")
            if(!d) res.render("error404", {PageTitle: "Invalid Page", message: "Requested Route Not Found...!"})
            res.render("userDetails", {
                PageTitle:"user Details",
                userData: d,
                opData: d.transaction.length==0?true:false
            })
        })
    })
}

const deleteUser = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").deleteOne({_id: new ObjectId(req.params.id)})
        .then(r => res.redirect("/"))
        .catch(e => res.send(e))
    })
}

const deleteUsers = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").deleteMany()
        .then(r => res.redirect("/"))
        .catch(e => res.send(e))
    })
}

const editUser = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").findOne({_id: new ObjectId(req.params.id)}, (e, d)=>{
            if(e) res.render("error404", {PageTitle: "Invalid Page", message: "User not found...!"})
            res.render("editUser", {
                PageTitle: "Edit User",
                userData: d
            })
        })
    })
}
const editUserLogic = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").updateOne({_id: new ObjectId(req.params.id)},{
            $set:{
                email: req.body.email,
                city: req.body.city,
                street: req.body.street,
                building: req.body.building
            }
        })
        res.redirect("/")
    })
}

const addBalance = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").findOne({_id: new ObjectId(req.params.id)}, (e, d)=>{
            if(e) res.render("error404", {PageTitle: "Invalid Page", message: "User not found...!"})
            res.render("addBalance", {
                PageTitle: "Add Balance"
            })
        })
    })
}
const addBalanceLogic = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").findOne({_id: new ObjectId(req.params.id)}, (e, d)=>{
            DbName.collection("Users").updateOne({_id: new ObjectId(req.params.id)}, {
                $push:{transaction: {opName: "Deposit", Amount: req.body.amount}},
                $set:{initBalance: (Number(d.initBalance)+Number(req.body.amount))}
            })
        })
       
      
        
        res.redirect("/")
    })
}

const withdraw = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").findOne({_id: new ObjectId(req.params.id)}, (e, d)=>{
            if(e) res.render("error404", {PageTitle: "Invalid Page", message: "User not found...!"})
            res.render("withDraw", {
                PageTitle: "Withdraw"
            })
        })
    })
}

const withdrawLogic = (req, res)=>{
    DbConnection( (err, DbName)=>{
        if(err) throw new Error()
        DbName.collection("Users").findOne({_id: new ObjectId(req.params.id)}, (e, d)=>{
            if(e) res.render("error40",{PageTitle: "Invalid Page", message: "User not found...!"})
            DbName.collection("Users").updateOne({_id: new ObjectId(req.params.id)}, {
                $push:{
                    transaction: {opName:"Withdraw", Amount: req.body.amount}
                },
                $set:{
                    initBalance: (Number(d.initBalance)-Number(req.body.amount))
                }
            })
        })
        res.redirect("/")
    })
}




module.exports= {addUserScreen, addUserLogic, homeScreen, userDetails, deleteUser, deleteUsers, editUser, editUserLogic, addBalance, addBalanceLogic, withdraw, withdrawLogic}