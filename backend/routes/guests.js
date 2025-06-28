const express = require('express');
const Guest = require('../models/Guest');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
router.post('/', async (req, res) => {
  try {
    const plainPassword = req.body.password; // Save the plain text password
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds); // Hash the password

    // Create a new guest with both hashed and plain passwords
    const guest = new Guest({
      ...req.body,
      password: hashedPassword, // Save the hashed password
      plainPassword, // Save the plain text password
    });

    await guest.save();
    res.status(201).json(guest);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'invité :", error);
    res.status(400).json({ error: "Erreur lors de l'ajout de l'invité" });
  }
});

// Supprimer un invité par ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const guestId = req.params.id;
    console.log("ID reçu pour suppression :", guestId);

    const deletedGuest = await Guest.findByIdAndDelete(guestId);
    console.log("Invité supprimé :", deletedGuest);

    if (!deletedGuest) {
      return res.status(404).json({ error: "Invité non trouvé" });
    }

    res.status(200).json({ message: "Invité supprimé avec succès", deletedGuest });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'invité :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Authenticate guest by email and password
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    if (password !== "claude2025") {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    let guest = await Guest.findOne({ name });

    if (!guest) {
      guest = new Guest({ name, password: "" }); // Ajoute d'autres champs requis si besoin
      await guest.save();
    }

    res.status(200).json({ message: 'Connexion réussie', guest });
  } catch (error) {
    console.error('Error in /login route:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour les réponses d'un invité par ID
router.put('/:id/responses', async (req, res) => {
  const { id } = req.params;
  const { dotResponse, civilResponse, NightResponse } = req.body;

  try {
    const updatedGuest = await Guest.findByIdAndUpdate(
      id,
      { dotResponse, civilResponse, NightResponse },
      { new: true }
    );

    if (!updatedGuest) {
      return res.status(404).json({ error: "Invité non trouvé" });
    }

    res.status(200).json({ message: "Réponses mises à jour avec succès", guest: updatedGuest });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des réponses :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
