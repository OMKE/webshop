(function (angular) {
    angular.module("app")
    .directive('mainDirective', function () {
        return {
            restrict: 'E',
            templateUrl: "/app/components/main_directive/main_directive.tpl.html",
        };

    });
})(angular);