const express = require('express');
const passportSetup = require('../config/passport-setup');
const Player = require('../models/players');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const getCall = require('../apicall');
const request = require('request');
const passport = require('passport');
const Ships = require('../models/ships');
const Sailor = require('../models/sailor'); 
const SailorClass = require('../mechanics/sailorMaker');
const Ship = require('../models/ships');
var ObjectId = require('mongodb').ObjectID;


//const mongo = require('mongoose');
//const recordRoutes = express.Router();
//const { MongoClient } = require("mongodb");

const router = express.Router();

router.get('/api/newSailorTest', (req, res) => {
    res.send(new Sailor);
});

// Through this route the player can increase his 
//ship's crew numbers by hiring new sailors 
// router.route('/api/hire1/:id').post((req, res) => {
//     console.log(req.params.id);
//     console.log(req.body);
//     let sailorArray = [];
//     let databaseSailorsCount = 0;

//     Sailor.countDocuments({"playerId" : req.params.id}, function(err, response) {
//         databaseSailorsCount = req.body.crew;
//         console.log('Databse Sailors Count: ' + databaseSailorsCount);
//      })
//     // .catch(err => res.status().json('Error: ' + err));

    

//     // Find the player with the respective id
//     Player.findOne({"id": req.params.id})
//         .then(player => { 
//             // Fetch how many sailors the player has and make sure
//             //that the quantity key (in the player doc) reflects that
//             //if not, make the necessary amends.

//             // Fetch the player's ship's stats
//             Ships.findOne({"ship": player.ship.name}) // query how many sailors the player has
//                 .then(ship => {
                    
//                     const crewNumbers = ship._max_crew;

//                     if (databaseSailorsCount !== player.crew.qty) {
//                         // If the sailors in the sailors databaqse that belong
//                         //to the player are of a different quantity to the 
//                         //qty saved in the player document. Update the player
//                         //qty key to match the sailors count in the databse
//                         player.crew.qty = databaseSailorsCount;
//                     }

//                    //>>>> 1 crew member is being added, yet without any info<< 

//                 // If max crew number not reached add a crew member
//                     if (player.crew.qty < crewNumbers) {
//                         console.log('internal add');
//                         // Here is where new crew is added
//                         //the randomization needs to be around here
//                         for (let i = 0; i < req.body.crew; i++) {
//                             //insert
//                            let newSailor = new SailorClass;
                          
//                             sailorArray.push( newSailor);
//                             console.log("sailor Array" + sailorArray.map());    
//                         }


//                         Player.updateOne({
//                             "id": req.params.id
//                         },{ $addToSet: { 
//                             "sailor": sailorArray.playerId }})


//                         Sailor.find({"playerId": req.params.id})
//                         .then(sailor => {
//                             Player.find({"playerId": req.params.id})
//                             .then(player =>{
//                                 player.crew.sailors = sailor._id;
//                             })
//                            .catch(err=>'Error @ sailor id add: ' + err)
//                         })
//                         .catch(err=>'Error @ sailor id add: ' + err)
//                         //    .save()
//                         //    .catch(err => res.status().json("Insert Sailor Failer: " + err));
//                         // need to save to player document also here
//                         // Sailor.findOneAndUpdate({
//                         //     playerId : req.params.id
//                         // }, {
                            
//                         // })

//                         player.crew.qty += req.body.crew;

//                         } else {
//                             console.log('Ship\'s max capacity reached');
//                             }
                    
//                     // Once the change has been specified
//                     //save it to the database
//                     player.save()
//                         .then(() => {
//                             res.json(player.crew.qty);
//                             console.log(player);
//                 })
//                 .catch(err => res.status(400).json('Error: ' + err));   
//         })
//         .catch(err => res.status(400).json('Error: ' + err));
//     })
//     .catch(err => res.status(500).json('Error: ' + err));
// });


router.get('/api/player/:p1Id', (req, res) => {
    //use the model to make queries
    //console.log('Body: ', req.body);

    Player.findOne({"id": req.params.p1Id})
        .then(player => {
            Ships.findOne({"type": player.ship.type})
                .then(ship => {
                    res.send({player, ship})
                })
                    .catch(err => res.status(400).json('Error: ' + err));
            //res.send(player, ship);
        })
        .catch(err => res.status().json('Error: ' + err));
});


