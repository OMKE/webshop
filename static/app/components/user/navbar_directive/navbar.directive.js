(function (angular) {
    angular.module("app")
    .directive('userNavbar', function () {
        return {
            restrict: 'E',
            templateUrl: "/app/components/user/navbar_directive/navbar.tpl.html",
        };

    });
})(angular);