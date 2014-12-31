'use strict';

var Car = require('./car');
var locationUtils = require('./locationUtils');
var maps = require('googlemaps');
var polyline = require('polyline-encoded');
var _ = require('lodash');
var config = require('./config');

var updateInterval = config.updateInterval;
var carsCount = config.carsCount;

var cars = [];
for (var i=0; i<carsCount; ++i) {
    cars.push(new Car(i+1));
}

console.log('Started imitation of ' + carsCount + ' taxi cars');

setInterval(performUpdate, updateInterval * 1000);

function performUpdate() {
    _.forEach(cars, function(car) {
        if (car.onRoute) {
            car.advanceLocation();
        }else{
            var startPoint = locationUtils.getRandomLocation();
            var endPoint = locationUtils.getRandomLocation();

            //Find route between two random points using Google Maps API, and assign car to this route.
            maps.directions(locationUtils.locationToString(startPoint), locationUtils.locationToString(endPoint), function (err, result) {
                //if route is invalid or too short, the car stays idle
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