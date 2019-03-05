(function (angular) {
    angular.module("app").controller("CartCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", function ($stateParams, $http, $state, $rootScope, $location) {
        
        let that = this;
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        this.cartItems = [];
        this.totalPrice = 0;



        this.addToCart = function (id) {
            $http.get("/cart/items/"+id).then(function (response) {
                console.log(response.data);
            }, function (response) {
                console.log(response.status);
            });
        };
        this.deleteItem = function (id) {
            $http.get(`/cart/items/${id}/delete`).then(function (response) {
                console.log(response.status);
            }, function (response) {
                console.log(response.status);
            });
        }

        this.getCartItems = function () {
            $http.get("/cart/items").then(function (response) {
                that.cartItems = response.data;
                for(let i = 0; i < that.cartItems.length; i++){
                    that.totalPrice += that.cartItems[i].price;
                }
            }, function (response) {
                console.log(response.status);
            });
        };

        this.getCartItems();
        

        // this.getProduct($stateParams["id"]);
        
        

        
        

        

    }]);
})(angular);