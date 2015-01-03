'use strict';

var module = angular.module('cab');

module.factory('geoLocation', ['$q', '$window', function ($q, $window) {
    var defaultLocation = {
        latitude: 53.901490,
        longitude: 27.555492
    };

    function isSupported() {
        return 'geolocation' in $window.navigator;
    };

    var getLocation = function (callback) {
        var deferred = $q.defer();

        if (isSupported()) {
            navigator.geolocation.getCurrentPosition(function (position) {
                deferred.resolve(position.coords);
            });
        }else{
            deferred.resolve(defaultLocation);
        }

        return deferred.promise;
    };

    return {
        get: getLocation
    };
}]);