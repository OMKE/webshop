(function(angular){
    
    let app = angular.module("app", ["ui.router", "ngCookies", "ngFileUpload"]);

    

    app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {
        
        $stateProvider.state({
            name: "home", 
            url: "/",
            templateUrl: "/app/components/homepage/homepage.tpl.html",
            controller: "HomepageCtrl",
            controllerAs: "home" 
        })
        .state({
            name:"login",
            url:"/login",
            templateUrl:"/app/components/login/login.tpl.html",
            controller: "LoginCtrl",
            controllerAs: "login",
            resolve: {
                security: ['$q', '$rootScope', function ($q, $rootScope) {
                    if ($rootScope.user != undefined) {
                        return $q.reject("Not authorized");
                    }
                }]
            }
        })
        .state({
            name:"register",
            url:"/register",
            templateUrl:"/app/components/register/register.tpl.html",
            controller: "RegisterCtrl",
            controllerAs: "register",
            resolve: {
                security: ['$q', '$rootScope', function ($q, $rootScope) {
                    if ($rootScope.user != undefined) {
                        return $q.reject("Not authorized");
                    }
                }]
            }
        })
        .state({
            name:"user",
            url:"/user/{username:string}",
            templateUrl:"/app/components/user/user.tpl.html",
            controller:"UserCtrl",
            controllerAs:"view_user",
        })
        .state({
            name: "edit_user",
            url:"/user/edit_profile",
            templateUrl: "/app/components/user/edit/edit.tpl.html",
            controller:"EditUserCtrl",
            controllerAs: "eu",
            
        })
        .state({
            name:"edit_user_image",
            url:"/user/edit_profile/profile_image",
            templateUrl:"/app/components/user/edit_image/edit_image.tpl.html",
            controller:"EditUserImageCtrl",
            controllerAs:"eui",
            
        })
        .state({
            name:"product",
            url:"/product/{id:int}",
            templateUrl: "/app/components/display_products/product/product.tpl.html",
            controller: "ProductCtrl",
            controllerAs: "product"
        })
        .state({
            name:"cart",
            url:"/cart",
            templateUrl: "/app/components/cart/cart.tpl.html",
            controller: "CartCtrl",
            controllerAs: "cart",
            
        })
        .state({
            name:"checkout",
            url:"/checkout",
            templateUrl: "/app/components/checkout/checkout.tpl.html",
            controller: "CheckoutCtrl",
            controllerAs: "checkout",
            
        })
        .state({
            name:"checkout.mastercard",
            url:"/mastercard",
            templateUrl:"/app/components/checkout/mastercard/mastercard.tpl.html",
            controler: "MasterCardCtrl",
            controllerAs: "mastercard"
        })
        .state({
            name:"checkout.visa",
            url:"/visa",
            templateUrl:"/app/components/checkout/visa/visa.tpl.html",
            controler: "VisaCtrl",
            controllerAs: "visa"
        })
        .state({
            name:"checkout.paypal",
            url:"/paypal",
            templateUrl:"/app/components/checkout/paypal/paypal.tpl.html",
            controler: "PaypalCtrl",
            controllerAs: "paypal"
        })
        .state({
            name: "category",
            url: "/category/{id:int}",
            templateUrl: "/app/components/display_products/category/category.tpl.html",
            controller: "CategoryCtrl",
            controllerAs: "category"
        })
        .state({
            name:"category.subCategory",
            url: "/subcategory/{id2:int}",
            templateUrl:"/app/components/display_products/subcategory/subcategory.tpl.html",
            controller: "SubCategoryCtrl",
            controllerAs: "subcategory"
        })
        // .state({
        //     name:"category.price",
        //     url:"/price",
        //     templateUrl:"/app/components/display_products/price/price.tpl.html",
        //     controller:"PriceCtrl",
        //     controllerAs: "price"
        // })
        .state({
            name:"passwordReset",
            url:"/resetpassword",
            templateUrl: "/app/components/password_reset/password_reset.tpl.html",
            controller:"PasswordResetCtrl",
            controllerAs:"passwordreset"
        })
        .state({
            name:"changePassword",
            url:"/changepassword",
            templateUrl:"/app/components/change_password/change_password.tpl.html",
            controller: "ChangePasswordCtrl",
            controllerAs: "changepassword",
            
        })
        .state({
            name: "privacypolicy",
            url: "/privacy",
            templateUrl: "/app/components/help_and_contact/privacypolicy.tpl.html"
        })
        .state({
            name:"termsandconditions",
            url:"/termsandconditions",
            templateUrl:"/app/components/help_and_contact/termsandconditions.tpl.html"
        })
        .state({
            name:"search",
            url:"/search",
            templateUrl: "/app/components/search/search.tpl.html",
            controller:"SearchCtrl",
            controllerAs:"search"
        });
        $urlRouterProvider.otherwise("/");



        // In every http request it sends access token from cookie storage in header access_token
        $httpProvider.interceptors.push(function($q, $cookies) {
            return {
             'request': function(config) {
                  config.headers['access_token'] = $cookies.get('token');
                  
                  return config;
              }
            };
          });
        
        
        
    }])

    // On every state change it sends a request to check if it's valid token, if it is then user info is saved in rootScope.user
    .run(function($rootScope, $http, $state, $q){
        $rootScope.$on('$locationChangeStart', function () {
            $http.get("/login/user").then(function (response) {
                if(response.status == 200){
                    $rootScope.user = response.data;
                    $rootScope.user.phone_number = parseInt($rootScope.user.phone_number);
                    $rootScope.loggedIn = true;
                    if($rootScope.user.image == ""){
                        $rootScope.user.image = "no_picture.png";
                    }
                    if($rootScope.user.password_reset == 1){
                        $state.go("changePassword", {}, { reload: false });
                    }
                    
                }
                if(response.status == 205){
                    $rootScope.user = undefined;
                    $rootScope.loggedIn = false;
                }
            }, function (response) {
                
            });
            
        });
        
    });


    
    

})(angular);
