// controllers/cart.controller.js
const Cart = require('../cart.model');
const Product = require('../product.model');

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(200).json([]);
    }
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero del carrello' });
  }
};

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart.items);
  } catch (err) {
    res.status(500).json({ message: 'Errore nell’aggiunta al carrello' });
  }
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Carrello non trovato' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.status(200).json(cart.items);
  } catch (err) {
    res.status(500).json({ message: 'Errore nella rimozione' });
  }
};