router.get('/api/location/:p1Id', (req, res) => {
    //use the model to make queries
    //console.log('Body: ', req.body);

    Player.findOne({"id": req.params.p1Id})
        .then(player => {
            Ships.findOne({"type": player.ship.type})
                .then(ship => {
                    res.send({player, ship})
                })
                    .catch(err => res.status(400).json('Error: ' + err));
            //res.send(player, ship);
        })
        .catch(err => res.status().json('Error: ' + err));
});

router.post('/api/sailTo/:p1Id', (req, res) => {
    //const battleConfirmed = false;
    const sailingState = req.body.sailingCounterState;
    console.log(sailingState)
    
    const pveBattleChance = setInterval(() => {
        const chance = Math.floor((Math.random() * 99) + 1);
        if (chance > 80) {
            clearInterval(pveBattleChance);
            //battleConfirmed = true;
            console.log('Player sailing endpoint')
            res.send({battleConfirmed: true})
        }
    }, 1000)

    
})

router.post('/api/sailTo/break/p1Id', (req, res) => {
    //res.send('Sailing to location: ' + req.body.location);
    Player.findOne({"id": req.params.p1Id})
    .then(player => {
        player.ship.location = req.body.location;
        console.log(player.ship.location + " and " + req.body.location)

        player.markModified(player.ship.location);
        player.save()
            .then(() => {
                res.send("Sailed to " + player.ship.location);
                //res.json('Sailed!');
                //console.log(player.ship.location);
            })
            .catch(err => res.status(400).json('Error saving: ' + err));
    })
    .catch (err => res.status(400).json("SailTo error: " + err));
});


