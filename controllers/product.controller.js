const Product = require('../models/product.model');

// Prendi tutti i prodotti
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero prodotti', error });
  }
};

// Prendi prodotti in evidenza
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true });
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero prodotti in evidenza', error });
  }
};

// Prendi prodotto singolo per id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Prodotto non trovato' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero prodotto', error });
  }
};
