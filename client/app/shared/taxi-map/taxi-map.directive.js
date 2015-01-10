angular.module('cab')
    .directive('taxiMap', ['geoLocation', 'taxiCars', '$interval', 'CONFIG', function (geoLocation, taxiCars, $interval, config) {
        return {
            restrict: 'EA',
            templateUrl: 'app/shared/taxi-map/taxi-map.html',
            scrope: {},
            replace: true,
            link: function (scrope, element, attrs) {
                if (!google && !google.maps && !google.maps.Map) {
                    //todo: show some error message when Google API is not loaded
                    return;
                }

                geoLocation.get().then(function (location) {

                    var locationLatLng = new google.maps.LatLng(location.latitude, location.longitude);

                    var map = new google.maps.Map(element[0], {
                        center: locationLatLng,
                        zoom: config.mapZoom,
                        disableDefaultUI: true,
                        zoomControl: true,
                        //todo: set Custom Styles too
                    });

                    var locationMarker = new google.maps.Marker({
                        position: locationLatLng,
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 2
                        },
                        map: map
                    });

                    var radiusCircle = new google.maps.Circle({
                        map: map,
                        center: locationLatLng,
                        radius: config.searchRadius,
                        strokeColor: '#005500',
                        strokeOpacity: 0.65,
                        strokeWeight: 2,
                        fillColor: '#33ee33',
                        fillOpacity: 0.25
                    });

                    var markers = {};
                    var routes = {};

                    $interval(function () {

                        var carIds = [];

                        taxiCars.findNearby(location).then(function (cars) {
                            cars.forEach(function (car) {
                                if (markers[car.carId]) {
                                    markers[car.carId].setPosition({
                                        lat: car.location.latitude,
                                        lng: car.location.longitude
                                    });
                                }else {
                                    var marker = new google.maps.Marker({
                                        position: {
                                            lat: car.location.latitude,
                                            lng: car.location.longitude
                                        },
                                        title: car.carId,
                                        map: map
                                    });
                                    markers[car.carId] = marker;
                                }

                                //visualize route info for debugging (when available)
                                if (config.debug && car.route) {
                                    var polylinePath = _.map(car.route, function(routePoint) {
                                        return new google.maps.LatLng(routePoint[0], routePoint[1]);
                                    });

                                    if (!routes[car.carId]) {
                                        var polyline = new google.maps.Polyline({
                                            geodesic: true,
                                            strokeColor: chance.color(),
                                            strokeOpacity: 1.0,
                                            strokeWeight: 3,
                                            path: polylinePath
                                        });
                                        polyline.setMap(map);
                                        routes[car.carId] = polyline;
                                    }
                                }

                                carIds.push(car.carId);
                            });

                            //clear unused markers
                            for (var i in markers) {
                                if (markers.hasOwnProperty(i)) {
                                    if (carIds.indexOf(i) == -1) {
                                        markers[i].setMap(null);
                                        delete markers[i];
                                    }
                                }
                            }

                        });


                    }, 2000);


                });
            }
        }
    }]);