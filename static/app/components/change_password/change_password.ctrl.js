(function (angular) {
    angular.module("app").controller("ChangePasswordCtrl", ["$http", "$state", "$rootScope", "$timeout", function ($http, $state, $rootScope, $timeout) {
        let that = this;
        this.user = {
            "newPass": ""
        };

        this.success = function () {
            $state.go("home", {}, { reload: true })
        }

        this.changePass = function () {
            $http.post("/user/changepassword", that.user).then(function (response) {
                that.message = response.data;
                $timeout(that.success, 2000);
            })
        }
    }])
})(angular)