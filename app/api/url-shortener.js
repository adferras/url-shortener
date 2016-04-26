/*jslint node: true */
'use strict';

module.exports = function (app, db) {

	app.route('/:url')
		.get(checkIfExisting);

	app.get('/new/:url*', createNewShortUrl);

	function checkIfExisting(req, res){
    var url = process.env.BASE_URL + req.params.url;
    console.log('Searching for url: ' + url);
    findLink(url, db, res);
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
		//regex courtesy of https://gist.github.com/dperini/729294
    var regex = new RegExp(
        "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
        // TLD may end with dot
        "\\.?" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
        "$", "i"
        );
		return regex.test(url);
	}
};
