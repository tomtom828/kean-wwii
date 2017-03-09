// Controllers for rendering webpages to DOM

// Node Dependencies
var express = require('express');
var domRouter = express.Router();

var mysql = require('mysql');


// Import DB Connection JSON
var dbInfo = require('../dbInfo.json');
// console.log(dbInfo)


// Index Home Page Render
domRouter.get('/', function (req, res){
  res.render('index');
});


// Authors Page Render
domRouter.get('/authors', function (req, res){
  res.render('authorsByName');
});


// View Selected Author Page Render
domRouter.get('/authors/:lastname/:firstname', function (req, res){
  res.render('selectedAuthor');
});


// Search Authors By Name Page Render
domRouter.get('/search/authors/:letter', function (req, res){

  // Get the letter from the url parameters
  var letter = req.params.letter.toUpperCase();

  // Query Database for Author with the Last Name of the letter
  var connection = mysql.createConnection(
    dbInfo
  );

  // Connect to the Database
  connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId);
  });

  // Read from Database
  connection.query('SELECT DISTINCT lastname, firstname FROM letters WHERE lastname LIKE "' + letter + '%"' + ' ORDER BY lastname ASC', function(err, response){
    
    // Respond with error if database error
    if(err) throw err;

    // Render authors of said letter
    if(response.length > 0){

      // Clean repsonse to ensure it is all lowercase
      var authorNameData = [];
      for(var i = 0; i < response.length; i++){
        authorNameData.push({
          "firstName": response[i].firstname.toLowerCase(),
          "lastName": response[i].lastname.toLowerCase(),
          "displayFirstName": response[i].firstname,
          "displayLastName": response[i].lastname
        })
      }
      // Render the author names
      res.render('search-authors', {hbsObject: authorNameData});

    }
    // Otherwise, no author was found
    else {
      res.render('search-authors', null);
    }
    

    // Disconnect from MySQL
    connection.end();
  });





  // res.render('search-authors-by-name');
});



// ----------------------------------------------------
// Export routes
module.exports = domRouter;
