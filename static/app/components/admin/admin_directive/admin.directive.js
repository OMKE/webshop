(function (angular) {
    angular.module("app")
    .directive('adminDirective', function () {
        return {
            restrict: 'E',
            templateUrl: "/app/components/admin/admin_directive/admin.dir.html",
        };

    });
})(angular);