(function (angular) {
    angular.module("app").controller("OrdersCtrl", ["$http", "$rootScope", "$state", "$location", function ($http, $rootScope, $state, $location) {
        let that = this;
        this.loggedUser = $rootScope.user;
        
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        
        this.orders = [];
        this.getOrderStatus = function (int) {
          let codes = {
              "1": "Incomplete",
              "2": "Pending",
              "3": "Processed",
              "4": "Shipped",

          };
          
          return codes[int];  
            
        };
        
        this.getOrders = function () {
            $http.get("/orders").then(function (response) {
                // let totalPrice = 0;
                that.orders = response.data;
                // TODO - Calculate total price and add it to orders object
                
            }, function (response) {
                console.log(response.status);
            });  
        };

        this.getOrders();
        

        // console.log(this.loggedUser);
    }]);
})(angular);