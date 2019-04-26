(function (angular) {
    angular.module("app").controller("AdminPopCategoriesCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", function ($stateParams, $http, $state, $rootScope, $location) {
        
        let that = this;
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        this.popular_categories = {};

        this.getPopularCategories = function () {
            $http.get("/api/categories/popular").then(function (response) {
                that.popular_categories = response.data;
            }, function (response) {
                
            });
        };

        this.getPopularCategories();
        




        this.checkUser = function () {
            if($state.is("admin_popular_categories") && $rootScope.user.admin == false){
                $state.go("home");
            }
        };
        
        angular.element(document).ready(function () {
            that.checkUser();
        });

        
        
    
        
        

        
        

        

    }]);
})(angular);