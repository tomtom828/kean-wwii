// Controllers for reading txt files from S3

// Node Dependencies for Express
var express = require('express');
var s3Router = express.Router();

// Node Dependencies for AWS
var aws = require('aws-sdk');

// Set to AWS "Anyone" permissions group => Read Only access to S3 files
aws.config.update({
    accessKeyId: "AKIAJBLISXXXKJHKIDFQ",
    secretAccessKey: "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",
});

// Create New S3 Connection
var s3 = new aws.S3();

// Refer to the following Stack Overflow Link for reading txt files from AWS S3
// http://stackoverflow.com/questions/27299139/read-file-from-aws-s3-bucket-using-node-fs



// GET - the Letter content from the .TXT file in Resources
s3Router.get('/resources/letters/:letterName', function (req, res) {

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
      // Clean up broken UTF-8 encoding characters (the black <?> mark diamond)
      fileText = fileText.replace(/[\u0100-\uFFFF]/g,'\'');
      // Respond with Letter Text
      res.json(fileText);

    }

  });

});



// BACKEND - Function to Query AWS for TXT file from within other routes
function getS3Text(fileName, _callback) {

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
      // console.log(err, err.stack);
      // Respond to DOM with Error
      var fileText = "Transcript not available at this time.";
      return _callback(fileText);

    }
    // Otherwise, it was a succes
    else{

      // Get .txt file's text
      var fileText = data.Body.toString();
      // Clean up broken UTF-8 encoding characters (the black <?> mark diamond)
      fileText = fileText.replace(/[\u0100-\uFFFF]/g,'\'');
      // Respond with Letter Text
      return _callback(fileText);

    }

  });

}


// ----------------------------------------------------
// Export router
module.exports.s3Router = s3Router;

// Export backend function
module.exports.getS3Text = getS3Text;
