const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TownSchema = new Schema({
    _name: String,
    units: [String],
    governor: String,
    buildings: {
        market: {
            built: Boolean,
            level: Number,
            products: [
                { _name: String, qty: Number }
            ]
        },
        foundry: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        }, 
        blacksmithy: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        },
        gunsmithy: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        },
        port: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        },
        shipyard: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        },
        lumberyard: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        },
        tavern: {
            built: Boolean,
            level: Number,
            sailors: {
                qty: Number,
                sellPrice: Number
            },
            officers: [Object]
        }, 
        governorEstate: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        },
        fort: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        },
        wall: {
            built: Boolean,
            level: Number,
            products: [{
                _name: String,
                qty: Number,
                sellPrice: Number,
                buyPrice: Number
            }]
        },
    }
})

const Town = mongoose.model('town', TownSchema)

module.exports = Town;