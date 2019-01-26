(function (angular) {
    angular.module("app").controller("CategoryCtrl", ["$stateParams","$http", function ($stateParams, $http) {
        let that = this;
        this.category = {};
        this.subCategories = {};
        this.products = [];


        this.getCategory = function (id) {
            $http.get("/api/categories/"+id).then(function (response) {
                that.category = response.data;
            }, function (response) {
                
            })
        }

        this.getSubCategories = function (id) {
            $http.get("/api/subcategories/"+id).then(function (response) {
                that.subCategories = response.data;
            }, function (response) {
                
            })
        }

        // Gets products from main category
        this.getProducts = function (id) {
            $http.get(`/api/categories/${id}/products`).then(function (response) {
                that.products = response.data;
            }, function (response) {
                
            })
        }

        

        this.getCategory($stateParams["id"]);
        this.getSubCategories($stateParams['id']);
        this.getProducts($stateParams['id']);
        
        

        
    }]);
})(angular);