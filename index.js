'use strict';

var uuidGen = require('node-uuid');
var async = require('async');

var sampleSize = 10000000; // 10 million
var buckets = 1000;

var results = {};

function cleanse(uuid) {
    // cleanser to remove any non-alphanumeric and dash chars preventing xss
    if (!uuid.match(/^[a-zA-Z0-9-]+$/)) {
        uuid = uuid.replace(/[^a-z0-9-]/gi, '');
    }
    return uuid;
}

function parse(/*str*/uuid) {
    var code = [],
        a = -1;
    while (++a < uuid.length) {
        isNaN(uuid[a]) ? code.push(uuid.charCodeAt(a)) : code.push(uuid[a]);
    }
    return code.join('');
}

function findModulo(/*number*/uuidParse) {
    return uuidParse % buckets;
}

function placeInBucket(modulo) {
    if (!results[modulo]) {
        results[modulo] = 0;
    }

    results[modulo] += 1;
}

function progressReport(count, sampleSize, iterationSlice) {
    if (count % (sampleSize / iterationSlice) === 0) {
        console.log((count / sampleSize * 100).toFixed(2) + '%');
    }
}

function statisticsReport() {
    console.log(results);
}

function main() {
    var count = 0;

    async.whilst(function() {
        return count < sampleSize;
    }, function(callback) {
        setImmediate(function() {
            count++;
            placeInBucket(findModulo(parse(cleanse(uuidGen.v4()))));
            progressReport(count, sampleSize, 10);
            callback();
        });
    }, function(err) {
        if (err) {
            console.error(err);
        } else {
            statisticsReport();
        }

    });
}

main();