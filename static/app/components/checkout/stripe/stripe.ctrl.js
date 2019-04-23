(function (angular) {
    angular.module("app").controller("StripeCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", "$timeout", function ($stateParams, $http, $state, $rootScope, $location, $timeout) {
        
        let that = this;
        this.host = "https://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        
        
        this.cartItems = [];
        this.totalPrice = 0;
        this.quantity = 1;
        this.publicKey = "";
        
        this.getCartItems = function () {
            $http.get("/cart/items").then(function (response) {
                that.cartItems = response.data;
                that.totalPrice = 0;
                that.calculateTotalPrice();
                
            }, function (response) {
                console.log(response.status);
            });
        };
        this.getPublicKey = function () {
            $http.get("/stripe/public_key").then(function (response) {
                that.publicKey = response.data;
            }, function (response) {
                console.log(response.status);
            });
        };

        this.calculateTotalPrice = function () {
            for(let i = 0; i < that.cartItems.length; i++){
                that.totalPrice += (that.cartItems[i].price * that.cartItems[i].quantity) * 100;
            }
        };


        

        this.getCartItems();
        this.getPublicKey();

        
        

        

    }]);
})(angular);