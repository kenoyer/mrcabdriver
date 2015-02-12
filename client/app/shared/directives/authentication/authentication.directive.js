angular.module('cab')
    .directive('authentication', [function() {
        return {
            restrict: "E",
            templateUrl: 'app/shared/directives/authentication/authentication.html',
            scope: {
                page: '@'
            },
            replace: true,
            link: function (scope, element, attrs) {

            },
            controller: ['$scope', function ($scope) {
                $scope.signInClick = function () {
                    $scope.page = 'login';
                };
                $scope.signUpClick = function () {
                    $scope.page = 'register';
                };
            }]
        };
    }]);