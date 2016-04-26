/*jslint node: true */
'use strict';

module.exports = function (app, db) {


	app.route('/:url')
		.get(checkIfExisting);

	app.get('/new/:url*', createNewShortUrl);

	function checkIfExisting(req, res){
		var url = process.env.BASE_URL + req.params.url;
		if( url != process.env.BASE_URL + 'favicon.ico') {
			findLink(url, db, res);
		}
	}

	function createLinkHash(url){
		var hash = 0, 
			i, 
			character, 
			length;

		if (url.length === 0) return hash;

		for (i = 0, length = url.length; i < length; i++) {
			character   = url.charCodeAt(i);
			hash  = ((hash << 5) - hash) + character;
			hash |= 0;
		}
		return hash;
	}

	function createNewShortUrl(req, res){
		var url = req.url.slice(5);
		var urlsJson = {};

		if(validLink(url)){
			urlsJson = {
				"original_url" : url,
				"short_url" : process.env.BASE_URL + createLinkHash(url)
			};
		res.send(urlsJson);
		saveLink(urlsJson, db);
		} else {
			urlsJson = { "error" : "Bad url format.  You must have a protocol and site" };
			res.send(urlsJson);
		}
	}

	function findLink(link, db, res){
		var links = db.collection('links');
		links.findOne({ "short_url" : link }, function(err, result){
			if(err) throw err;
			if(result){
				res.redirect(result.original_url);
			} else {
				res.send({ "error" : "No record found" });
			}
		});
	}

	function saveLink(link, db){
		var links = db.collection('links');
		links.save(link, function(err, result){
			if(err) throw err;
			console.log('Saved: ' + link);
		});
	}

	function validLink(url){
		//regex courtesy of https://mathiasbynens.be/demo/url-regex, using the @mattfarina version
		var regex = /^([a-z][a-z0-9\*\-\.]*):\/\/(?:(?:(?:[\w\.\-\+!$&'\(\)*\+,;=]|%[0-9a-f]{2})+:)*(?:[\w\.\-\+%!$&'\(\)*\+,;=]|%[0-9a-f]{2})+@)?(?:(?:[a-z0-9\-\.]|%[0-9a-f]{2})+|(?:\[(?:[0-9a-f]{0,4}:)*(?:[0-9a-f]{0,4})\]))(?::[0-9]+)?(?:[\/|\?](?:[\w#!:\.\?\+=&@!$'~*,;\/\(\)\[\]\-]|%[0-9a-f]{2})*)?$/i;
		return regex.test(url);
	}
};
