'use strict';

var config = require('./config');

var _ = require('lodash');
var redis = require('redis'); //todo: exclude redis, use API
var geolib = require('geolib');
var maps = require('googlemaps');
var polyline = require('polyline-encoded');
var querystring = require('querystring');
var http = require('http');

var LOCATION_KEY = 'carLocations';
var UPDATE_INTERVAL = 5; //seconds
var DEFAULT_CARS_COUNT = 50;
var CAR_VELOCITY = 40; //km/h

var redisClient = redis.createClient(config.redis.port, config.redis.host);

var carsCount = parseInt(process.argv[2]) || DEFAULT_CARS_COUNT;
var cars = [];

function Car(carId) {
    this.id = carId;
    this.onRoute = false;
    this.location = getRandomLocation();
}
Car.prototype.sendLocationUpdate = function () {
    var data = querystring.stringify({
        carId: this.id,
        lat: this.location[0].toString(),
        long: this.location[1].toString()
    });
    var options = {
        host: config.taxiCarsApi.host,
        port: config.taxiCarsApi.port,
        path: config.taxiCarsApi.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var req = http.request(options);
    req.write(data);
    req.end();

    //todo: refactor; check response
};
Car.prototype.setRoute = function (latLongs) {
    this.onRoute = true;
    this.route = latLongs;
    this.location = latLongs[0];
    this.routeIndex = 0;
};
Car.prototype.advanceLocation = function (timeElapsed) {
    timeElapsed = timeElapsed || UPDATE_INTERVAL;
    var self = this;
    if (!self.onRoute) {
        throw new Error('Cannot advance car which is not on route.')
    }

    var startPoint = self.route[self.routeIndex];
    var endPoint = self.route[self.routeIndex+1];
    var segmentLength = geolib.getDistance(locationToObject(startPoint), locationToObject(endPoint)); //meters

    var travelledDistance = 1000 * CAR_VELOCITY * (timeElapsed / 3600.0);

    var relativeTravelledDistance = travelledDistance / segmentLength;

    var newLocation = [
        self.location[0] + (endPoint[0] - startPoint[0])*relativeTravelledDistance,
        self.location[1] + (endPoint[1] - startPoint[1])*relativeTravelledDistance
    ];

    if (newLocation[0] <= endPoint[0] && newLocation[1] <= endPoint[1]) {
        self.location = newLocation;
    }else{
        self.location = endPoint;
        if (self.routeIndex+2 == self.route.length) { //no more segments in the route
            self.onRoute = false;
        }else{
            ++self.routeIndex;
        }
    }
};

for (var i=0; i<carsCount; ++i) {
    cars.push(new Car(i+1));
}

maps.config({
    'encode-polylines': false
});

console.log('Started imitation of ' + carsCount + ' taxi cars');

setInterval(performUpdate, UPDATE_INTERVAL * 1000);

function performUpdate() {
    _.forEach(cars, function(car) {
        if (car.onRoute) {
            car.advanceLocation();
        }else{
            var startPoint = getRandomLocation();
            var endPoint = getRandomLocation();

            maps.directions(locationToString(startPoint), locationToString(endPoint), function (err, result) {
                if (err) {
                    return;
                }
                if (!result || !result.routes[0] || result.routes[0].overview_polyline.points.length<2) {
                    return;
                }

                var latLongs = polyline.decode(result.routes[0].overview_polyline.points);


                car.setRoute(latLongs);

            });

        }

        car.sendLocationUpdate();
    });
}

function locationToString(location) {
    return location[0].toPrecision(9)+','+location[1].toPrecision(9);
}

function locationToObject(location) {
    return {
        latitude: location[0],
        longitude: location[1]
    };
}

function getRandomLocation() {
    var MIN_LAT = 53.833875;
    var MAX_LAT = 53.968592;
    var MIN_LONG = 27.406833;
    var MAX_LONG = 27.689044;

    return [
        _.random(MIN_LAT, MAX_LAT),
        _.random(MIN_LONG, MAX_LONG)
    ];

}