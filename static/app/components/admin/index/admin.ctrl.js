(function (angular) {
    angular.module("app").controller("AdminCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", "$timeout", function ($stateParams, $http, $state, $rootScope, $location, $timeout) {
        
        let that = this;
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        


        
        
    
        
        

        
        

        

    }]);
})(angular);