// Make sure that this edits the amount of sailors each player has at the end of
//the battle, starting with p1 to understand how it works
router.post('/api/sailorsDeath/:p1Id', (req, res) => {

    const p1Id = req.params.p1Id;

    if (req.body.crew !== 0) {
    console.log("this is sailor death:")
    console.log(req.params.p1Id);
    console.log(req.body.crew);
    var sailorsToRemoveFromPlayerObj = [];
    //var sailorsDocumentsToDelete = [];

    
// Match all the sailors that belong to the player through the id
//then delete a '$sample'(random) selection of them. 
    Sailor.aggregate([
        { $match: { "playerId": req.params.p1Id } },
        { $sample: { size: req.body.crew } }
    ])
    .then((result) => {
        //console.log('result before: ' + result)
        
       
        result.map((e) => {return sailorsToRemoveFromPlayerObj.push(e._id)})
        //result.map((e) => {return sailorsDocumentsToDelete.push()})
        // Sailor.deleteMany({ sailorsToRemoveFromPlayerObj } )
        // .then((result) => {
        //     console.log('DeleteMany result is: ' + JSON.stringify(result))
        // })
        // .catch()

        console.log('Sailor To Remove: ' + sailorsToRemoveFromPlayerObj)
        

        const removeSailorFromPlayerObj = async function (playerId, sailorId, sailorQty) { //
            const result = await Player.updateOne({"id": playerId}, {
                $pull : {
                    "crew.sailors": `${sailorId}`
                    //"crew.sailors": sailorId
                },
                $set : {
                    "crew.qty": sailorQty
                }
            }, { returnOriginal : false})
            console.log("This is remove sailor: " + JSON.stringify(result));
            //res.json('Success ' + sailorsToRemoveFromPlayerObj)
        }

        const removeSailorDocumentFromCollection = async (sailorId) => {
            const result = await Sailor.deleteOne({"_id": `${sailorId}`}); 
        }

        // const removeSailorDocumentFromCollection = async (playerId, sailorId) => {
        //     const result = await Sailor.
        // }
        sailorsToRemoveFromPlayerObj.forEach(e => {
            removeSailorFromPlayerObj(p1Id, e, req.body.crew)
        })
        
        sailorsToRemoveFromPlayerObj.forEach( e => {
            removeSailorDocumentFromCollection(e);
        })
        
        Player.findOne({"id": req.params.p1Id})
        .then((player) => {
        player.crew.qty = req.body.qty;

            player.save()
            .then(() => {
                res.json('Sailor recount!');
                console.log(player);
            })
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err))

        // Fix this to update crew qty. thx
        // Player.updateOne({"id": p1Id}, {
        //     $set: {
        //         "crew.qty": `${req.body.crew}`
        //     }
        // })

        //function that updates the crew quantity
        // const updateSailorQty = async function (playerId, crewQty) {
        //     const result = await Player.updateOne({"id": playerId}, {
        //             "crew.qty": crewQty
        //     })
        // }

        // Sailor.count({playerId: p1Id})
        //         .then(sailorsCount =>{
        //             Player.findOne({"id": p1Id})
        //             .then(player => {
        //                 if (player.crew.qty !== sailorsCount) {
        //                     updateSailorQty(p1Id, sailorsCount);
        //                     console.log('Sailors count is: ' + sailorsCount)
                            
                            
        //                 }
        //             })
        //             .catch(err => res.status(400).json('error consolidating2 ' + err))
        //         })
        //         .catch(err => res.status(400).json('error consolidating2 ' + err))
        // Player.updateOne({"_id": p1Id}, {
        //     $pull: {
        //         "crew.sailors": sailorsToRemoveFromPlayerObj
        //     }
        // })
        // .then(response => {
        //     console.log("Did it work? " + JSON.stringify(response))
        // })
        // .catch(err => res.status(500).json('Nope ' + err))
        // .then((player) => {
        //         player.save()
        //         .then(() => {
        //             res.json('Sailor recount!');
        //             console.log(player);
        //         })
        //         .catch(err => res.status(400).json('Error: ' + err));
            
        // //     res.json('Successfuly removed from player Obj: ' + response)
        //  })
        //  .catch(err => res.status(500).json('Error removing sailors from player obj ' + err))

        // Player.deleteMany({ "sailor.crew" : { $in: [
        //     sailorsToRemoveFromPlayerObj
        // ] } } )

        // Player.findOne({"id": req.params.p1Id})
        // .then(player => {
        //     player.save()
        //     .then(() => {
        //         res.json('Sailor recount!');
        //         console.log(player);
        //     })
        //     .catch(err => res.status(400).json('Error: ' + err));
        // })
        // .catch(err => res.status(400).json('Error: ' + err))

        //res.json("this is the sample result: " + result[0]._id)
        console.log("this is the result of sailor death " + JSON.stringify(result))
    })
    .catch(err => res.status(400).json('Error: ' + err))
    } else {
        return;
    }
    // Player.findOne({"id": req.params.p1Id})
    //     .then(player => {
    //         player.crew.qty = req.body.crew;

    //         // Here is where we need to handle the deletion
    //         //of both the sailors in the sailors collection
    //         //and their id references in the player object
            

    //         player.save()
    //             .then(() => {
    //                 res.json('Sailor recount!');
    //                 console.log(player);
    //             })
    //             .catch(err => res.status(400).json('Error: ' + err));  
    //     })
    //     .catch(err => {res.status().json('Error: ' + err)})
    // res.send(req.body);
    // console.log(req.body);
});


router.get('/', (req, res) => {
    res.send("Hello world!")
    
});

router.get('/ne2', (req, res) => {
    //res.send('This is the new endpoint');
    getCall(res);
});

router.get('/user', (req, res, body) => {
    
});
   
router.get('/getinfo', (req, res, body) => {
    const getToken = (url, callback) => {
        const options = {
            url: process.env.GET_TOKEN,
            json: true,
            body: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        };
    
        request.post(options, (err, res, body) => {
            if(err) {
                return console.log(err)
            }
            console.log(`Status: ${res.statusCode}`)
            console.log(body);
    
            callback(res);
        });
    }
    
    var AT = '';
    var info = '';
    getToken(process.env.GET_TOKEN, (res) => {
        AT = res.body.access_token;
        return AT;
    });
    
    const getGames = (url, accessToken, callback) => {
        const gameOptions = {
            url: process.env.GET_GAMES,
            method: 'GET',
            headers: {
                'Client-ID': process.env.CLIENT_ID,
                'Authorization': 'Bearer ' + accessToken
            }
        };
    
        request.get(gameOptions, (err, res, body) => {
            if(err) {
                return console.log(err);
            }
            console.log(`Status: ${res.statusCode}`);
            //res.writeHead(200, {'Content-Type': 'application/json'});

            info = JSON.parse(body);
            console.log(info);


            
        }).pipe(res);
    }
    
    setTimeout(() => {
       getGames(process.env.GET_GAMES, AT, (response) => {
    
        });
    }, 1000);
    
});

module.exports = router;