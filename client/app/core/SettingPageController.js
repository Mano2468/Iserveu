(function() {
    var SettingPageCtrl = function($scope, $rootScope) {

        $scope.isAdmin = function() {
            if ($rootScope.usertype === "ROLE_ADMIN")
                return true;
            else
                return false;
        }

        $scope.isRetailer = function() {
            if ($rootScope.usertype === "ROLE_RETAILER")
                return true;
            else
                return false;
        }

        $scope.isMasterDis = function() {
            if ($rootScope.usertype === "ROLE_MASTER_DISTRIBUTOR")
                return true;
            else
                return false;
        }
        $scope.isDistributor = function() {
            if ($rootScope.usertype === "ROLE_DISTRIBUTOR")
                return true;
            else
                return false;
        }

    };
    SettingPageCtrl.$inject = ['$scope', '$rootScope'];
    angular.module('app').controller('SettingPageCtrl', SettingPageCtrl);
}());
