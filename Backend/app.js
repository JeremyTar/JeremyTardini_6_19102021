const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routeSauces = require('./routes/sauces');
const userRoutes = require('./routes/user');
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()

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

app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', routeSauces)
app.use('/api/auth', userRoutes);

module.exports = app;

