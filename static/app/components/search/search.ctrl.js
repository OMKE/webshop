(function (angular) {
    angular.module("app").controller("SearchCtrl", ["$http", "$state", "$rootScope", function ($http, $state, $rootScope) {
        
    
        let that = this;
        this.params = '';
        $rootScope.results = [];

        this.searchProducts = function (params) {

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