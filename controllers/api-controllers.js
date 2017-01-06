// Node Dependencies
var express = require('express');
var apiRouter = express.Router();
var mysql = require('mysql');


// Import DB Connection JSON
var dbInfo = require('../dbInfo.json');
// console.log(dbInfo)


// GET - Retrieve all Authors (Lastname, Firstname) from MySQL
apiRouter.get('/api/authors/all', function (req, res) {
  
  // Link in Author Data
  // Declare Database
  var connection = mysql.createConnection(
    dbInfo
  );

  // Connect to the Database
  connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId);
  });

  // Read Database
  connection.query('SELECT DISTINCT lastname, firstname FROM letters ORDER BY lastname, firstname ASC', function(err, response){
    if(err) throw err;

    // Export to CLient Side
    res.json(response);

    // Disconnect from MySQL
    connection.end();
  });

});



// ----------------------------------------------------
// Export routes
module.exports = apiRouter;