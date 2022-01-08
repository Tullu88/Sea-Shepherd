const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    _name: String,
    _weight: Number,
    _size: Number,
    // priceList: {
    //     type: Map,
    //     of: String
    // }
    priceList: [
        { _town: String , sellPrice: Number, buyPrice: Number}
    ]
})

const Item = mongoose.model('item', ItemsSchema);

module.exports = Item;