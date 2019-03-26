(function (angular) {
    angular.module("app").controller("MainCategoriesCtrl", ["$stateParams", "$http", "$state", "$rootScope", function ($stateParams, $http, $state, $rootScope) {
        
        let that = this;
        this.categories = {};

        this.getCategories = function () {
            $http.get("/api/categories").then(function (response) {
                that.categories = response.data;
            }, function (response) {
                
            });
        };

        this.getCategories();
        




        // this.checkUser = function () {
        //     if($state.is("admin") && $rootScope.user.admin == false){
        //         $state.go("home");
        //     }
        // };
        
        // angular.element(document).ready(function () {
        //     that.checkUser();
        // });

        
        
    
        
        

        
        

        

    }]);
})(angular);