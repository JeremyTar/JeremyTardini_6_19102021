const express = require('express'); // instalation de express
const mongoose = require('mongoose'); // Module pour l'utilisation de MongoDB
const helmet = require("helmet"); // Module de securite pour la protection des headers
const xss = require('xss-clean'); // Module de securite contre les attaque xss
const rateLimit = require("express-rate-limit"); // Module express pour limiter le temps de connection
const dotenv = require('dotenv'); // Module pour charger notre variable d'environnement
const cors = require('cors'); // Module pour gestion des requetes CORS
const path = require('path');
dotenv.config();

// Route pour sauces et user

const routeSauces = require('./routes/sauces');
const userRoutes = require('./routes/user');

// création de notre applicatio nexpress

const app = express();

// connection à la base de donnée MongoDB

mongoose.connect(process.env.CONNECTION_MONGODB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

 // Authorisation utilisateur CRUD 

app.use(cors())
app.use(express.json()) // substitue bodyparser. ligne pour appeller fonction parse de express
app.use(helmet()); 
app.use(xss());

// Constante de limitation de temps de connection par IP. Module de Node Rate-limite
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use('/images', express.static(path.join(__dirname, 'images'))); // dossier multer
app.use('/api/sauces', routeSauces)
app.use('/api/auth', userRoutes);

module.exports = app;

