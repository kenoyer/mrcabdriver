var _ = require('lodash');

var FLOAT_PRECISION = 9;

//Google Maps API format
exports.locationToString = function (location) {
    return location[0].toPrecision(FLOAT_PRECISION) + ',' + location[1].toPrecision(FLOAT_PRECISION);
};

//geolib format
exports.locationToObject = function (location) {
    return {
        latitude: location[0],
        longitude: location[1]
    };
};

exports.getRandomLocation = function () {
    //todo: use circle-based or street-based approach instead of getting random points within rectangle
    var MIN_LAT = 53.833875;
    var MAX_LAT = 53.968592;
    var MIN_LONG = 27.406833;
    var MAX_LONG = 27.689044;

    return [
        _.random(MIN_LAT, MAX_LAT),
        _.random(MIN_LONG, MAX_LONG)
    ];
};