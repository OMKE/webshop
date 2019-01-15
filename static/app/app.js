(function(angular){
    
    let app = angular.module("app", ["ui.router"]);

    app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {
        
        // $httpProvider.interceptors.push(function($q, $cookies){
        //     return {
        //         'request': function(config){
        //             config.headers['Token'] = $cookies.loginTokenCookie;
        //             return config;
        //         }
        //     }
        // })

    
        

        $stateProvider.state({
            name: "home", 
            url: "/",
            templateUrl: "/app/components/homepage/homepage.tpl.html",
            controller: "HomepageCtrl",
            controllerAs: "home" 
        }).state({
            name:"login",
            url:"/login",
            templateUrl:"/app/components/login/login.tpl.html",
            controller: "LoginCtrl",
            controllerAs: "login"
        }).state({
            name:"register",
            url:"/register",
            templateUrl:"/app/components/register/register.tpl.html",
            controller: "RegisterCtrl",
            controllerAs: "register"
        });
        $urlRouterProvider.otherwise("/");
    }]);

    app.factory('loginStatus', function () {
        let logged = false;
        
        return logged;
    })
})(angular);