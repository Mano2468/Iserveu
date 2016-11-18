(function() {
    'use strict';

    var ApiNonKycFormcontroller = function($scope, ApiNonKycFormfactory, $location, $http
      ,AlertDialogFactory,API) {
        $scope.kycnmodel = {};
        $scope.otpmodel = {};

        var original;

        // $scope.kycnmodel = {
        //     userType: '',
        //     firstName: '',
        //     middleName: '',
        //     lastName: '',
        //     Mobileno: '',
        //     Address: '',
        //     State: '',
        //     City: '',
        //     Pin: ''
        //     // date: '',
        //     // Email: ''
        // }

        // original = angular.copy($scope.kycnmodel);
        // $scope.revert = function() {
        //     $scope.kycnmodel = angular.copy(original);
        //     $scope.kyc_form.$setPristine();
        //     $scope.kyc_form.$setUntouched();
        //     return;
        // };
        // $scope.canRevert = function() {
        //     return !angular.equals($scope.kycnmodel, original) || !$scope.signin_form.$pristine;
        // };
        // $scope.canSubmit = function(f) {
        //     return f && !angular.equals($scope.kycnmodel, original);
        // };
        $scope.submitForm = function() {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };
        $scope.Home = function() {
            $location.path("page/Apimoneytransfersignin")
        };

        $scope.progressbarflag = false;
        $scope.progressbar = function(flag) {
            $scope.progressbarflag = flag;
        }

        $scope.NonKycSignIN = function() {
            $scope.progressbar(true);
            ApiNonKycFormfactory.postNonKycForm($scope.kycnmodel.userType, $scope.kycnmodel.firstName,
                $scope.kycnmodel.middleName, $scope.kycnmodel.lastName, $scope.kycnmodel.Mobileno,
                $scope.kycnmodel.Address, $scope.kycnmodel.State, $scope.kycnmodel.City,
                $scope.kycnmodel.Pin)
                .then(function(successresponse) {
                    console.log(successresponse);
                    $scope.progressbar(false);
                    $scope.registerdata = successresponse.data;
                    if (successresponse.data.statuscode == 20) {
                        $scope.tid = successresponse.data.status;
                    } else {
                        $scope.tid = $scope.registerdata.transactionid;
                    }
                    ApiNonKycFormfactory.setData($scope.tid);
                    console.log($scope.tid);
                    $location.path("page/Apiotp");
                }, function(errorresponse) {
                    console.log(errorresponse);
                    $scope.progressbar(false);
                  AlertDialogFactory.showAlert(
                            errorresponse.data.status, $scope);

                });
        };

    };

    ApiNonKycFormcontroller.$inject = ['$scope', 'ApiNonKycFormfactory', '$location', '$http','AlertDialogFactory','API'];
    angular.module('app').controller('ApiNonKycFormcontroller', ApiNonKycFormcontroller);
}());
