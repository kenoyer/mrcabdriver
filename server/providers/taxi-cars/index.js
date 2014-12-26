'use strict';

var _ = require('lodash');
var redis = require('redis');
var geohash = require('ngeohash');
var config = require('../../config/environment');

var redisClient = redis.createClient(config.redis.port, config.redis.host);

var LOCATION_KEY = 'carLocations';
var BIT_DEPTH = 52;
var LN_2 = Math.log(2);

function getBitDepthForRadius(radius) {
    //precision in meters corresponding to the 16-bit geohash
    var RADIUS_16_BITS = 156544.7188;

    //search radius cannot be wider than ~156km
    if (radius > RADIUS_16_BITS) {
        return 16;
    }

    //if it's not, get the required bit depth based on the known value for 16 bits
    return 16 + 2 * Math.floor(Math.log(RADIUS_16_BITS/radius)/LN_2);
}

/*
    Finds cars within radius around location.
    Currently does not handle geohash edge cases like the -180 meridian or places close to the Earth poles.
 */
exports.findNearbyCars = function (location, radius, callback) {
    var bitDepth = getBitDepthForRadius(radius);

    var boundingBoxGeoHash = geohash.encode_int(location.latitude, location.longitude, bitDepth);

    var searchRange = [boundingBoxGeoHash, boundingBoxGeoHash+1];

    searchRange = _.map(searchRange, function(x) {
        // << operator can't be used here as it converts Numbers to 32-bit representation instead of 52
        return x * Math.pow(2, BIT_DEPTH - bitDepth);
    });

    redisClient.zrangebyscore(_.flatten([LOCATION_KEY, searchRange, 'WITHSCORES']), function (err, response) {
        if (err) {
            callback(err);
            return;
        }

        var result = [];

        if (response.length) {
            //Response comes as [carId,geohash,carId,geohash,...]
            var splitResponse = _.groupBy(response, function (x, index) {
                return index % 2 === 0;
            });
            var groupedByItem = _.zip(splitResponse[true], splitResponse[false]);

            result = _.map(groupedByItem, function (item) {
                var location = geohash.decode_int(item[1]);
                return {
                    carId: item[0],
                    location: {
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                }
            });
        }

        callback(null, result);
    });
};

exports.updateCarLocation = function (carId, newLocation, callback) {
    var intGeoHash = geohash.encode_int(newLocation.latitude, newLocation.longitude);

    //todo: add expiration to the locations
    redisClient.zadd([LOCATION_KEY, intGeoHash, carId], function (err, response) {
        callback(err);
    });
};