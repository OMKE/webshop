(function (angular) {
    angular.module("app").controller("UserCtrl", ["$http", "$rootScope", function ($http, $rootScope) {
        let that = this;
        this.loggedUser = $rootScope.user;
        

        

        // console.log(this.loggedUser);
    }]);
})(angular);