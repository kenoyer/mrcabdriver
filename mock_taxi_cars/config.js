'use strict';

module.exports = {
    carsCount: 30,
    carVelocity: 60, //km/h
    updateInterval: 1, //seconds
    taxiCarsApi: {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/api/taxi-cars/'
    }
};