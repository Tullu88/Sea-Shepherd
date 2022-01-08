const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Town = require('../models/town');
const Player = require('../models/players');
const { isValidObjectId } = require('mongoose');

router.route('/funds/:p1Id').get((req, res) => {
    console.log(req.params.p1Id);
});

router.route('/purchaseItems/:p1Id').post(async (req, res) => {

    const town = req.body.town;
    const item = req.body.itemToBuy;
    
    console.log("This is the purchase items route: " + req.params.p1Id);
    console.log("This is the body of the request: " + JSON.stringify(req.body));

    // options:
    //A: update player first
    //or update town first
    Town.updateOne({"_name": req.body.town, "buildings.market.products._name": item}, {
        $inc: {
            "buildings.market.products.$.qty": -(req.body.qtyToBuy)
        }
    })
    .catch(err => res.status(500).json('Error while Market purchase updating town item qty: ' + err))

    //check here first if the item object exists, if noit just
    //add it to the array using push?
    
    
    // Player.aggregate([
    //     {$match: {_id: ObjectId(req.params.p1Id)}}
    //    ])
    // .then(player => {
    //     console.log(player)
    // })
    // .catch()

    Player.find({_id: req.params.p1Id,
        'ship.storage.content._name': {$in: [req.body.itemToBuy]}})
        .count()
        .then(e => {
            console.log(e)
        
            if (e > 0) {
                Player.updateOne({_id: req.params.p1Id, 'ship.storage.content._name': req.body.itemToBuy}, {
                    $inc: {
                        'ship.storage.content.$.qty': req.body.qtyToBuy
                    }
                })
                .then(e => {
                    console.log(e)
                })
                .catch(err => res.status(500).json("Nope " + err))
            } else if (e === 0) {
                    Player.updateOne({_id: req.params.p1Id}, {
                    
                        $addToSet: {
                            'ship.storage.content': {
                                _name: req.body.itemToBuy,
                                qty: req.body.qtyToBuy 
                        }
                    }
                }).catch(err => res.status(500).json("Nope " + err))
            }
        
        });

        
   

    // Player.findOne({_id: req.params.p1Id})
    // .then(player => {
    //     player.find({"ship.storage.content": { $elemMatch: {_name: "Rum"}}})
    //     .then(e => {
    //         console.log('Response is success' + e)
    //     })
    //     .catch()
        
    //     // player.find({"_name": "Rum"})
    //     // .then(e => {
    //     //         console.log("found it!" + e)
    //     //     }
    //     // )
    //     // .catch(err => res.status(500).json("Error finding item " + err))
    // })
    // .catch(err => res.status(500).json("Error finding player " + err))
    // Player.updateOne({_id: req.params.p1Id}, {
    //     $inc : {
    //         "ship.storage"
    //     }
    // })

    //B: Update town and player together using findOne

    // Add items to player document
    //and remove item qty of item name from town where player is
    //and has bought it from

    // Check if the qty has reached 0
    // if it has, delete the item from the town
    // the check would probably be done on the front end?
})

module.exports = router;