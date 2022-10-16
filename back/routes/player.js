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

router.route('/sellItems/:p1Id').post(async (req, res) => {
    const town = req.body.town;
    const item = req.body.itemToBuy;
    const cost = req.body.cost;
    const qty = req.body.qtyToBuy;
    const playerId = req.params.p1Id;
    

    // This updates the quantity a town has of a particular item
    Town.find({"_name": town, 
    "buildings.market.products._name": {$in: [item]}})
    .count()
    .then((e) => {
        console.log('Town ' + town + ' has ' + e + ' ' + item)
        if (e > 0) {
            console.log('Bigger than 0')
            Town.updateOne({"_name": town, "buildings.market.products._name": item}, {
                $inc: {
                    "buildings.market.products.$.qty": qty
                }
            })
            .catch(err => res.status(500).json('Error while Market purchase updating town item qty: ' + err))
        } else if (e === 0) {
            console.log('Smaller than 0')
            Town.updateOne({"_name": town}, {
                $addToSet: {
                    "buildings.market.products": {
                        _name: item,
                        qty: qty
                    }
                }
            })
            .catch(err => res.status(500).json("Nope " + err))
        }
    })
    .catch(err => res.status(500).json('Error Finding town: ' + err));


    

    //check here first if the item object exists, if noit just
    //add it to the array using push?

    // Find the player document, update the quantity 
    //number of the the item in question
    Player.find({_id: playerId,
        'ship.storage.content._name': {$in: [item]}})
        .count()
        .then(a => {
            console.log(a)
        
            if (a > 0) {
                Player.updateOne({_id: playerId, 'ship.storage.content._name': item}, {
                    $inc: {
                        'ship.storage.content.$.qty': -(qty),
                        funds: cost
                    }
                })
                .then(b => {
                    console.log(b)
                    console.log('quantity:' + qty)
                })
                .catch(err => res.status(500).json("Nope " + err))
            } else if (a <= 0) {
                // Pull here!
                //     Player.updateOne({_id: playerId}, {
                    
                //         $addToSet: {
                //             'ship.storage.content': {
                //                 _name: item,
                //                 qty: qty
                //         }
                //     }
                // }).catch(err => res.status(500).json("Nope " + err))
                console.log('Player has run out of ' + item);
            }
        
        })
        .then(()=> {
            res.send({qty: qty});
        })
        .catch(err => res.status(500).json('Error Finding Player: ' + err));

})

router.route('/purchaseItems/:p1Id').post(async (req, res, next) => {

    const town = req.body.town;
    const item = req.body.itemToBuy;
    const cost = req.body.cost;
    const qty = req.body.qtyToBuy;
    const playerId = req.params.p1Id;
    
    //console.log("This is the purchase items route: " + req.params.p1Id);
    //console.log("This is the body of the request: " + JSON.stringify(req.body));

    // Edit this to find then update
    //if <= 0 pull just as the route above
    Town.updateOne({"_name": town, "buildings.market.products._name": item}, {
        $inc: {
            "buildings.market.products.$.qty": -(qty)
        }
    })
    .catch(err => res.status(500).json('Error while Market purchase updating town item qty: ' + err))

    //check here first if the item object exists, if noit just
    //add it to the array using push?

    Player.find({_id: playerId,
        'ship.storage.content._name': {$in: [item]}})
        .count()
        .then(e => {
            console.log(e)
        
            if (e > 0) {
                Player.updateOne({_id: playerId, 'ship.storage.content._name': item}, {
                    $inc: {
                        'ship.storage.content.$.qty': qty,
                        funds: cost
                    }
                })
                .then(e => {
                    console.log(e);
                    res.send({qty: qty});
                })
                .catch(err => res.status(500).json("Nope " + err))
            } else if (e === 0) {
                    Player.updateOne({_id: playerId}, {
                    
                        $addToSet: {
                            'ship.storage.content': {
                                _name: item,
                                qty: qty
                        }
                    }
                }).
                then(() => {
                    res.send({qty: qty});
                })
                .catch(err => res.status(500).json("Nope " + err))
            }
        
        });
    //B: Update town and player together using findOne

    // Add items to player document
    //and remove item qty of item name from town where player is
    //and has bought it from

    // Check if the qty has reached 0
    // if it has, delete the item from the town
    // the check would probably be done on the front end?
})

// router.route('/next').post((req, res) => {
//     console.log('The next')
// })

module.exports = router;