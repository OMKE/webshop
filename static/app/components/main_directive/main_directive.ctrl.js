(function (angular) {
    angular.module("app")
    .directive('mainDirective', function () {
        return {
            restrict: 'E',
            templateUrl: "/app/components/main_directive/main.tpl.html",
        };

    });
})(angular);