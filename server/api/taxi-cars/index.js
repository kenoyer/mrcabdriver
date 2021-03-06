'use strict';

var express = require('express');
var controller = require('./taxi-cars.controller');

var router = express.Router();

router.get('/find-nearby', controller.findNearby);
router.post('/update-location', controller.updateLocation);
router.post('/set-route', controller.setRoute);

module.exports = router;