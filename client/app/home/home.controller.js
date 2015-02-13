'use strict';

angular.module('cab')
    .controller('HomeController', ['$scope', function($scope) {
            $scope.data = {
                login: {},
                register: {}
            };
        }]
    );