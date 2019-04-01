(function (angular) {
    angular.module("app").controller("AdminSubCategoryCtrl", ["$stateParams", "$http", "$state", "$rootScope", function ($stateParams, $http, $state, $rootScope) {
        
        let that = this;
        this.subcategory = {};
        
        this.message = "";
        this.subcat_title = "";


        this.getSubcategory = function (id) {
            $http.get("/admin/subcategories/"+id).then(function (response) {
                that.subcategory = response.data;
                
                
                that.subcat_title = that.subcategory.sub_category_name;
            }, function (response) {
                
            });
        };


        this.editName = function () {
            
            $http.put(`/admin/subcategories/${that.subcategory.id}/edit`, that.subcategory).then(function (response) {
                that.message = response.data;
                
                $state.go("admin_subcategories", {}, {reload: true});
            }, function (response) {
                console.log(response.status);
            });
            
        };
        
        this.getSubcategory($stateParams['id']);


        
        




        this.checkUser = function () {
            if($state.is("admin_subcategory") && $rootScope.user.admin == false){
                $state.go("home");
            }
        };
        
        angular.element(document).ready(function () {
            that.checkUser();
        });

        
        
    
        
        

        
        

        

    }]);
})(angular);