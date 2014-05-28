var fs = require ('fs');
var co = require ('co');

var Reader = function () {

    'use strict';

    var read = function (file) {

        return function (callback) {

            fs.readFile (file, 'utf-8', callback);
        };
    };

    var count = function (stream) {

        return function (callback) {

            var results = {};
            for (var index = 0; index < stream.length; index++) {
                var chr = stream[index];
                if (!(chr in results)) results[chr] = 0;
                results[chr] ++;
            }
            callback (null, results);
        };
    };

    var add = function (results) {

        return function (callback) {

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
    };

    return {

        process: function (files, callback) {


            function* processFile (file) {
                var content = yield read (file);
                var result  = yield count (content);
                return result;
            }
 
            co (function* () {

                var results = [];
                for (var index = 0; index < files.length; index ++) {
                    var file   = files[index];
                    var result = processFile (file)
                    results.push (result);
                }
                var partials = yield results;
                var totals   = yield add (partials); 
                callback (null, totals);
            })();
        }
    };
};

var myReader = Reader ();
myReader.process ([ 'files/file1.txt',
                    'files/file2.txt',
                    'files/file3.txt' ], function (error, totals) {
                        console.log ('Totals:', totals);
                    });

