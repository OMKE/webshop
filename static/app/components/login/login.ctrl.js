(function (angular) {
    angular.module("app").controller("LoginCtrl", ["$http" ,"$state", "$rootScope", "$location", function ($http, $state, $rootScope, $location) {
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
            // We take user's input and we need to encode it to base64 with window.btoa function
            let str = this.userCred.username + ":" + this.userCred.password;
            let enc = window.btoa(str);
            let auth_header = "Basic "+ enc; // we get something like this = Basic b21rbzoxMjM0
            $http.defaults.headers.common['Authorization'] = auth_header; // we set the auth header with encoded string and type of auth
            

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
                $state.go("home", {}, { reload:true });
            }, function (response) {
                console.log("Error");
            })
        }
        

       
        
        

    }]);
})(angular);