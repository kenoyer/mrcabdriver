'use strict';

module.exports = {
    redis: {
        port: '6379',
        host: 'localhost',
        key: 'carLocations'
    },
    taxiCarsApi: {
        host: 'localhost',
        port: '9000',
        path: '/api/taxi-cars/update-location'
    }
};