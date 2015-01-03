'use strict';

var module = angular.module('cab');
module.factory('taxiCars', ['$http', 'geoLocation', '$q', function ($http, geoLocation, $q) {

    //todo: investigate where should this url be placed?
    var url = '/api/taxi-cars/find-nearby';

    function findCars (location, deferred) {
        $http.get(url, {
            params: {
                lat: location.latitude,
                long: location.longitude
            }
        }).success(function (data) {
            if (data.status === 'ok') {
                deferred.resolve(data.cars);
            }else{
                deferred.reject();
            }
        }).error(function () {
            deferred.reject();
        });
    }

    function findNearby (location) {
        var deferred = $q.defer();

        if (!location) {
            geoLocation.get().then(function (location) {
                findCars(location, deferred);
            });
        }else{
            findCars(location, deferred);
        }

        return deferred.promise;
    }

    return {
        findNearby: findNearby
    };
}]);