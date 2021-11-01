const express = require('express');
const router = express.Router(); // appel du module Router de express

const multer = require('../middleware/multer-config'); // Middleware pour l'ajout et la suppression d'image dans la base de donné
const auth = require('../middleware/auth'); // Middleware lié a l'authetification et sa protection

const saucesCtrl = require('../controllers/sauces'); // implentation du controilleur sauce


router.get('/',auth, saucesCtrl.getAllSauces);
router.get('/:id',auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id',auth, multer, saucesCtrl.modifySauce);
router.delete('/:id',auth, multer, saucesCtrl.deleteSauce);
router.post('/:id/like',auth, saucesCtrl.likesDislikes)


module.exports = router;