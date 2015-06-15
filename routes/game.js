var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('game', { title: 'mahvatar', firebase_url: process.env.FIREBASE_URL });
});

module.exports = router;
