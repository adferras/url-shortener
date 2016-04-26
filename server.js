/*jslint node: true */
'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var api = require('./app/api/url-shortener.js');
var mongo = require('mongodb');
var session = require('express-session');
var app = express();
var path = require('path');
app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/public'));
require('dotenv').config({silent: true});

mongo.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener', function(err, db) {

	if (err) {
		throw new Error('Database connection error!');
	} else {
		console.log('Connected to MongoDB on port 27017.');
	}

	db.createCollection("links", {
		capped: true,
		size: 2097152,
		max: 1000
	});


	routes(app);
	api(app);

	var port = process.env.PORT || 8080;
	app.listen(port,  function () {
		console.log('Node.js listening on port ' + port + '...');
	});
});
