(function() {
    'use strict';

    var SignIncontroller = function($scope, $http, $location, AddBenefactory, AlertDialogFactory,API) {
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
            $location.path("/nonkycregisterform");
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
                url: API+'cashlogin.json',
                contentType: 'application/json',
                data: signinobj,
            }).then(function(successresponse) {
                $scope.progressbar(false);
                $scope.logindata = successresponse.data;
                $scope.key = successresponse.data.securitykey;
                console.log($scope.logindata.cardno);
                AddBenefactory.BeneKey($scope.key);
                AddBenefactory.BeneData($scope.logindata.cardno);
                AddBenefactory.MobileNo($scope.logindata.mobile);
                // AlertDialogFactory.showAlert("LOGIN SUCCESS", $scope);
                $location.path("/benedetails");
            }, function(errorresponse) {
                AlertDialogFactory.showAlert(errorresponse.data.status, $scope);
                $scope.progressbar(false);
            });

        };

    };

    SignIncontroller.$inject = ['$scope', '$http', '$location', 'AddBenefactory', 'AlertDialogFactory','API'];
    angular.module('app').controller('SignIncontroller', SignIncontroller);
}());
