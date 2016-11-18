(function() {
    'use strict';

    var ApiSignIncontroller = function($scope, $http, $location, ApiAddBenefactory, AlertDialogFactory,API) {
        $scope.signinmodel = {};

        var original;

        $scope.signinmodel = {
            phone: '',
            pin: ''
        }

        original = angular.copy($scope.signinmodel);
        $scope.canSubmit = function(fun) {
            return fun && !angular.equals($scope.signinmodel, original);
        };

        $scope.Signup = function() {
            $location.path("page/Apinonkycregisterform");
        };

        $scope.progressbarflag = false;
        $scope.progressbar = function(flag) {
            $scope.progressbarflag = flag;
        }

        $scope.SignIn = function() {
            $scope.progressbar(true)
            var signinobj = JSON.stringify({
                'phone': $scope.signinmodel.phone,
                'pin': $scope.signinmodel.pin
            });

            console.log(signinobj);
            $http({
                method: 'POST',
                url: API+'dcashlogin.json',
                contentType: 'application/json',
                data: signinobj,
            }).then(function(successresponse) {
                $scope.progressbar(false);
                $scope.logindata = successresponse.data;
                $scope.key = successresponse.data.securitykey;
                console.log($scope.logindata.cardno);
                ApiAddBenefactory.BeneKey($scope.key);
                ApiAddBenefactory.BeneData($scope.logindata.cardno);
                ApiAddBenefactory.MobileNo($scope.logindata.mobile);
                // AlertDialogFactory.showAlert("LOGIN SUCCESS", $scope);
                $location.path("page/Apibenedetails");
            }, function(errorresponse) {
                AlertDialogFactory.showAlert(errorresponse.data.status, $scope);
                $scope.progressbar(false);
            });

        };

    };

    ApiSignIncontroller.$inject = ['$scope', '$http', '$location', 'ApiAddBenefactory', 'AlertDialogFactory','API'];
    angular.module('app').controller('ApiSignIncontroller', ApiSignIncontroller);
}());
