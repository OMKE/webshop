(function (angular) {
    angular.module("app").controller("AdminOrdersCtrl", ["$http", "$rootScope", "$location", function ($http, $rootScope, $location) {
        
        let that = this;

        this.host = "https://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port

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
            $http.get("/admin/orders").then(function (response) {
                that.orders = response.data;
            }, function (response) {
                console.log(response.status);
            })
        }
        this.getOrdersByStatusCode = function (status) {
            $http.get("/admin/orders/" + status).then(function (response) {
                that.orders = response.data;
            }, function (response) {
                console.log(response.status);
            })
        }


        this.getOrders();

    }]);
})(angular);