require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const guestRoutes = require('./routes/guests');

const app = express();
const cors = require('cors');

const corsOptions = {
  origin: 'https://mariage-ttxm.onrender.com', // ton frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // si tu utilises les cookies ou sessions
};

app.use(cors(corsOptions));


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guests', guestRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch((error) => console.error('Erreur MongoDB:', error));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
