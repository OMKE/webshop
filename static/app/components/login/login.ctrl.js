(function (angular) {
    angular.module("app").controller("LoginCtrl", ["$http" ,"$state", "$rootScope", "$scope", function ($http, $state, $rootScope, $scope) {
        let that = this;
        
        this.userCred = {
            username: "", 
            password: ""
        }
        
        

        this.userData = function () {
            $http.get("/login/user").then(function (response) {
                $rootScope.user = response.data;
                $rootScope.loggedIn = true;
            }, function (response) {
                if(response.status == 404){
                    console.log("Error status code: 404 - Not found");
                }
            })
        };

        

        this.login = function (callback) {
            

            $http.post("/login", that.userCred).then(function (response) {
                $rootScope.loggedIn = true;
                callback();
                $state.go("home", {}, { reload:true });
                
               
                
            }, function () {
                alert("Unsuccessful login");
                
                
            })
        }
        this.logOut = function () {
            
            $http.get("/logout").then(function () {
                $rootScope.loggedIn = false;
                $rootScope.user = undefined;
                $state.go("home", {}, { reload:true });
                
            }, function (response) {
                console.log("Error");
            });
        };
        

       
        this.checkUser = function () {
            if($state.is("login") && ($rootScope.user != undefined)){
                $state.go("home");
            }
        };
        angular.element(document).ready(function () {
            that.checkUser();
        });
        

    }]);
})(angular);