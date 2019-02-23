(function (angular) {
    angular.module("app").controller("PriceCtrl", ["$http", "$rootScope", "$cookies", function ($http, $rootScope, $cookies) {
        let that = this;
        this.products = [];
        this.priceParams = {
            minPrice: "",
            maxPrice: "",
            sort: false
        }
        
        // TODO FINISH ME

        $rootScope.isPrice = false; // when user apply to show products by price hide products coming from category

        this.apply = function () {
            if(!that.priceParams.minPrice && !that.priceParams.maxPrice){
                return;
            }
            that.priceParams.sort = true;
            // $http.post("/api/sortByPrice", that.priceParams).then(function (response) {
            //     // that.check();
            // }, function (response) {
            //     console.log(response.status);
            // })
            
        }
        this.reset = function () {
            that.priceParams.sort = false;
            let today = new Date();
            let expiresValue = new Date(today);
            expiresValue.setMinutes(today.getMinutes() + 120); 
            $cookies.put("sortByPrice", JSON.stringify(that.priceParams), {'expires': expiresValue});
        }
        this.check = function () {
            let params = that.priceParams;
            if(params.sort){
                return true;
            } else {
                return false;
            }
            
        }

        this.check();
    }])
})(angular);