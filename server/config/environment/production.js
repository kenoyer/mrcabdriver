'use strict';

module.exports = {
    mongo: {
        uri: process.env.MONGOHQ_URL
    },
    redis: {
        uri: process.env.REDISCLOUD_URL
    },
    seedDB: true
};