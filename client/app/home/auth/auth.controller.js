'use strict';

angular.module('cab')
    .controller('AuthController', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
        $scope.navigateHome = function () {
            $state.go('home');
        }
        $scope.page = $state.current.data.page;
    }]
);
