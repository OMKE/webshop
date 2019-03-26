(function (angular) {
    angular.module("app").controller("AdminSubCategoriesCtrl", ["$stateParams", "$http", "$state", "$rootScope", function ($stateParams, $http, $state, $rootScope) {
        
        let that = this;
        this.subcategories = {};

        this.getSubCategories = function () {
            $http.get("/api/subcategories").then(function (response) {
                that.subcategories = response.data;
            }, function (response) {
                
            });
        };

        
        this.getSubCategories();
        




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