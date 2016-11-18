(function () {
    'use strict';
    // modals controller
    var ModalInstanceCtrl = function($scope, $uibModalInstance, nameData, typeData, codeData, $http,API) {
        $scope.providermodel = {};
        if (nameData !== null) {
          $scope.providermodel.pname = nameData;
        }
        if (typeData !== null) {
          $scope.providermodel.ptype = typeData;
        }
        $scope.ok = function(validity) {
        	console.log(validity);
            if (validity && !($scope.providermodel.ptype == null)) {
                $uibModalInstance.close($scope.providermodel);
            }
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

        // check for provider exists when adding new provider in form
        $scope.validProvider = function (FormName) {
          var parameters = {};
//    			var providerCodevalidationobj = JSON.stringify({
//    				'providerCode' : $scope.providermodel.pcode
//    			});
//    			console.log(providerCodevalidationobj);
    			parameters.code = $scope.providermodel.pcode;
    			$http.get(API+'admin/isServiceProviderExists.json', {
    				params : parameters
    			}).then(
            function(response) {
            	console.log(response);
              if (response.data) {
                FormName.provider_codedat.$setValidity("code_exist",false);
                $scope.codeexists = true;
              }
              else {
                FormName.provider_codedat.$setValidity("code_exist",true);
                $scope.codeexists = false;
              }
            },
            function(errormessage) {
              console.log(errormessage);
              FormName.provider_codedat.$setValidity("code_exist",false);
            }
          );
        };

    };
    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'nameData', 'typeData', 'codeData', '$http','API'];
    angular.module('app').controller('ModalInstanceCtrl', ModalInstanceCtrl);
}());
