'use strict';

var uuidGen = require('node-uuid');

var iterations = 10000000; // 10 million
var results = {
    'bucket1': [],
    'bucket2': [],
    'bucket3': [],
    'bucket4': [],
    'bucket5': []
};

/* Purely a security concern function */
function cleanse(uuid) {
    // cleanser to remove any non-alphanumeric and dash chars preventing xss
    if (!uuid.match(/^[a-zA-Z0-9-]+$/)) {
        uuid = uuid.replace(/[^a-z0-9-]/gi, '');
    }
    return uuid;
}

/* strips the uuid to only numbers. Worth looking at. */
function parse(/*str*/uuid) {
    var code = [],
        a = -1;
    while (++a < uuid.length) {
        isNaN(uuid[a]) ? code.push(uuid.charCodeAt(a)) : code.push(uuid[a]);
    }
    return code.join('');
}

function findModulo(/*number*/uuidParse) {
    return uuidParse % 1000;
}

function placeInBucket(uuid, modulo) {
    if (modulo <= 200) {
        results['bucket1'].push(uuid);
    } else if (modulo > 200 && modulo <= 400) {
        results['bucket2'].push(uuid);
    } else if (modulo > 400 && modulo <= 600) {
        results['bucket3'].push(uuid);
    } else if (modulo > 600 && modulo <= 800) {
        results['bucket4'].push(uuid);
    } else {
        results['bucket5'].push(uuid);
    }
}

for (var i = 0; i < iterations; i++) {
    var uuid = uuidGen.v4(),
        cleansed = cleanse(uuid),
        parsed = parse(cleansed),
        modulo = findModulo(parsed);

    placeInBucket(uuid, modulo);

}

console.log('bucket1:', results['bucket1'].length);
console.log('bucket2:', results['bucket2'].length);
console.log('bucket3:', results['bucket3'].length);
console.log('bucket4:', results['bucket4'].length);
console.log('bucket5:', results['bucket5'].length);
