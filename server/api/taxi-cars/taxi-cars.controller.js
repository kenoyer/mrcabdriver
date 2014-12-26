'use strict';

var _ = require('lodash');
var geolib = require('geolib');
var taxiCarsProvider = require('../../providers/taxi-cars');

//todo: get from config
var SEARCH_RADIUS = 2500;

function isValidLocation(latitude, longitude) {
    return _.isFinite(latitude) && _.isFinite(longitude) &&
            latitude>=-90 && latitude<=90 && longitude>=-180 && longitude<=180;
}

exports.findNearby = function (req, res) {
    var latitude = req.query.lat;
    var longitude = req.query.long;
    if (!isValidLocation(latitude,longitude)) {
        return res.json(400, {
            'status': 'error',
            'message': 'Incorrect location format'
        });
    }
    var origin = {
        latitude: latitude,
        longitude: longitude
    };

    taxiCarsProvider.findNearbyCars(origin, SEARCH_RADIUS, function (err, response) {
        if (err) {
            return res.json(500, {
                'status': 'error',
                'message': 'Failed to find nearby cars'
            });
        }
        res.json({
            'status': 'ok',
            'cars': _.map(response,function (item) {
                return _.merge(item, {
                    distance: geolib.getDistance(origin, item.location)
                });
            })
        });
    });
};

exports.updateLocation = function (req, res) {
    //todo: check authentication and user role
    var latitude = req.body.lat;
    var longitude = req.body.long;

    if (!isValidLocation(latitude,longitude)) {
        return res.json(400, {
            'status': 'error',
            'message': 'Incorrect location format'
        });
    }

    taxiCarsProvider.updateCarLocation(req.body.carId, {
        latitude: latitude,
        longitude: longitude
    }, function (err) {
        if (err) {
            return res.json(500, {
                'status': 'error',
                'message': 'Failed to update location'
            });
        }else{
            return res.json({
                'status': 'ok'
            });
        }
    });
};