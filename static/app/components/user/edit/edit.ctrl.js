(function (angular) {
    angular.module("app")
    .controller("EditUserCtrl", ["$http", "$rootScope", "$state", function ($http, $rootScope, $state) {
        let that = this;

        
        this.editedUser = $rootScope.user;        
        

        this.save = function () {
            $http.post("/edit", that.editedUser).then(function (response) {
                $state.go("user", {"username":that.editedUser.username}, {reload:true});
            }, function (reponse) {
                console.log(response.status);
            });
        }
        

        


        
    }]);
    
})(angular);