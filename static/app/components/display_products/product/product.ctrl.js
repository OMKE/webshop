(function (angular) {
    angular.module("app").controller("ProductCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", function ($stateParams, $http, $state, $rootScope, $location) {
        
        let that = this;
        this.host = "https://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        this.product = {};
        this.similar = [];


        this.getProduct = function (id) {
            $http.get("/api/products/"+id).then(function (response) {
                that.product = response.data;
                that.getSimilar(that.product.sub_category_id);
            }, function (response) {
                console.log(response.status);
            });
        };

        this.getSimilar = function (id) {
            $http.get(`/api/products/${id}/similar`).then(function (response) {
                that.similar = response.data;
            }, function (response) {
                console.log(response.status);
            });
        };


        this.getProduct($stateParams["id"]);
        
        

        
        

        

    }]);
})(angular);