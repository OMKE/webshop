(function (angular) {
    angular.module("app").controller("RegisterCtrl", ["$http" ,"$state", function ($http, $state) {
        let that = this;
        
        this.newCustomer = {
            email:"",
            username:"",
            password:"",
            first_name:"",
            last_name:"",
            gender:"",
            date_of_birth:""
        }
        this.state = {
            registered: false
        }

        this.register = function () {
            $http.post('/register', that.newCustomer).then(function (response) {
                that.registered = true;
                $state.go("login", {}, { reload:true });
            }, function (response) {
                alert("Unsuccessful regitration!")
            });
        }

        

    }]);
})(angular);