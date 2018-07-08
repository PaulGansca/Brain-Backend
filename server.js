const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const DATABASEPASSWORD = process.env.DATABASEPASSWORD;
const knex = require("knex");

const register = require("./controllers/register")
const signin = require("./controllers/signin");
const image = require("./controllers/image");
const profile = require("./controllers/profile");

//db setup
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'paulgansca',
      password : DATABASEPASSWORD,
      database : 'smart-brain'
    }
});


const app = express();
app.use(bodyParser.json());
app.use(cors());

//ROUTES

//ROOT route
app.get("/", (req, res)=> { res.send("it is working") }); 

//SIGN IN route
app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

//REGISTER route
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) });

//PROFILE route
app.get("/profile/:id", (req, res) => { profile.handleProfile(req, res, db) });

//IMAGE route
app.put("/image", (req, res) => {image.handleImage(req, res, db) });

//API CALL
app.post("/imageurl", (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.$PORT || 3001, ()=> { console.log(`Server running on port ${process.env.$PORT}`) });


/*
PLAN OVERVIEW

ROUTES
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user 

*/