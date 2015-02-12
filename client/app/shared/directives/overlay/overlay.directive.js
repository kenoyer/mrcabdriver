angular.module('cab')
    .directive('overlay', [function() {
        return {
            restrict: "E",
            templateUrl: 'app/shared/directives/overlay/overlay.html',
            scope: {
                click: '='
            },
            replace: true,
            link: function (scope, element, attrs) {
                element.on('click', function() {
                    if (typeof scope.click === 'function') {
                        scope.click();
                    }
                })
            },
            controller: ['$scope', function ($scope) {

            }]
        };
    }]);