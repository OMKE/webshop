(function (angular) {
    angular.module("app").controller("CategoryCtrl", ["$stateParams","$http", "$rootScope", function ($stateParams, $http, $rootScope) {
        let that = this;
        this.categories = {};
        this.subCategories = {};
        this.products = [];
        $rootScope.isSubCategory = false; // when user clicks on subcategory link, hide products which come from show products by main category


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