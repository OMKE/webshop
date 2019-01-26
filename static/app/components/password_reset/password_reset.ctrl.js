(function (angular) {
    angular.module("app").controller("PasswordResetCtrl", ["$http", "$state", "$timeout", function ($http, $state, $timeout) {
        let that = this;

        
        this.user = {
            "email" : ""
        }
        // console.log(this.emailInput);

        this.success = function () {
            $state.go("home", {}, { reload: true })
        }
        this.message = "";

        this.checkEmail = function () {
            $http.post("/login/resetpassword", that.user).then(function (response) {
                    that.message = response.data;
                    $timeout(that.success, 2000);
            }, function (response) {
                
            })
        }

    }]);
})(angular);
