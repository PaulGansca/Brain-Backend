const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

//Temporary data
const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "1234",
            name: "Viku",
            email: "viku@gmail.com",
            password: "pizza",
            entries: 0,
            joined: new Date()
        }
    ]
}

//ROUTES

//ROOT route
app.get("/", (req, res)=> {
    res.send(database.users);
});

//SIGN IN route
app.post("/signin", (req, res)=> {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json("success");
        } else {
            res.status(400).json("error logging in boi");
        }
});

//REGISTER route
app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
            id: "125",
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

//PROFILE route
app.get("/profile/:id", (req, res) => {
    let found = false;
    const {id} = req.params;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    });
    if (!found) {
        res.status(400).json("Profile not found");
    }
});

//IMAGE route
app.post("/image", (req, res) => {
    let found = false;
    const {id} = req.body;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
    });
    if (!found) {
        res.status(400).json("Profile not found");
    }
});

app.listen(3000, ()=> {
    console.log("Server running on port 3000");
})


/*
PLAN OVERVIEW

ROUTES
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user 

*/