(function (angular) {
    angular.module("app").controller("LoginCtrl", ["$http" ,"$state", "$scope", function ($http, $state, $scope) {
        let that = this;
        
        this.customer = {
            username: "", 
            password: ""
        }
        this.state = {
            loggedIn: false
        }

        

        this.login = function () {
            // We take user's input and we need to encode it to base64 with window.btoa

            let str = this.customer.username + ":" + this.customer.password;
            let enc = window.btoa(str);
            let auth_header = "Basic "+ enc;
            $http.defaults.headers.common['Authorization'] = auth_header; // we set the auth header with encoded string and type of auth
            

            $http.post("/login", that.customer).then(function (response) {
                $state.go("home", {}, { reload:true });
                console.log(response.data);
                console.log(auth_header);
            }, function () {
                alert("Unsuccessful login")
                console.log(auth_header);
                
            })
        }

       
        
        

    }]);
})(angular);