var config = require('./config');
var request = require('request');
var geolib = require('geolib');
var locationUtils = require('./locationUtils');
var url = require('url');

var taxiCarsApiUrl = url.format(config.taxiCarsApi);

var carVelocity = config.carVelocity; //km/h

function Car(carId) {
    this.id = carId;
    this.onRoute = false;
    this.location = locationUtils.getRandomLocation();
}

Car.prototype.setRoute = function (latLongs) {
    var self = this;

    self.onRoute = true;
    self.route = latLongs;
    self.location = latLongs[0];
    self.routeIndex = 0;
    self.segmentTravelledDistance = 0;

    var data = {
        carId: self.id,
        route: JSON.stringify(latLongs)
    };

    request
        .post(taxiCarsApiUrl + 'set-route', { form: data }, function (err, httpResponse, body) {
            if (err) {
                console.log(' >> set-route failed for car ' + self.id);
                console.log(err);
                return;
            }
            var response = JSON.parse(body);
            if (response.status !== 'ok') {
                console.log(' >> set route for car ' + self.id + ', but response was: ' + response.status);
            }
        });
};

Car.prototype.sendLocationUpdate = function () {
    var self = this;

    var data = {
        carId: self.id,
        lat: self.location[0].toString(),
        long: self.location[1].toString()
    };

    request
        .post(taxiCarsApiUrl + 'update-location', { form: data }, function (err, httpResponse, body) {
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

    var travelledDistance = 1000 * carVelocity * (timeElapsed / 3600.0);

    self.segmentTravelledDistance += travelledDistance;

    if (self.segmentTravelledDistance > segmentLength) {
        self.location = endPoint;
        self.segmentTravelledDistance = 0;
        if (self.routeIndex + 2 == self.route.length) { //no more segments in the route
            self.onRoute = false;
        }else{
            ++self.routeIndex;
        }
    }

};

module.exports = Car;