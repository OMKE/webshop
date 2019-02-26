(function (angular) {
    angular.module("app").controller("UserCtrl", ["$http", "$rootScope", "$state", "$location", function ($http, $rootScope, $state, $location) {
        let that = this;
        this.loggedUser = $rootScope.user;
        
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        

        

        // console.log(this.loggedUser);
    }]);
})(angular);