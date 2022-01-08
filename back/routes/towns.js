const express = require('express');
const router = express.Router();
const util = require('util'); // Helps go deeper into an object for console.log

const Town = require('../models/town');
const Player = require('../models/players');

// Note: The file name of the route is the name of the collection
router.route('/player/:p1Id').get((req, res) =>{

    const getTownWherePlayerIsDocked = async () => {
        const result = await Player.findOne({"id": req.params.p1Id})
        .then(player => {
            const playerLocation = player.ship.location;
            Town.findOne({ _name: playerLocation })
            .then(town => {
                console.log("The town is: " + util.inspect(town, {depth: null}))
                res.send(town)
                
            })
            .catch(err => res.status(400).json('No such town exists: ' + err))
        })
        .catch(err => res.status(400).json('No such town exists: ' + err))
    }
    
    getTownWherePlayerIsDocked();
    
})

module.exports = router;