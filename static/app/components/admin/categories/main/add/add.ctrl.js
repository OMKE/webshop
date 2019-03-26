(function (angular) {
    angular.module("app").controller("AddMainCategoriesCtrl", ["$stateParams", "$http", "$state", "$rootScope", function ($stateParams, $http, $state, $rootScope) {
        
        let that = this;
        this.newCategory = {
            "category_name": ""
        };
        this.message = "";

        this.addCategory = function () {
            $http.post("/admin/categories/add", that.newCategory).then(function (response) {
                that.message = response.data;
            }, function (response) {
                console.log(response.status);
            });
        };

        
        




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