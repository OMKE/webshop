(function (angular) {
    angular.module("app").controller("MainCategoryCtrl", ["$stateParams", "$http", "$state", "$rootScope", function ($stateParams, $http, $state, $rootScope) {
        
        let that = this;
        this.category = {};
        this.subCategories = {};
        this.message = "";
        this.cat_title = "";


        this.editName = function () {
            
            $http.put(`/admin/categories/${that.category.id}/edit`, that.category).then(function (response) {
                that.message = response.data;
                
                $state.go("admin_categories", {}, {reload: true});
            }, function (response) {
                console.log(response.status);
            });
            
        };
        
        this.getCategory = function (id) {
            $http.get("/api/categories/"+id).then(function (response) {
                that.category = response.data;
                that.cat_title = that.category.category_name;
            }, function (response) {
                
            });
        };
        this.getSubCategories = function (id) {
            $http.get("/api/subcategories/"+id).then(function (response) {
                that.subCategories = response.data;
                
            }, function (response) {
                
            });
        };


        this.getSubCategories($stateParams['id']);
        this.getCategory($stateParams["id"]);
        




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