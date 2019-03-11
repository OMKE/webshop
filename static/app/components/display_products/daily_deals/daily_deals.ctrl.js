(function (angular) {
    angular.module("app").controller("DailyDealsCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", "$timeout", function ($stateParams, $http, $state, $rootScope, $location, $timeout) {
        
        let that = this;
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port

        this.products = [];
        
        this.getDailyDeals = function () {
            $http.get("/api/daily_deals").then(function (response) {
                that.products = response.data;
            }, function (response) {
                console.log(response.status);
            });
        };
        
        this.getDailyDeals();
        
        

        
        

        

    }]);
})(angular);