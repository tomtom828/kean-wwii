// Node Dependencies
var express = require('express');
var domRouter = express.Router();


// Index Home Page Render
domRouter.get('/', function (req, res){
  res.render('index');
});


// Authors Page Render
domRouter.get('/authors', function (req, res){
  res.render('authors');
});



// ----------------------------------------------------
// Export routes
module.exports = domRouter;
