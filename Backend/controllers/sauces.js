const sauces = require('../models/sauces')

exports.getAllSauces = (req, res, next) => { //Pour obtenir toutes nos sauces 
    sauces.find() //on utilise .find de mangoose pour chercher sur la database nos Sauces.
        .then(sauces => res.status(200).json(sauces)) //Ensuite, on renvoie une réponse positive avec les dites sauces.
        .catch(err => res.status(500).json({err}))  //Sinon une érreur.
}

exports.getOneSauce = (req, res, next) => { //Pour obtenir une seule sauce    
    sauces.findOne({ _id: req.params.id}) //On cherche la sauce par son id.
        .then(sauce => res.status(200).json(sauce)) //Ensuite, on renvoie une réponse positive avec la dite sauce.
        .catch(err => res.status(500).json({err}))  //Sinon une érreur.
}
