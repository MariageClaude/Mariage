const express = require('express');
const Guest = require('../models/Guest');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Récupérer tous les invités
router.get('/', authMiddleware, async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un invité
router.post('/', authMiddleware, async (req, res) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de l\'ajout de l\'invité' });
  }
});

module.exports = router;
