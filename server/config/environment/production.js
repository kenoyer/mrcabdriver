'use strict';

module.exports = {
  // Server IP todo: investigate
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port todo: investigate
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

    mongo: {
        uri: process.env.MONGOHQ_URL
    },
    redis: {
        uri: process.env.REDISCLOUD_URL
    },
    seedDB: true
};