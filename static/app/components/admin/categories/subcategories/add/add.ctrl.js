(function (angular) {
    angular.module("app").controller("AdminAddSubCategoryCtrl", ["$stateParams", "$http", "$state", "$rootScope", function ($stateParams, $http, $state, $rootScope) {
        
        let that = this;
        this.newSubCategory = {
            "sub_category_name": "",
            "category_id": null

        };
        this.categories = {};
        this.message = "";

        
        this.getCategories = function () {
            $http.get("/api/categories").then(function (response) {
                that.categories = response.data;
            }, function (response) {
                
            })
        };
        

        

        


        this.addSubCategory = function () {
            $http.post("/admin/subcategories/add", that.newSubCategory).then(function (response) {
                that.message = response.data;
            }, function (response) {
                console.log(response.status);
            });
        };

        
        




        this.checkUser = function () {
            if($state.is("admin_add_subcategory") && $rootScope.user.admin == false){
                $state.go("home");
            }
        };
        
        angular.element(document).ready(function () {
            that.checkUser();
        });

        
        
    
        
        this.getCategories();

        
        

        

    }]);
})(angular);