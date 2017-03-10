// Controllers for rendering webpages to DOM

// Node Dependencies
var express = require('express');
var domRouter = express.Router();
var mysql = require('mysql');


// Import DB Connection JSON (used if on localhost)
var dbInfo = require('../dbInfo.json');


// MySQL Connections
// ===========================================================

// Declare Global Connection variable depending on environment
var connection;

// If deployed, use JawsDB
if(process.env.NODE_ENV == 'production') {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}
// Otherwise, use localhost connection
else {
  connection = mysql.createConnection(dbInfo);
}

// Connect to the Database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});
// ===========================================================



// GET - Index Home Page Render
domRouter.get('/', function (req, res){
  res.render('index');
});



// GET - Authors Page Render
domRouter.get('/authors', function (req, res){
  res.render('authorsByName');
});



// GET - Selected Author Page Render
domRouter.get('/authors/:lastname/:firstname', function (req, res){
  res.render('selectedAuthor');
});



// GET - Search Authors By Starting Letter of Lastname Page Render
domRouter.get('/search/authors/:letter', function (req, res){

  // Get the letter from the url parameters
  var letter = req.params.letter.toUpperCase();

  // Set up proper "%" syntax for MySQL matching
  var myLetter = letter + "%"; // ex: "A%" or "B%"

  // Read from Database
  connection.query('SELECT DISTINCT lastname, firstname FROM letters WHERE lastname LIKE ? ORDER BY lastname ASC', [myLetter], function(err, response){
    
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
    
  });

});



// GET - Search Authors By First or Last Name
domRouter.get('/search/authors/:type/:name', function (req, res){

  // Get the name and search type from the url parameters
  var name = req.params.name.toLowerCase();
  name = name.charAt(0).toUpperCase() + name.slice(1);
  var type = req.params.type.toLowerCase();

  // Return if parameter is not a first name or lastname
  if(type != "firstname" && type != "lastname"){
    res.render('search-authors', null);
    return;
  }

  // Read from Database
  connection.query('SELECT DISTINCT lastname, firstname FROM letters WHERE ' + mysql.escapeId(type) + ' = ? ORDER BY lastname ASC', [name], function(err, response){
    
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
      res.render('search-authors', {errObject: {type: type, name: name}});
    }
    
  });

});


// GET - Retrieve selected Author (Lastname, Firstname) from MySQL
domRouter.get('/api/letters/all/:lastname/:firstname', function (req, res) {
  
  // Collect parameters
  var lastname = req.params.lastname;
  var firstname = req.params.firstname;

  // Read Database
  connection.query('SELECT letters.filename, archives.pages, letters.letterdate, letters.ts_dateguess FROM letters, archives WHERE letters.lastname = ? AND letters.firstname = ? AND letters.filename = archives.filename ORDER BY letters.letterdate DESC', [lastname, firstname], function(err, response) {
    if(err) throw err;

    // Export to Client Side
    res.json(response);

  });

});


// ----------------------------------------------------
// Export routes
module.exports = domRouter;