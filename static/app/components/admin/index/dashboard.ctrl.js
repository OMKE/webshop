(function (angular) {
    angular.module("app").controller("DashboardCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", "$timeout", function ($stateParams, $http, $state, $rootScope, $location, $timeout) {
        
        let that = this;
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        
        this.checkUser = function () {
            if($state.is("admin") && $rootScope.user.admin == false){
                $state.go("home");
            }
        };
        
        angular.element(document).ready(function () {
            that.checkUser();
        });

        
        
    
        
        

        
        

        

    }]);
})(angular);