(function (angular) {
    angular.module("app").controller("SubCategoryCtrl", ["$stateParams", "$http", "$rootScope", "$location", function ($stateParams, $http, $rootScope, $location) {
        
        let that = this;

        this.host = "https://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port

        

        $rootScope.isSubCategory = true;

        this.products = [];

        this.getProducts = function (id) {
            if($rootScope.getByPrice.active){
                $http.get(`/api/subcategories/${id}/products/${$rootScope.getByPrice.minPrice}&${$rootScope.getByPrice.maxPrice}`).then(function (response) {
                    that.products = response.data;
                }, function (response) {
                    
                })
            } else {
                $http.get(`/api/subcategories/${id}/products`).then(function (response) {
                    that.products = response.data;
                    
                }, function (response) {
                    
                })
            }
        }

        this.getProducts($stateParams['id2']);
        
    }]);
})(angular);