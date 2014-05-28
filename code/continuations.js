var fs = require ('fs');

var Reader = function () {

	'use strict';

	var read = function (file, callback) {

		fs.readFile (file, 'utf-8', callback);
	};

	var count = function (stream, callback) {

		var results = {};
		for (var index = 0; index < stream.length; index++) {
			var chr = stream[index];
			if (!(chr in results)) results[chr] = 0;
			results[chr] ++;
		}
		callback (null, results);
	};

	var add = function (results, callback) {

		var totals = {};
		for (var index = 0; index < results.length; index++) {
			var result = results[index];
			for (var key in result) {
				if (result.hasOwnProperty (key)) {
					if (!(key in totals)) totals[key] = 0;
					totals[key] += result[key];
				}
			}
		}
		callback (null, totals);
	};

	return {

		process: function (files, callback) {

			var pending = files.length;
			var results = [];
			for (var index = 0; index < files.length; index++) {
				var file = files[index];
				read (file, function (error, content) {
					if (content) { 
						count (content, function (error, result) {
							pending --;
							results.push (result);
							if (pending === 0) {
								add (results, callback);
							}
						});
					}
				});
			}
		}
	};
};

var myReader = Reader ();
myReader.process (['files/file1.txt',
				   'files/file2.txt',
				   'files/file3.txt' ], function (error, totals) {

						console.log ('Totals:', totals);
				 });
