const Player = require('../models/players');
const Ships = require('../models/ships');
const Sailor = require('../models/sailor'); 
const SailorClass = require('../mechanics/sailorMaker');
const Town = require('../models/town');

const express = require('express');
const { teardown } = require('mocha');
const router = express.Router();

router.route('/:id').post((req, res, next) => {
    let pId = req.params.id;

    Player.findOne({"id": pId})
        .then(player => { 
            // Fetch how many sailors the player has and make sure
            //that the quantity key (in the player doc) reflects that
            //if not, make the necessary amends.

            // Fetch the player's ship's stats
            Ships.findOne({"ship": player.ship.name}) // query how many sailors the player has
                .then(ship => {
                    
                    const crewMax = ship._max_crew;
            // If max crew number not reached add a crew member
                    if (player.crew.qty < crewMax && (req.body.crew + player.crew.qty) <= crewMax) {
                        next();
                    } else {
                        return;
                    }
                })
                .catch(err => res.status(400).json("Error " + err))
        })
        .catch(err => res.status(400).json("Error " + err))

});


router.route('/:id').post((req, res, next) => {
    let newSailorArray = [];
    let newSailor;

    //Add new sailor (with player Id) to sailor database
    const addingSailor = async () => {

        for (let i = 0; i < req.body.crew; i++) {
        // Create a new sailor from the class
        newSailor = new SailorClass(req.params.id); 

       
        // Save it to an array
        newSailorArray = newSailor;
    
        console.log('New sailor Array ' + newSailorArray);

        // Create a new sailor here using the array
        Sailor.insertMany([newSailorArray],  (err, res) => {
            if (err) {
                console.log('Error ' + err)
            }
            
            console.log('Added to database ' + res);
        
        })
    }
}
    addingSailor();
    next() 
});



router.route('/:id').post(  (req, res, next) => {
    let pId = req.params.id;
    let sailorsArray = [];

    //function that saves the new sailors' Ids to the player object
    const addNewSailorsToPlayerDoc = async function (playerId, sailorId) { //
        const result = await Player.updateOne({"id": playerId}, {
            $addToSet : {
                "crew.sailors": sailorId
            }
        })
        console.log(result);
    }

    //function that updates the crew quantity
    const updatePlayerSailorQty = async function (playerId, crewQty) {
        const result = await Player.updateOne({"id": playerId}, {
                "crew.qty": crewQty
        })
    }

    const updatePlayerFunds = async (playerId, crewQty, sellPrice, funds) => {

        const updatedFunds = funds - (crewQty * sellPrice);

        const result = await Player.updateOne({"id": playerId}, {
            "funds": updatedFunds
        })
    .then( player =>
        console.log('Player funds: ' + player)
    )
    .catch(err => res.status(500).json('Error updating funds: ' + err))
    } 
    
    const updateTownSailorsAvailable = async (crew, playerCurrentTown) => {
        const updatedAvailableSailorsQuantity = playerCurrentTown.buildings.tavern.sailors.qty - crew;

        const result = await Town.updateOne({"_name": req.body.town}, {
            "buildings.tavern.sailors.qty": updatedAvailableSailorsQuantity
            })

            //console.log("This is town update: " + updatedAvailableSailorsQuantity + " " + crew + " " + playerCurrentTown.buildings.tavern.sailors.qty)
    }
    

    // This set timeout is required so that it fires after
    //the sailor is created and saved above
    setTimeout(() => {
       Sailor.find({playerId: pId})
            .then(sailor => {
                // Map through all the sailors that belong to 
                //the player with the player id and save to 
                //an array. And then update the player object
                const mapping = sailor.map((e) => {
                    sailorsArray.push(e.id);
                   
                    console.log("this is the sailor" + e.id)
                });
                    
                        Promise.resolve(mapping).then(() => {
                        addNewSailorsToPlayerDoc(pId, sailorsArray);
                    })

                // Count all the sailors that belong to the player
                //and if their quantity is equal to the qty saved
                //in the player object, great. If not, update it.
                Sailor.count({playerId: pId})
                .then(sailorsCount =>{
                    Player.findOne({"id": pId})
                    .then(player => {
                        Town.findOne({"_name": req.body.town})
                        .then(town => {
                            
                            if (player.crew.qty !== sailorsCount) {
                                updatePlayerSailorQty(pId, sailorsCount);
                                updatePlayerFunds(pId, req.body.crew, req.body.sellPrice, player.funds);
                                updateTownSailorsAvailable(req.body.crew, town)
                                //console.log('Sailors count is: ' + sailorsCount)
                                console.log('Town is: ' + JSON.stringify(town))
                                res.send();
                                next();
                            }
                        })
                        .catch(err => res.status(400).json('error consolidating2 ' + err))
                    })
                    .catch(err => res.status(400).json('error consolidating2 ' + err))
                })
                .catch(err => res.status(400).json('error consolidating2 ' + err))
                })
            .catch(err => res.status(400).json('error consolidating2 ' + err))
        }, 500);
});

router.route('/:id').post( async (req, res) =>{
    
    console.log('end of route')
})

  module.exports = router;