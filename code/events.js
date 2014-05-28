var fs     = require ('fs');
var events = require ('events');   


var Reader = function () {

	'use strict';

	var maxFiles;
	var nFiles       = 0;  
	var blockSize    = 1024;
	var results      = {};
	var totals       = {};
	var readEmitter  = new events.EventEmitter ();
	var countEmitter = new events.EventEmitter ();
	var addEmitter   = new events.EventEmitter ();

	var read = function (file) {

		var stream = fs.createReadStream (file, {encoding:'utf8'});
		var buffer = '';
		stream.on ('data', function (data) { buffer += data; })
		stream.on ('end', function () {

			var total = buffer.length;
			var index = 0;
			var nData;
			while (index < total) {
				if (index + blockSize <= total) nData = blockSize;
				else nData = total - index;
				readEmitter.emit ('block', {
					file   : file,
					data   : buffer.slice (index, index + nData),
					length : nData,
					done   : (index + nData) === total
				});
				index = index + nData;
			}
		});
	};

	var count = function (block) {

		var file    = block.file;
		var done    = block.done;
		var data    = block.data;
		var length  = block.length;

		if (!results[file]) results[file] = {};
		for (var index = 0; index < length; index++) {
			var chr = data[index];
			if (!(chr in results[file])) results[file][chr] = 0;
			results[file][chr]++;
		}
		if (done) {		
			var result = results[file];
			countEmitter.emit ('result', result);
		}
	};

	var add = function (result) {

		for (var key in result) {
			if (result.hasOwnProperty (key)) {
				if (!(key in totals)) totals[key] = 0;
				totals[key] += result[key];
			}
		}				
		nFiles ++;

		if (nFiles === maxFiles) {
 			addEmitter.emit ('total', totals);
			totals = {};
		}
	};

	return {

		process: function (files, callback) {

			readEmitter.on ('block', count);
			countEmitter.on ('result', add);
			addEmitter.on ('total', function (totals) { 
				callback (null, totals);
			});

			maxFiles = files.length;
			for (var index = 0; index < files.length; index++) {
				var file = files[index];
				read (file);
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