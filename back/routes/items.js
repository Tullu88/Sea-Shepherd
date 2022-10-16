const express = require('express');
const Item = require('../models/items');
const Town = require('../models/town');
const router = express.Router();


router.route('/createItem').post((req, res) => {

    const payload = { 
        "_name": "Rum",
    "_weight": 1,
    "_size": 1,
    "priceList": [
        { "_town": "Caracas" , "sellPrice": 6, "buyPrice": 5},
        { "_town": "Port Royal" , "sellPrice": 5, "buyPrice": 4},
        { "_town": "Tortuga" , "sellPrice": 3, "buyPrice": 2}
    ]
    }

    const newItem = new Item(payload);

    newItem.save((error) => {
        if (error) {
            console.log('Something happened');
        } else {
            res.json('Success')
            console.log('Data was saved');
        }
    })

    })

router.route('/addItemsToTown').post(async (req, res) => {

    // This is an admin route that handles adding new items
    //to a town
    //console.log(req.body.town)

    let hasItem = await Town.countDocuments({ "_name": req.body.town, "buildings.market.products._name": req.body.item });

    console.log('has item?: ' + hasItem)

    if (hasItem > 0) {
        //update the item quantity
        Town.updateOne({"_name": req.body.town, "buildings.market.products._name": req.body.item}, {
            $inc: {
                "buildings.market.products.$.qty": req.body.qty
            }
        }).catch(err => res.status(500).json('ISE updating item qty: ' + err))
    } else {
        //add the new item
        Town.updateOne({"_name": req.body.town}, {
            $addToSet: {
                "buildings.market.products": {
                    "_name": req.body.item,
                    "qty": req.body.qty
                }
            }
        }).catch(err => res.status(500).json('ISE addin new item: ' + err))
    }
    // Town.({"_name": req.body.town})
    // .then(town => {
    //     if (town.buildings)
    // })
    // .catch()
})

router.route('/getItemsPriceList/:town').post((req, res) => {
    //Item.find({_name: req.body})
    let variable = [];
    let names = [];
   //req.body.map(e => console.log(e._name))
   req.body.map(e => names.push(e._name));
    req.body.map(e => variable.push(e));

    let playerItemFullDetails = [];
    let obj = {}; 

    Item.find({
        '_name': { $in: 
            names
        }
    }, {
        _weight: 1,
        _size: 1,
        '_name': 1,
         'priceList': { $elemMatch: {
             _town: req.params.town
            }
        }
    })
    .then(e => {
        //console.log('this is e: ' + e)
        res.send({baseItemDetails: e, playerItemDetails: variable})
    })
    .catch(err => res.status(500).json('Fetching item detail failure: ' + err))

    // variable.forEach(e => {
    //     Item.findOne({_name: e})
    //     .then(item => {
    //         // for (let i = 0; i < item.length; i++) {
    //         //     if (item.priceList[i].indexOf(e) != -1){
                    
    //         //         prices.push();
    //         //         //console.log(item.priceList[i])
    //         //     }
    //         // }

    //         prices.push(...prices, item)

    //         // Prepare payload to send back in res
    //         //must have name, sellPrice and buyPrice included  
    //         obj = item.priceList.find(a => a._town === req.params.town)

    //         //console.log(obj);
           
    //         // console.log(item.indexOf("Tortuga"))
    //         //     prices.push(item)
    //         //     console.log(item)
    //     })
    //     .catch(err => res.status(500).json('Fetching item detail failure: ' + err))
    // })
    
    // res.send(obj);

    // prices.forEach(a => {
    //     console.log(a)
    // })

    //console.log(prices)

    //console.log('get Items EP')
    //console.log(JSON.stringify(variable));

    //res.send(req.params.stuff)
})




module.exports = router;