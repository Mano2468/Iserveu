(function() {
    var RetailSideBarCtrl = function($scope, $rootScope, AppService, store, $http) {
        var FeatureId = {};
        var FeatureExract = function() {
            if (AppService.GetUserInfoStore().userInfo.userFeature.length == 0)
                return;
            var featuredat = AppService.GetUserInfoStore().userInfo.userFeature;
            for (var index in featuredat) {
                FeatureId[featuredat[index].id] = 1;
            }
            // console.log(FeatureId);
        };
        FeatureExract();
        $scope.Featurecheck = function(id) {
            if (FeatureId[id] == null)
                return false;
            return true;
        }

        $scope.OpenLink = function() {
            // var token = store.get('jwt');
            // var url = 'http://192.168.15.105:8080/server/g2fundtransferlogin.html?verify = token'
            // window.open(url, '_blank');

            $http({
                method: 'POST',
                url: "http://192.168.15.105:8080/server/travel.html",
                contentType: 'application/json',
                headers: {
                    'Authorization': store.get('jwt'),
                }
            }).then(
                function(successResponse) {
                    console.log(successResponse);
                    // window.open(url, '_blank');
                },
                function(errorResponse) {
                    console.log(errorResponse);
                });
        }
    };
    RetailSideBarCtrl.$inject = ['$scope', '$rootScope', 'AppService', 'store', '$http'];
    angular.module('app').controller('RetailSideBarCtrl', RetailSideBarCtrl);
}());
