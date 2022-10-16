const express = require('express');
const app = express();
const PORT = 5000;
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const getCall = require('./apicall');
const request = require('request');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
//const passportSetup = require('./config/passport-setup');
require('dotenv').config;
const morgan = require('morgan');
// mongoose helps connect to the mongo db database
const Mongoose = require('mongoose');
const Player = require('./models/players');
const hireRoute = require('./routes/hireRoute');
const createPlayers = require('./routes/createPlayers');
const townRoute = require('./routes/towns');
const player = require('./routes/player');
const items = require('./routes/items');

const routes = require('./routes/api');

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(express.static("./public"));
app.use('/auth', authRoutes);
app.use('/', routes);
app.use('/hireSailors', hireRoute);
app.use('/createPlayers', createPlayers);
app.use('/town', townRoute);
app.use('/player', player);
app.use('/items', items);

Mongoose.connect('mongodb://localhost/shepherdBE', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

Mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!');
});

// Saving the following data to the mongo database
// const playerInfo = {
//     name: 'John',
//     ship: 'Tartane',
//     crew: 0,
//     guns: 0
// }

// var newPlayer = new Player(playerInfo); // instance of the model

// .save(); save to the database
// newPlayer.save((error) => {
//     if (error) {
//         console.log('Something happened');
//     } else {
//         console.log('Data was saved');
//     }
// });


var server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});