// Node Dependencies
var express = require('express');
var resourceRouter = express.Router();
var fs = require('fs');
var path = require('path');


// Get the Letter content from the .TXT file in Resources
resourceRouter.get('/resources/letters/:letterName', function (req, res) {

  // Get File Name
  var fileName = req.params.letterName.replace(/\+/g, " ");

  // Get Full Path to file
  var fileLocation = '../resources/letter-text/' + fileName + '.txt';
  var fullPath = path.join(__dirname, fileLocation);

  // Read File from Resources Folder
  var fileText;
  try {
    // Respond with Letter Text
    fileText = fs.readFileSync(fullPath).toString();
    res.json(fileText);
  } catch (err) {
    // Respond with Error
    res.json("File Not Found.");
  }

});


// ----------------------------------------------------
// Export routes
module.exports = resourceRouter;
