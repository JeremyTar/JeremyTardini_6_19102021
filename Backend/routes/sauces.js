const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces')

router.get('/', multer, saucesCtrl.getAllSauces) 
router.get('/:id', multer, saucesCtrl.getOneSauce);

