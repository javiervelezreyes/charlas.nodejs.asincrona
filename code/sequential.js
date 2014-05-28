var fs = require ('fs');

var Reader = function () {

	'use strict';

	var read = function (file) {

		return fs.readFileSync (file, 'utf-8');
	};

	var count = function (stream) {

		var results = {};
		for (var index = 0; index < stream.length; index++) {
			var chr = stream[index];
			if (!(chr in results)) results[chr] = 0;
			results[chr] ++;
		}
		return results;
	};

	var add = function (results) {

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
		return totals;
	};

	return {

		process: function (files) {

			var results = [];
			for (var index = 0; index < files.length; index++) {
				var file    = files[index];
				var content = read (file);
				var result  = count (content);
				results.push (result);
			}
			var totals = add (results);
			return totals;
		}
	};
};

var myReader = Reader ();
var totals   = myReader.process (['files/file1.txt',
								  'files/file2.txt',
								  'files/file3.txt' ]);
console.log ('Totals:', totals);
