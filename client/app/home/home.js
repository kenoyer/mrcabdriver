'use strict';

angular.module('cab')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'app/home/home.html'
        });
    }]
);