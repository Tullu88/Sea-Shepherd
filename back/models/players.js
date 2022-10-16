const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
// Create Schema
const PlayerSchema = new Schema({
    _id: ObjectId,
    name: String,
    ship: {
        name: String,
        model: String,
        status: String,
        location: String,
        storage: {
            weight: Number,
            content: [
                {_name: String, qty: Number}
            ]
        }
    },
    crew: {
        qty: Number,
        sailors: [String]
    },
    funds: Number,
    guns: Number
});

// And Model
const Player = mongoose.model('player', PlayerSchema);

module.exports = Player;