'use strict';

var url = require('url');

var redisCloudUrl = url.parse(process.env.REDISCLOUD_URL);

module.exports = {
    mongo: {
        uri: process.env.MONGOHQ_URL
    },
    redis: {
        port: redisCloudUrl.port,
        host: redisCloudUrl.hostname
    },
    seedDB: true
};