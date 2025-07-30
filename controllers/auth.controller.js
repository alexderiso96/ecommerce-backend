const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Controlla se esiste già l'utente
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email già registrata' });

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea utente
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registrazione completata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella registrazione', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trova utente
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utente non trovato' });

    // Verifica password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Password errata' });

    // Genera token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel login', error });
  }
};
