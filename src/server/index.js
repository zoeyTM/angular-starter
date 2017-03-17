const express       = require('express'),
      bodyParser    = require('body-parser'),
      path          = require('path'),
      logger        = require('morgan'),
      mongoose      = require('mongoose');

const PORT = process.env.PORT || 8000,
      app  = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// public folder
app.use(express.static(path.join(__dirname, '../client')));

mongoose.Promise = Promise;
mongoose.set('debug', true);
// configure this to your local db
mongoose.connect('mongodb://localhost:27017/appname');
mongoose.connection.once('open', () => {
	console.log('Mongoose connection successful');
});

// Add API routes below here


// Add API routes above here

// Default "catch-all" route to serve index.html
require('./routes/get/default')(app);

app.listen(PORT, () => {
	console.log('listening on port:', PORT);
});