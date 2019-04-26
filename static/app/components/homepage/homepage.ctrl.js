(function (angular) {
    angular.module("app").controller("HomepageCtrl", ["$stateParams", "$http", "$rootScope", "$state", "$timeout", "$location" ,function ($stateParams, $http, $rootScope, $state, $timeout, $location) {
        let that = this;
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        this.products = []
        this.popular_categories = [];
        

        this.getPopularCategories = function () {
            $http.get("/api/categories/popular").then(function (response) {
                that.popular_categories = response.data;
            }, function (response) {
                
            });
        };

        this.getPopularCategories();
        
        
        // this.getProducts = function () {
        //     $http.get("/api/products").then(function (response) {
        //         that.products = response.data;
        //     }, function (response) {
                
        //     })
        // }

        
        
        
        
        

        

        
        
    }]);
})(angular);