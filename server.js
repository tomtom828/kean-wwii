// Node Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');


// Set up Express App
var app = express();
var PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


// Handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



// Server Routing Map 
// ============================================================

// Serve Static elements
app.use(express.static('public'));

// Import DOM controller
var domRouter = require('./controllers/dom-controllers.js');
app.use('/', domRouter);

// Import API controller
var apiRouter = require('./controllers/api-controllers.js');
app.use('/', apiRouter);

// Import S3 (for .txt files) controller
var s3Router = require('./controllers/s3-controllers.js');
app.use('/', s3Router);

// Catch all (404 route) - MUST BE THE LAST ONE LISTED
app.get('*', function (req, res){
  res.render('404');
});

// ============================================================



// Listener - Start the server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});