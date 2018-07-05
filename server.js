const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const databasepassword = require('../imagerecognitionbrain/src/apiKeys');
const knex = require("knex");

//db setup
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'paulgansca',
      password : databasepassword.databasepassword,
      database : 'smart-brain'
    }
});

db.select('*').from('users').then(data => {
  console.log(data);  
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

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
    ],
    login: [
        {
            id: "987",
            hash: "",
            email: "john@gmail.com"
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
    // Load hash from your password DB.
    bcrypt.compare("password","$2a$10$rTzhowpfmdeZ.yicxyOsQum1Zl0A6Z21RX1qR3crMZml1Wc3OYTDS", 
    function(err, res) {
        // res == true
        console.log("first guess", res);
    });
    bcrypt.compare("veggies", "$2a$10$rTzhowpfmdeZ.yicxyOsQum1Zl0A6Z21RX1qR3crMZml1Wc3OYTDS", 
    function(err, res) {
        // res = false
        console.log("second guess", res);
    });
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json("error logging in boi");
        }
});

//REGISTER route
app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    db("users").insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(console.log);
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
app.put("/image", (req, res) => {
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

app.listen(3001, ()=> {
    console.log("Server running on port 3001");
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