const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
const auth = require('../middleware/auth');

// GET - tous les invités
router.get('/', auth, async (req, res) => {
  const guests = await Guest.find();
  res.json(guests);
});

// POST - nouveau invité
router.post('/', auth, async (req, res) => {
  const guest = new Guest(req.body);
  await guest.save();
  res.status(201).json(guest);
});

// PUT - mise à jour RSVP
router.put('/:id', async (req, res) => {
  const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(guest);
});

// DELETE - invité
router.delete('/:id', auth, async (req, res) => {
  await Guest.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
