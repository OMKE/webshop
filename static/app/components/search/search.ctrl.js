(function (angular) {
    angular.module("app").controller("SearchCtrl", ["$http", "$state", "$rootScope", "$location", function ($http, $state, $rootScope, $location) {
        
    
        let that = this;

        this.host = "https://" + $location.host() + ":" + $location.port(); // dynamic for localhost, when in production delete port
        
        this.params = '';
        this.warning_message = '';
        $rootScope.results = [];

        this.searchProducts = function (params) {

            if($state.is('edit_user') || $state.is("edit_user_image")){
                that.warning_message = 'Search is not available while editing';
                setTimeout(() =>{
                    that.warning_message = '';
                }, 1000);
                return;
            }

            if(params.length >= 2){
                $http.get(`/api/search/${params}`).then(function (response) {
                    if(response.data){
                        $rootScope.results = response.data;
                        $state.go('search');
                    } else if(response.status == 205) {
                        $rootScope.results = false;
                        $state.go('search');
                    }
                    
                }, function (response) {
                    // catch 
                })
            } 
            else if(params.length == 0){
                $state.go('home');
            }
        }

        
        

        

    }]);
})(angular);