const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;

    // Prendi carrello utente
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Carrello vuoto' });
    }

    // Calcola totale
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);

    // Crea ordine
    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      total,
      status: 'in attesa'
    });

    await order.save();

    // Svuota carrello
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Ordine creato con successo', order });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione ordine', error });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero ordini', error });
  }
};
