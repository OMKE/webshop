(function (angular) {
    angular.module("app").controller("SubCategoryCtrl", ["$stateParams", "$http", "$rootScope", "$location", function ($stateParams, $http, $rootScope, $location) {
        
        let that = this;

        this.host = "https://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port

        

        $rootScope.isSubCategory = true;

        this.products = [];

        this.getProducts = function (id) {
            $http.get(`/api/subcategories/${id}/products`).then(function (response) {
                that.products = response.data;
            }, function (response) {
                
            })
        }

        this.getProducts($stateParams['id2']);
        
    }]);
})(angular);