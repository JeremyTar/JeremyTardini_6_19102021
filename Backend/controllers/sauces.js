const Sauce = require('../models/sauces')
const fs = require('fs')

exports.getAllSauces = (req, res, next) => { //Pour obtenir toutes nos sauces 
    Sauce.find() //on utilise .find de mangoose pour chercher sur la database nos Sauces.
        .then(sauces => res.status(200).json(sauces)) //Ensuite, on renvoie une réponse positive avec les dites sauces.
        .catch(err => res.status(500).json({err}))  //Sinon une érreur.
}

exports.getOneSauce = (req, res, next) => { //Pour obtenir une seule sauce    
    Sauce.findOne({ _id: req.params.id}) //On cherche la sauce par son id.
        .then(sauce => res.status(200).json(sauce)) //Ensuite, on renvoie une réponse positive avec la dite sauce.
        .catch(err => res.status(500).json({err}))  //Sinon une érreur.
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // suppression de l'ID fournit par le front car MongoDB en créé un automatiquement.
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
      });
      sauce.save().then(
        () => {
          res.status(201).json({
            message: 'Post saved successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
}

exports.modifySauce= (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(
      () => {
        res.status(201).json({
          message: 'Sauce updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
  
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(Sauce => {
        const filename = Sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({error}));
        });
      })
      .catch(error => res.status(500).json({error}));
  };


exports.likesDislikes = (req, res, next) => {
    if(req.body.like === 1) {
        Sauce.updateOne(
            {_id: req.params.id},
            {$inc: {likes: +1}, $push: { usersLiked: req.body.userId}})
            .then((sauce) => res.status(200).json({message : 'Like ajouté !'}))
            .catch(error => res.status(400).json({ error }))
    }
    else if(req.body.like === -1) {
        Sauce.updateOne(
            {_id: req.params.id},
            {$inc: {dislikes: +1}, $push: {usersDisliked: req.body.userId}})
            .then((sauce) => res.status(200).json({message : 'Dislike ajouté !'}))
            .catch(error => res.status(400).json({ error }))

    }
    else {
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne(
                    {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
                    .then(() => res.status(200).json({message: 'Like enlevé'}))
                    .catch(error => res.status(400).json({error})
                )
            }
            else if(sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne(
                    {$inc: {Dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
                    .then(() => res.status(200).json({message: 'Dislike enlevé'}))
                    .catch(error => res.status(400).json({error})
                )
            }
        })
    }
 };