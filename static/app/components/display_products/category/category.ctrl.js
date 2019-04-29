(function (angular) {
    angular.module("app").controller("CategoryCtrl", ["$stateParams","$http", "$rootScope", "$location", function ($stateParams, $http, $rootScope, $location) {
        let that = this;

        this.host = "https://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        this.categories = {};
        this.subCategories = {};
        this.products = [];
        // this.currentCategory = $stateParams['id'];
        
        $rootScope.getByPrice = {
            "active": false,
            "minPrice": "",
            "maxPrice": ""
        };

        $rootScope.isSubCategory = false; // when user clicks on subcategory link, hide products which come from show products by main category


        this.getCategory = function (id) {
            $http.get("/api/categories/"+id).then(function (response) {
                that.category = response.data;
            }, function (response) {
                
            });
        };

        this.getSubCategories = function (id) {
            $http.get("/api/subcategories/"+id).then(function (response) {
                that.subCategories = response.data;
                
            }, function (response) {
                
            });
        };
        this.shopByPrice = function () {
            let id = $stateParams['id'];
            $http.get(`/api/categories/${id}/products/${$rootScope.getByPrice.minPrice}&${$rootScope.getByPrice.maxPrice}`).then(function (response) {
                that.products = response.data;
                $rootScope.getByPrice.active = true;
            }, function (response) {
                console.log(response.status);
            })
        }

        // Gets products from main category
        this.getProducts = function (id) {
            $http.get(`/api/categories/${id}/products`).then(function (response) {
                that.products = response.data;
            }, function (response) {
                
            });
            
        };

        this.reset = function () {
            this.getProducts($stateParams['id']);
            $rootScope.getByPrice.active = false;
        }
        
        

        // this.getCategory($stateParams["id"]);
        this.getSubCategories($stateParams['id']);
        this.getProducts($stateParams['id']);

        
        
        

        
    }]);
})(angular);