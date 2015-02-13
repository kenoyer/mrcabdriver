angular.module('cab')
    .directive('authentication', [function() {
        return {
            restrict: "E",
            templateUrl: 'app/shared/directives/authentication/authentication.html',
            scope: {
                page: '=',
                login: '=',
                register: '='
            },
            replace: true,
            link: function (scope, element, attrs) {
                console.log(attrs);
                console.log(scope);
            },
            controller: ['$scope', function ($scope) {
                console.log($scope);
                $scope.signInClick = function () {
                    $scope.page = 'login';
                };
                $scope.signUpClick = function () {
                    $scope.page = 'register';
                };
            }]
        };
    }]);