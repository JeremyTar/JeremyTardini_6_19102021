const express = require('express'); // instalation de express
const mongoose = require('mongoose');
const helmet = require("helmet"); // elements de securite pour la protection des headers
const xss = require('xss-clean'); // elements de securite contre les attaque xss
const rateLimit = require("express-rate-limit"); // element express pour limiter le temps de connection
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()

// Route pour nos sauce et user

const routeSauces = require('./routes/sauces');
const userRoutes = require('./routes/user');

// création de notre applicatio nexpress

const app = express();

// connection 0 la base de donne MongoDB

mongoose.connect(process.env.CONNECTION_MONGODB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(express.json()) // substitue bodyparser 
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

