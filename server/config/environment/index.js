'use strict';

var path = require('path');
var _ = require('lodash');

var defaultConfig = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    seedDB: false,

    secrets: {
        session: 'mrcabdriver-secret'
    },

    userRoles: ['guest', 'user', 'admin'],

    mongo: {
        options: {
            db: {
                safe: true
            }
        }
  }
};

module.exports = _.merge(
    defaultConfig,
    require('./' + process.env.NODE_ENV + '.js') || {});
