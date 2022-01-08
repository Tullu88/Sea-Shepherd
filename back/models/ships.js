const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShipSchema = new Schema({
    _name: String,
    _max_guns: Number,
    _max_crew: Number,
    _maxStorage: Number,
    _shipLoad: Number
});

const Ship = mongoose.model('ship', ShipSchema);

module.exports = Ship;





// const mongoose = require ('mongoose');
// const Schema = mongoose.Schema;

// // Create Schema
// const PlayerSchema = new Schema({
//     name: String,
//     ship: String,
//     crew: Number,
//     guns: Number
// });

// // And Model
// const Player = mongoose.model('player', PlayerSchema);

// module.exports = Player;