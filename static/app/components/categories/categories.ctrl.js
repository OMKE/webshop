(function (angular) {
    angular.module("app").controller("CategoriesCtrl", ["$http", function ($http) {
        let that = this;
        this.categories = {};

        // Gets categories and shows them in navigation bar
        this.getCategories = function () {
            $http.get("/api/categories").then(function (response) {
                that.categories = response.data;
            }, function (response) {
                
            })
        };
        

        

        this.getCategories();


        

        
    }]);
})(angular);