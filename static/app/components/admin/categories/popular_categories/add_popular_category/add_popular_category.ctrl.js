(function (angular) {
    angular.module("app").controller("AdminAddPopCategoryCtrl", ["$stateParams", "$http", "$state", "$rootScope", "$location", "Upload", "$scope", function ($stateParams, $http, $state, $rootScope, $location, Upload, $scope) {
        
        let that = this;
        this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        this.popular_categories = {};

        this.new_popular_category = "";

        // Form submission and image upload using ng-upload directive
        $scope.uploadPic = function(file) {
            file.upload = Upload.upload({
              url: '/admin/popular_categories',
              data: {name: that.new_popular_category, file: file},
            });
        
            file.upload.then(function (response) {
                $state.go("admin_popular_categories", {}, {reload:true});
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            })
        }



        this.checkUser = function () {
            if($state.is("admin_add_popular_category") && $rootScope.user.admin == false){
                $state.go("home");
            }
        };
        
        angular.element(document).ready(function () {
            that.checkUser();
        });

        
        
    
        
        

        
        

        

    }]);
})(angular);