const { schema } = require("./players");
const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const SailorSchema = new Schema({
    playerId: String,
    name: String,
    playerName: String,
    skills: {
        gunnery:Number,
        seamanship: Number,
        swordmanship: Number,
        navigation: Number,
        marksmanship: Number
    },
});

// And Model
const Sailor = mongoose.model('sailor', SailorSchema);

module.exports = Sailor;