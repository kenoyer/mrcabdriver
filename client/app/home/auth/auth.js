'use strict';

angular.module('cab')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.login', {
            url: 'login',
            templateUrl: 'app/home/auth/auth.html',
            controller: 'AuthController',
            data: {
                page: 'login'
            }
        }).state('home.register', {
            url: 'register',
            templateUrl: 'app/home/auth/auth.html',
            controller: 'AuthController',
            data: {
                page: 'register'
            }
        });
    }]
);