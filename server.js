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

// ============================================================




// Listener - Start the server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});