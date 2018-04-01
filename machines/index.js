'use strict';

const Path = require('path');

module.exports = function (machine) {
    let path = Path.join(__dirname, './', machine);
    return require(path);
}