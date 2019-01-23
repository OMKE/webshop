(function(angular){
    
    let app = angular.module("app", ["ui.router"]);

    app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        
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
            name:"subCategory",
            url:"/category/subcategory/{id:int}",
            controller: "SubCategoryCtrl",
            controllerAs: "subcategory"
        });
        $urlRouterProvider.otherwise("/");
        
        
    }])
    .run(function($rootScope, $http){
        $rootScope.$on('$locationChangeStart', function () {
            $http.get("/login/user").then(function (response) {
                if(response.status == 200){
                    $rootScope.user = response.data;
                    $rootScope.loggedIn = true;
                }
            }, function (response) {
                
            });
        });
    });


    
    

})(angular);
