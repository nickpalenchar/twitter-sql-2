var express = require('express');
var router = express.Router();
// could use one line instead: var router = require('express').Router();
var tweetBank = require('../models/index.js') //sequelize
var User = tweetBank.User; 
var Tweet = tweetBank.Tweet; 

router.get('/', function (req, res) {
  var tweets = Tweet.findAll({ include: [ User ]} ).then(function(tweets){
    //res.send(tweets);
    res.render( 'index', { title: 'Twitter.js', tweets: tweets } );
  });
});

function getUser (req, res){
  //TODO refactor for sequelize
  var name = req.params.name; 
  Tweet.findAll({ include: [{model: User, where: {name: name}}] })
    .then(function(tweets){
    res.render('index', { tweets: tweets });
  });
}

function getTweet (req, res){
  //TODO refactor for sequelize
  var name = req.params.name, 
      id = req.params.id; 
  Tweet.findAll({ include: [{model: User, where: {name: name, id: id}}] })
    .then(function(tweets){
    res.render('index', { tweets: tweets });
  });
}

router.get('/users/:name', getUser);
router.get('/users/:name/tweets/:id', getTweet);

// note: this is not very REST-ful. We will talk about REST in the future.
router.post('/submit', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;
  //TODO replace tweetbank.add with a sequalize thing
  
  User
    .findOrCreate({where: {name: name}})
    .spread(function(user, created) {
      Tweet.create({UserId: user.dataValues.id, tweet: text}) 
    })
    .then(function() {
      res.redirect('/');
    })
});

module.exports = router;
