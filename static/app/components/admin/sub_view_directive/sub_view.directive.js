(function (angular) {
    angular.module("app")
    .directive('subViewDirective', function () {
        return {
            restrict: 'E',
            templateUrl: "/app/components/admin/sub_view_directive/sub_view.dir.html",
        };

    });
})(angular);