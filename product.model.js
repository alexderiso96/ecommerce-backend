const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  featured: Boolean
});

module.exports = mongoose.model('Product', ProductSchema);
