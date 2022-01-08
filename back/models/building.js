const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuildingSchema = new Schema ({
    _name: String,
    product: [{
        name: String,
        buildTime: {
            level1: Number,
            level2: Number,
            level3: Number,
            level4: Number,
            level5: Number,
            level6: Number,
            level7: Number,
            level8: Number,
            level9: Number,
            level10: Number
        }
    }]
})

const Building = mongoose.model('building', BuildingSchema);