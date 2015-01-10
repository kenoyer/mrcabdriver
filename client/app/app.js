'use strict';

angular.module('cab', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap'
])
.constant('CONFIG', {
    'debug': false,
    'searchRadius': 4000,
    'mapZoom': 12
})
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
            $urlRouterProvider.otherwise('/');

            $locationProvider.html5Mode(true);
        }]
);