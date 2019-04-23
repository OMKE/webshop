(function (angular) {
    angular.module("app").controller("CartCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", "$timeout", function ($stateParams, $http, $state, $rootScope, $location, $timeout) {
        
        let that = this;
        this.host = "https://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        this.cartItems = [];
        this.totalPrice = 0;
        this.quantity = 1;
        this.message = "";
        this.className = "btn-primary";
        this.message2 = "Add to cart";


        
        this.clicked = function () {
            that.className = "btn-success";
            that.message2 = "Added";
            $timeout(() => {
                that.className = "btn-primary";
                that.message2 = "Add to cart";
            }, 3000);
        };

        

        // Adds one to quantity
        this.add = function (id) {
            for (let i = 0; i < that.cartItems.length; i++) {
                if (that.cartItems[i].id == id){
                    // that.cartItems[i].quantity += 1;
                    $http.put(`/cart/items/${id}/update_quantity`, that.cartItems[i].quantity += 1).then(function (response) {
                        
                        that.getCartItems();
                    }, function (response) {
                        console.log(response.status);
                    });
                    break;
                }
                
            }
            
        };

        this.subtract = function (id) {            
            for (let i = 0; i < that.cartItems.length; i++) {
                if (that.cartItems[i].id == id){
                    // that.cartItems[i].quantity += 1;
                    if(that.cartItems[i].quantity == 1){
                        return;
                    }
                    $http.put(`/cart/items/${id}/update_quantity`, that.cartItems[i].quantity -= 1).then(function (response) {
                        
                        that.getCartItems();
                    }, function (response) {
                        console.log(response.status);
                    });
                    break;
                }

                
            }
        };

        this.addToCart = function (id) {
            $http.post("/cart/items/"+id, that.quantity).then(function (response) {
                that.message = response.data;
                that.totalPrice = 0;
            }, function (response) {
                console.log(response.status);
            });
        };
        this.addToCart2 = function (id) {
            $http.post("/cart/items/"+id, 1).then(function (response) {
                that.message = response.data;
                that.totalPrice = 0;
            }, function (response) {
                console.log(response.status);
            });
        };
        this.deleteItem = function (id) {
            $http.get(`/cart/items/${id}/delete`).then(function (response) {
                that.getCartItems();

            }, function (response) {
                console.log(response.status);
            });
        }

        this.getCartItems = function () {
            $http.get("/cart/items").then(function (response) {
                that.cartItems = response.data;
                that.totalPrice = 0;
                that.calculateTotalPrice();
                
            }, function (response) {
                console.log(response.status);
            });
        };
        this.calculateTotalPrice = function () {
            for(let i = 0; i < that.cartItems.length; i++){
                that.totalPrice += (that.cartItems[i].price * that.cartItems[i].quantity);
            }
        };

        

        if($state.is("cart")){
            this.getCartItems();
        }
        

        
        
        

        
        

        

    }]);
})(angular);