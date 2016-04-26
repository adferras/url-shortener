/*jslint node: true */
'use strict';

var path = require('path');

module.exports = function (app) {

	app.route('/')
		.get(function (req, res) {
			res.sendFile('index.html');
		});

	app.route('/new')
		.get(function (req, res) {
			res.sendFile('error.html', { root: './view' });
		});
};
