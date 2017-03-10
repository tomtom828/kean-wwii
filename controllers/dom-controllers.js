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
domRouter.get('/', function (req, res) {
  res.render('index');
});


// REDIRECT - To Search Authors By Starting Letter of Lastname Page Render
domRouter.get('/search/authors', function (req, res) {
  // If no letter was selected, re-direct to A
  res.redirect('/search/authors/a');
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




// GET - Author's Bio Page (contains the Picture, Bio, Letters, Map)
domRouter.get('/authors/:lastname/:firstname', function (req, res) {
  
  // Collect parameters
  var lastName = req.params.lastname.toLowerCase();
  var firstName = req.params.firstname.toLowerCase();

  // Clean parameters
  var displayLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
  var displayFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // Read Database
  connection.query('SELECT letters.filename, archives.pages, letters.letterdate, letters.ts_dateguess FROM letters, archives WHERE letters.lastname = ? AND letters.firstname = ? AND letters.filename = archives.filename ORDER BY letters.letterdate DESC', [lastName, firstName], function(err, response) {
    if(err) throw err;

    // Clean response to display error message if no files found
    var fileResponse;
    if (response.length == 0) {
      fileResponse = null;
      defaultFileName = "Sorry. No Letters Available.";
      defaultFilePages = 1;
      awsDefaultFileName = "No+Letter+Found";
    }
    // Otherwise, give back the response
    else {
      fileResponse = response;
      defaultFileName = response[0].filename;
      defaultFilePages = response[0].pages;
      awsDefaultFileName = defaultFileName.replace(/ /g, "+");
    }

    // Create page render object
    var authorAndFileData = {
      firstName: firstName,
      lastName: lastName,
      displayFirstName: displayFirstName,
      displayLastName: displayLastName,
      defaultFileName: defaultFileName,
      defaultFilePages: defaultFilePages,
      awsDefaultFileName: awsDefaultFileName,
      letterData: fileResponse
    }

    // Render Author's Bio Page
    res.render('view-author', {hbsObject: authorAndFileData});

  });

});




// GET - Search All Letters Page Render
domRouter.get('/search/letters', function (req, res) {
  
  // Read Database
  // connection.query('SELECT filename FROM letters ORDER BY ts_dateguess ASC, filename ASC', function(err, response) {
  //   if(err) throw err;

  //   // Render All Letters
  //   res.render('search-letters', {hbsObject: response});

  // });


  res.render('search-letters');

});



  
// POST - Search All Letters in Database of selected criteria
domRouter.post('/search/letters', function (req, res) {

  var branch = req.body.branch;
  var sex = req.body.sex;
  var year = req.body.year;

  // Set up proper "%" syntax for MySQL matching
  var myYear = year + "%"; // ex: "1941%" or "1942%" or "%"
  var myServiceBranch = branch + "%"; // ex: "Army%" or "Army (British)%" or "%"
  var mySex = sex + "%"; // ex: "M%" or "F%" or "%"

  // Read Database
  connection.query('SELECT filename FROM letters WHERE gender LIKE ? AND service_branch LIKE ? AND ts_dateguess LIKE ? ORDER BY filename ASC', [mySex, myServiceBranch, myYear], function(err, response) {
  if(err) throw err;

    // Clean response to display error message if no files found
    var fileResponse;
    if (response.length == 0) {
      fileResponse = null;
    }
    else {
      fileResponse = response;
    }

    // Clean up search terms
    var displaySex;
    if (sex == "F") {
      displaySex = "women";
    }
    else if (sex == "M") {
      displaySex = "men";
    }
    else {
      displaySex = "anyone";
    }

    var displayBranch;
    if (branch == "") {
      displayBranch = "any service branch";
    }
    else {
      displayBranch = "the " + branch;
    }

    var displayYear;
    if (year == "") {
      displayYear = "any year";
    }
    else {
      displayYear = year;
    }

    // Create page render object
    var letterAndFileData = {
      branch: displayBranch,
      sex: displaySex,
      year: displayYear,
      letterData: fileResponse
    }

    // Render Letter Search Results
    res.render('search-letters', {hbsObject: letterAndFileData});

  });



});

// ----------------------------------------------------
// Export routes
module.exports = domRouter;