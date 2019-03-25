(function (angular) {
    angular.module("app").controller("RegisterCtrl", ["$http" ,"$state", "$timeout", "$rootScope", function ($http, $state, $timeout, $rootScope) {
        let that = this;
        
        this.newCustomer = {
            email:"",
            username:"",
            password:"",
            first_name:"",
            last_name:"",
            gender:"",
            date_of_birth: new Date(document.getElementById('birth_date').value).getTime()
        }
        this.state = {
            registered: false
        }
        this.message = "";

        this.successReg = function () {
            $state.go("login", {}, { reload:true })
        }

        this.register = function () {
            $http.post('/register', that.newCustomer).then(function (response) {
                that.registered = true;
                that.message = response.data;
                $timeout(that.successReg, 2000);
            }, function (response) {
                alert("Unsuccessful regitration!");
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