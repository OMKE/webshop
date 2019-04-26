(function (angular) {
    angular.module("app").controller("AdminPopCategoryCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", "Upload", "$scope", function ($stateParams, $http, $state, $rootScope, $location, Upload, $scope) {
        
        let that = this;
        this.popular_category = {};
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port

        this.cat_name;
        
        this.getPopularCategory = function (id) {
            $http.get("/api/categories/popular/"+id).then(function (response) {
                that.popular_category = response.data;
                that.cat_name = that.popular_category.name;
            }, function (response) {
                
            });
        };

        $scope.editCat = function(file) {
            file.upload = Upload.upload({
              url: '/admin/popular_categories/edit',
              data: {id:that.popular_category.id, name: that.popular_category.name, file: file},
            });
        
            file.upload.then(function (response) {
                $state.go("admin_popular_categories", {}, {reload:true});
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            })
        }

        this.delete = function () {
            $http.delete("/admin/popular_categories/"+that.popular_category.id).then(function (response) {
                $state.go("admin_popular_categories", {}, {reload:true});
            }, function (response) {
                console.log(response.status);
            })
        };


        this.getPopularCategory($stateParams["id"]);



        this.checkUser = function () {
            if($state.is("admin_categories") && $rootScope.user.admin == false){
                $state.go("home");
            }
        };
        
        angular.element(document).ready(function () {
            that.checkUser();
        });

        
        
    
        
        

        
        

        

    }]);
})(angular);