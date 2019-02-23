(function (angular) {
    angular.module("app").controller("UserCtrl", ["$http", "$rootScope", "$state", function ($http, $rootScope, $state) {
        let that = this;
        this.loggedUser = $rootScope.user;
        

        

        

        // console.log(this.loggedUser);
    }]);
})(angular);