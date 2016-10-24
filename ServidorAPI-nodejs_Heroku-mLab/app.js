var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require("method-override");
var app = express();

// Connection to DB
	//mLab:   mongodb://<dbuser>:<dbpassword>@ds031167.mlab.com:31167/api-sonido-demo
	//local: mongodb://localhost/logs


mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds031167.mlab.com:31167/api-sonido-demo', function(err, res) {
 if(err) throw err;
 console.log('Connected to Database');
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
app.use(methodOverride());

// Import Models and Controllers
var models = require('./models/log')(app, mongoose);
var ClientCtrl = require('./controllers/log');

var router = express.Router();

// Index - Route
router.get('/', function(req, res) { 
 res.send("Hola Mundo");
});

app.use(router);
// API routes
var api = express.Router();

api.route('/logs') 
 .get(ClientCtrl.findAll)

api.route('/logs/:id') 
 .get(ClientCtrl.findById)

api.route('/insert')
 .get(ClientCtrl.add);

app.use('/api', api);

// Start server
app.listen(process.env.PORT || 3000, function() {
 console.log("it's alive!!! (^_^)/");
});