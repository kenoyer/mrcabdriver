'use strict';

module.exports = {
    carsCount: 50,
    updateInterval: 5, //seconds
    taxiCarsApi: {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/api/taxi-cars/update-location'
    }
};