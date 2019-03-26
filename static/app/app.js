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
            name: "orders",
            url: "/orders",
            templateUrl: "/app/components/user/orders/orders.tpl.html",
            controller: "OrdersCtrl",
            controllerAs: "orders"
        })
        .state({
            name: "orders.details",
            url:'/details/{id:int}',
            templateUrl: "/app/components/user/orders/details/details.tpl.html"
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
            name:"checkout.stripe",
            url:"/stripe",
            templateUrl:"/app/components/checkout/stripe/stripe.tpl.html",
            controller: "StripeCtrl",
            controllerAs: "stripe"
        })
        .state({
            name:"checkout.paypal",
            url:"/paypal",
            templateUrl:"/app/components/checkout/paypal/paypal.tpl.html",
            controller: "PaypalCtrl",
            controllerAs: "paypal"
        })
        .state({
            name: "dailydeals",
            url: "/dailydeals",
            templateUrl: "/app/components/display_products/daily_deals/daily_deals.tpl.html",
            controller: "DailyDealsCtrl",
            controllerAs: "daily_deals"
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

        // Admin state provider
        // TODO - Try to make it work with nested views
        $stateProvider.state({
            name: "admin_dashboard",
            url: "/admin/dashboard",
            templateUrl: "/app/components/admin/index/dashboard.tpl.html",
            controller: "DashboardCtrl",
            controllerAs: "dashboard"
        })
        .state({
            name: "admin_categories",
            url: "/admin/categories",
            templateUrl: "/app/components/admin/categories/main/display/main.tpl.html",
            controller: "MainCategoriesCtrl",
            controllerAs: "main_cats"
        })
        .state({
            name:"admin_add_categories",
            url: "/admin/categories/add",
            templateUrl: "/app/components/admin/categories/main/add/add.tpl.html",
            controller: "AddMainCategoriesCtrl",
            controllerAs: "add_main_cats"
        })
        .state({
            name: "admin_category",
            url: "/admin/categories/{id:int}",
            templateUrl: "/app/components/admin/categories/main/display_one/display_one.tpl.html",
            controller: "MainCategoryCtrl",
            controllerAs: "main_cat"
        })
        .state({
            name: "admin_add_subcategory",
            url: "/admin/subcategories/add",
            templateUrl: "/app/components/admin/categories/subcategories/add/add.tpl.html",
            controller: "AdminAddSubCategoryCtrl",
            controllerAs: "add_sub_cat"
        })
        .state({
            name: "admin_subcategories",
            url: "/admin/subcategories",
            templateUrl: "/app/components/admin/categories/subcategories/display/subcategories_all.tpl.html",
            controller: "AdminSubCategoriesCtrl",
            controllerAs: "sub_cats"

        })
        .state({
            name:"admin_subcategory",
            url: "/admin/subcategories/{id:int}",
            templateUrl:"/app/components/admin/categories/subcategories/display_one/display_one.tpl.html",
            controller:"AdminSubCategoryCtrl",
            controllerAs: "sub_cat"
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
        
        
        
    }]);
    app.filter('dateFormat', function myDateFormat($filter){
        return function(text){
            if(!text){
                return;
            }
            var  tempdate= new Date(text.replace(/-/g,"/"));
            return $filter('date')(tempdate, "dd MMMM yyyy");
        };
      })

    

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
                
                


                if($state.is("admin_dashboard") || $state.is("admin_categories") || $state.is("admin_add_categories") || $state.is("admin_category") || $state.is("admin_add_subcategory")|| $state.is("admin_subcategories") || $state.is("admin_subcategory"))
                {
                    $rootScope.toggleCp = true;
                } else {
                    $rootScope.toggleCp = false;
                }
            }, function (response) {
                
            });
            
        });
        
    });


    
    

})(angular);
