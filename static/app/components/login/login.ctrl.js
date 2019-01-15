(function (angular) {
    angular.module("app").controller("LoginCtrl", ["$http" ,"$state", "$scope", function ($http, $state, $scope, logged) {
        let that = this;
        
        this.customer = {
            username: "", 
            password: ""
        }
        this.state = {
            loggedIn: false
        }
        $scope.logged = false;

        

        this.login = function (callback) {
            // We take user's input and we need to encode it to base64 with window.btoa function
            let str = this.customer.username + ":" + this.customer.password;
            let enc = window.btoa(str);
            let auth_header = "Basic "+ enc; // we get something like this = Basic b21rbzoxMjM0
            $http.defaults.headers.common['Authorization'] = auth_header; // we set the auth header with encoded string and type of auth
            

            $http.post("/login", that.customer).then(function (response) {
                $scope.logged = true;
                $state.go("home", {}, { reload:true });
                
               
                
            }, function () {
                alert("Unsuccessful login")
                
                
            })
        }
        this.logOut = function () {
            $scope.logged = false;
            $state.go("home", {}, {reload:true});
        }
        

       
        
        

    }]);
})(angular);