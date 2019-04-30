const mongoose = require('mongoose');
const Schema = mongoose.Schema

const smoothieSchema = new Schema({
  name: {type: String},
  fruits: [{ type: Schema.Types.ObjectId, ref: 'Fruit' }]
}, {timestamps: true})

const Smoothie = mongoose.model('Smoothie', smoothieSchema)
module.exports = Smoothie;
