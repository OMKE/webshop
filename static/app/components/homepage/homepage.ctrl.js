(function (angular) {
    angular.module("app").controller("HomepageCtrl", ["$stateParams", "$http" ,function ($stateParams, $http, $scope ) {
        let that = this;

        this.products = []
        
        // this.getProducts = function () {
        //     $http.get("/api/products").then(function (response) {
        //         that.products = response.data;
        //     }, function (response) {
                
        //     })
        // }
        
        

        
        
    }]);
})(angular);