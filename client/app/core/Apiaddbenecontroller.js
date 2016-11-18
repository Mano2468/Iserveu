(function() {
    'use strict';

    var ApiAddBenecontroller = function($scope,ApiAddBenefactory,DummyBanklist,AlertDialogFactory,$location,$http,API) {
        $scope.AddBenemodel={};

//       var original;
//
//        $scope.AddBenemodel= {
//          BeneName:'',
//          Benemobile:'',
//            Type: '',
//            Choose: '',
//            Bname: '',
//            Accno: '',
//            State: '',
//            City: '',
//            Branch: '',
//            Ifsc: ''
//        }
//
//        original = angular.copy($scope.AddBenemodel);
//        $scope.canSubmit = function(f1) {
//            return f1 && !angular.equals($scope.AddBenemodel, original);
//        };
//        $scope.submitForm = function() {
//            $scope.showInfoOnSubmit = true;
//            return $scope.revert();
//        };

        $scope.progressbarflag = false;
        $scope.progressbar = function(flag) {
            $scope.progressbarflag = flag;
        }

        // $scope.$watch('AddBenemodel.Bname', function(currentval, oldval) {
        //     if(($scope.banknamelist == null) && (currentval == null)) return;
        //     if(typeof currentval == "object") {
        //         $scope.AddBenemodel.Ifsc = currentval["BANK CODE"];
        //     } else {
        //         $scope.AddBenemodel.Ifsc = "";
        //     }
        // });
        $scope.AddBene = function(){
            $scope.progressbar(true);
            ApiAddBenefactory.postbene($scope.AddBenemodel.Type,$scope.AddBenemodel.Choose,
            $scope.AddBenemodel.BeneName,$scope.AddBenemodel.Benemobile,
            $scope.AddBenemodel.Bname,$scope.AddBenemodel.Accno,
            $scope.AddBenemodel.State,$scope.AddBenemodel.City,
            $scope.AddBenemodel.Branch,$scope.AddBenemodel.Ifsc)
            .then(function(successresponse){
                console.log(successresponse);
                AlertDialogFactory.showAlert("Bene Added successfully", $scope);
                $location.path("page/Apibenedetails");
            },function(errorresponse) {
                $scope.progressbar(false);
                AlertDialogFactory.showAlert(errorresponse.data.status, $scope);
//               $location.path("/page/addbene");
           });
        };

            $scope.validIfsc = function(addbene_form) {
            var ifscobj = JSON.stringify({
                'ifsc' : $scope.AddBenemodel.Ifsc,
            });
            console.log(ifscobj);

            $scope.progressbar(true);
            $http({
                method : 'POST',
                url : API + 'bank.json',
                contentType : 'application/json',
                data : ifscobj,
            })
                    .then(
                            function(successresponse) {
                                console.log(successresponse);
                                if (successresponse.data.ifsc !=null) {

                                    $scope.progressbar(false);
                                    addbene_form.ifsc.$setValidity("error",
                                            true);
                                    $scope.Ifsceflag = false;
                                    console.log(successresponse.data.ifsc);
                                    $scope.AddBenemodel.Bname = successresponse.data.bank;
                                    $scope.AddBenemodel.State = successresponse.data.state;
                                    $scope.AddBenemodel.City = successresponse.data.city;
                                    $scope.AddBenemodel.Branch = successresponse.data.branch;

                                } else {
                                    $scope.progressbar(false);
                                    addbene_form.ifsc.$setValidity("error",
                                            false);
                                    $scope.Ifsceflag = true;
                                    AlertDialogFactory.showAlert(
                                            "IFSC CODE NOT FOUND!!", $scope);

                                }
                            },
                            function(errorresponse) {
                                console.log(errorresponse);
                                AlertDialogFactory
                                        .showAlert(
                                                "Some error occured while fetching IFSC Code.",
                                                $scope);

                            });

        }
    };

    ApiAddBenecontroller.$inject = [ '$scope','ApiAddBenefactory','DummyBanklist','AlertDialogFactory','$location','$http','API'];
    angular.module('app').controller('ApiAddBenecontroller', ApiAddBenecontroller);
}());
