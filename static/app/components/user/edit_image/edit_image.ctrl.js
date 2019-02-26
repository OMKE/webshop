(function (angular) {
    angular.module("app")
        .controller("EditUserImageCtrl", ["$http", "$rootScope", "$state", "$location", "Upload", "$scope", "$timeout", function ($http, $rootScope, $state, $location, Upload, $scope, $timeout) {
            let that = this;

            this.host = "http://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port

            this.editedUser = $rootScope.user;

            

            this.deleteImage = function () {
                $http.get("/edit/profile_picture/delete").then(function (response) {
                    $timeout(function () {
                        $state.go("user", {"username":$rootScope.user.username}, {reload:true});
                    }, 1000);
                }, function (response) {
                    console.log("Error: "  + response.status);
                });
            };


            // Using ng-file-upload directive 
            // docs: https://github.com/danialfarid/ng-file-upload  
            $scope.upload = function (file) {
                Upload.upload({
                    url: '/edit/profile_picture',
                    data: {file: file}
                }).then(function (resp) {
                    $state.go("user", {"username":$rootScope.user.username}, {reload:true});
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                });
            };



        }]);

})(angular);