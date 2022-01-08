const Player = require('../models/players');

const express = require('express');
const router = express.Router();

var ObjectId = require('mongodb').ObjectID;

router.route('/player1').post((req, res, next) => {
    
    // Saving the following data to the mongo database
    const playerInfo = {
        _id: "61a6230fb0b1488a2cbb2fee",
        name: 'john',
        ship: {
            name: 'tartane',
            status: 'docked',
            location: "Caracas"
        },
        crew: {
            qty: 0,
            sailors: []
        },
        guns: 4,
        funds: 1000
    }
    
    var newPlayer = new Player(playerInfo); // instance of the model

    //.save(); save to the database
    newPlayer.save((error) => {
        if (error) {
            console.log('Something happened');
        } else {
            res.json('Success')
            console.log('Data was saved');
        }
    });
    })

// router.route('/updatePlayer1Id').post((req, res) => {
//     Player.findOneAndUpdate({"name": "john"},{_id: "61a6230fb0b1488a2cbb2fee"})
//     .then(response => {
//         res.json("Player Update successful: " + response)
//     })
//     .catch(err => res.status(500).json('Error updating player: ' + err))
// })

router.route('/player2').post((req, res) => {
    const playerInfo = {
        _id: "61a7e25b0e505068298870cb",
        name: 'andy',
        ship: {
            name: 'tartane',
            status: 'docked',
            location: "Caracas"
        },
        crew: {
            qty: 0,
            sailors: []
        },
        guns: 4
    }
    
    var newPlayer = new Player(playerInfo); // instance of the model

    //.save(); save to the database
    newPlayer.save((error) => {
        if (error) {
            console.log('Something happened');
        } else {
            res.json('Success')
            console.log('Data was saved');
        }
    });
    })

module.exports = router;