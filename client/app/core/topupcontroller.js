(function() {
  'use strict';

  var TopUpcontroller = function($scope,$http,$location,AddBenefactory,AlertDialogFactory,API) {
    $scope.topupmodel={};

     var original;

        $scope.topupmodel = {
            toupup: ''
        }

        original = angular.copy($scope.topupmodel);
        $scope.canSubmit = function(fun) {
            return fun && !angular.equals($scope.topupmodel, original);
        };


    $scope.progressbarflag = false;
        $scope.progressbar = function(flag) {
            $scope.progressbarflag = flag;
        }


    $scope.TopUp = function(){
      $scope.progressbar(true);
        var BeneCardNo = AddBenefactory.getBeneData();
        var mobileno = AddBenefactory.getmobileno();
        var Securitykey = AddBenefactory.getBeneKey();
              var TopUpobj = JSON.stringify({
                   'cardNo': BeneCardNo,
                   'topupAmount': $scope.topupmodel.toupup,
                   'mobile' : mobileno,
                   'securityKey': Securitykey
               });
               console.log(TopUpobj);
               if(mobileno != null)
               {
                $http({
                   method : 'POST',
                   url : API+'topup.json',
                   contentType : 'application/json',
                   data : TopUpobj,
                      }).then( function(successresponse){
                         console.log(successresponse);
                         AlertDialogFactory.showAlert("TOPUP SUCCESS", $scope);
                         $scope.$emit("updateBalanceTrx", {message : "update"});
                         $location.path("page/benedetails");
                      },function(errorresponse){
                        $scope.progressbar(false);
                        AlertDialogFactory.showAlert(errorresponse.data.status, $scope);
                      }
                      );
                    } else{

                        $location.path("page/moneytransfersignin");
                    }
    };

    var TopupBalance = function(){
        var BeneCardNo = AddBenefactory.getBeneData();
            var TopUpobj = JSON.stringify({
                 'cardNo': BeneCardNo
             });
             console.log(TopUpobj);
             if(BeneCardNo != null){
              $http({
                 method : 'POST',
                 url : API+'cashchecktopuplimit.json',
                 contentType : 'application/json',
                 data : TopUpobj,
                    }).then( function(successresponse){
                       console.log(successresponse);
                       $scope.topupdata = successresponse.data;

                    },function(errorresponse){

                    }
                    );
                  } else{
                    AlertDialogFactory.showAlert("login expired", $scope);
                     $location.path("page/404");
                  }

     };

     TopupBalance();
  };

  TopUpcontroller.$inject = [ '$scope','$http','$location','AddBenefactory','AlertDialogFactory','API'];
  angular.module('app').controller('TopUpcontroller', TopUpcontroller);
}());
