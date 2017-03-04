// Node Dependencies for Express
var express = require('express');
var resourceRouter = express.Router();

// Node Dependencies for AWS
var aws = require('aws-sdk');

// Set to AWS "Anyone" permissions group => Read Only access to S3
aws.config.update({
    accessKeyId: "AKIAJBLISXXXKJHKIDFQ",
    secretAccessKey: "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",
});

// Create New S3 Connection
var s3 = new aws.S3();



// GET - the Letter content from the .TXT file in Resources
resourceRouter.get('/resources/letters/:letterName', function (req, res) {

  // Get File Name
  var fileName = req.params.letterName;

  // Use the Filename to create the link to the "transcript" folder in the "kean-wwii-scrapbook" bucket
  var awsTextFileKey = 'transcripts/' + fileName + '.txt';
  var params = {
    Bucket: 'kean-wwii-scrapbook',
    Key: awsTextFileKey
  }

  // Get back the text from the .txt file in AWS S3
  s3.getObject(params, function(err, data) {

    // If there was an error (file was not found or not read)
    if (err) {

      // Log error
      console.log(err, err.stack);
      // Respond to DOM with Error
      res.json("Transcript not available at this time.");

    }
    // Otherwise, it was a succes
    else{

      // Get .txt file's text
      var fileText = data.Body.toString();
      // Respond with Letter Text
      res.json(fileText);

    } 

  });

});


// ----------------------------------------------------
// Export routes
module.exports = resourceRouter;
