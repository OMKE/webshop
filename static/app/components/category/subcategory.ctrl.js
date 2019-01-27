(function (angular) {
    angular.module("app").controller("SubCategoryCtrl", ["$stateParams", "$http", "$rootScope", function ($stateParams, $http, $rootScope) {
        

        let that = this;

        $rootScope.isSubCategory = true;

        this.products = [];

        this.getProducts = function (id) {
            $http.get(`/api/subcategories/${id}/products`).then(function (response) {
                that.products = response.data;
            }, function (response) {
                
            })
        }

        this.getProducts($stateParams['id']);
        
    }]);
})(angular);