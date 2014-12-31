var config = require('./config');
var request = require('request');
var geolib = require('geolib');
var locationUtils = require('./locationUtils');
var url = require('url');

var taxiCarsApiUrl = url.format(config.taxiCarsApi);

var CAR_VELOCITY = 40; //km/h

function Car(carId) {
    this.id = carId;
    this.onRoute = false;
    this.location = locationUtils.getRandomLocation();
}

Car.prototype.setRoute = function (latLongs) {
    this.onRoute = true;
    this.route = latLongs;
    this.location = latLongs[0];
    this.routeIndex = 0;
};

Car.prototype.sendLocationUpdate = function () {
    var self = this;

    var data = {
        carId: self.id,
        lat: self.location[0].toString(),
        long: self.location[1].toString()
    };

    request
        .post(taxiCarsApiUrl, { form: data }, function (err, httpResponse, body) {
            if (err) {
                console.log(' >> update failed for car ' + self.id);
                console.log(err);
                return;
            }
            var response = JSON.parse(body);
            if (response.status !== 'ok') {
                console.log(' >> updated car ' + self.id + ', but response was: ' + response.status);
            }
        });
};

Car.prototype.advanceLocation = function (timeElapsed) {
    var self = this;
    timeElapsed = timeElapsed || config.updateInterval; //seconds

    if (!self.onRoute) {
        throw new Error('Cannot advance car which is not on route.')
    }

    var startPoint = self.route[self.routeIndex];
    var endPoint = self.route[self.routeIndex+1];
    var segmentLength = geolib.getDistance(locationUtils.locationToObject(startPoint), locationUtils.locationToObject(endPoint)); //meters

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
        if (self.routeIndex + 2 == self.route.length) { //no more segments in the route
            self.onRoute = false;
        }else{
            ++self.routeIndex;
        }
    }
};

module.exports = Car;