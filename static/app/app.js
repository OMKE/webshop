(function(angular){
    
    let app = angular.module("app", ["ui.router", "ngCookies"]);

    app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {
        
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
        }).state({
            name:"user",
            url:"/user/{username:string}}",
            templateUrl:"/app/components/user/user.tpl.html",
            controller:"UserCtrl",
            controllerAs:"user"
        }).state({
            name: "category",
            url: "/category/{id:int}",
            templateUrl: "/app/components/category/category.tpl.html",
            controller: "CategoryCtrl",
            controllerAs: "category"
        }).state({
            name:"category.subCategory",
            url: "/subcategory/{id:int}",
            templateUrl:"/app/components/category/subcategory.tpl.html",
            controller: "SubCategoryCtrl",
            controllerAs: "subcategory"
        }).state({
            name:"passwordReset",
            url:"/resetpassword",
            templateUrl: "/app/components/password_reset/password_reset.tpl.html",
            controller:"PasswordResetCtrl",
            controllerAs:"passwordreset"
        }).state({
            name:"changePassword",
            url:"/changepassword",
            templateUrl:"/app/components/change_password/change_password.tpl.html",
            controller: "ChangePasswordCtrl",
            controllerAs: "changepassword",
        }).state({
            name: "privacypolicy",
            url: "/privacy",
            templateUrl: "/app/components/help_and_contact/privacypolicy.tpl.html"
        }).state({
            name:"termsandconditions",
            url:"/termsandconditions",
            templateUrl:"/app/components/help_and_contact/termsandconditions.tpl.html"
        });
        $urlRouterProvider.otherwise("/");

        $httpProvider.interceptors.push(function($q, $cookies) {
            return {
             'request': function(config) {
                  config.headers['access_token'] = $cookies.get('token');
                  return config;
              }
            };
          });
        
        
        
    }])
    .run(function($rootScope, $http, $state){
        $rootScope.$on('$locationChangeStart', function () {
            $http.get("/login/user").then(function (response) {
                if(response.status == 200){
                    $rootScope.user = response.data;
                    $rootScope.loggedIn = true;
                    if($rootScope.user.password_reset == 1){
                        $state.go("changePassword", {}, { reload: false })
                    }
                    
                }
            }, function (response) {
                
            });
        });
    });


    
    

})(angular);
