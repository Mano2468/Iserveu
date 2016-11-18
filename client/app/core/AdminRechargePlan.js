(function() {
	'use strict';

	var AdminRechargeController = function($scope, $http, AlertDialogFactory,API) {

		// $scope.Page = 10;
		// $scope.POption = [ 10,15,20, 30, 50];
		$scope.ServiceProviderModel = {};
		$scope.noupdateFlag = true;
		$scope.setUpdateflag = function(data) {
			$scope.noupdateFlag = data;
		}

		$scope.rechargeplanflag = false;
		$scope.rechargeplan = function(flag) {
			$scope.rechargeplanflag = flag;
		}
		var AdminRechargeOperator = function() {

			$http.get(API+'adminselectrecharge.json')
					.then(
							function(successresponse) {
								console.log(successresponse);
								var serviceProviderList = [];
								$scope.operatorList = successresponse.data.rechargeOperatorMappingList;
								$scope.ServiceProviderList = successresponse.data.serviceProviders;
							},

							function(errorresponse) {
								console.log(errorresponse);
								// AlertDialogFactory.showAlert(
								// errorresponse, $scope);
							})
		};

//

		// $scope.ServiceProvider = [];
		$scope.Updateservice = function(operators) {
			console.log(operators);
			$scope.rechargeplan(true);
			var obj = JSON.stringify({
				'requesttoSaveRechargeOperatorsAdmin' : operators
			});
			console.log(obj);
			$http({
				method : 'POST',
				url : API+'saverechargeoperators.json',
				contentType : 'application/json',
				data : obj,
			}).then(function(successresponse) {
				$scope.rechargeplan(false);
				$scope.setUpdateflag(true);
				AdminRechargeOperator();
				AlertDialogFactory.showAlert(successresponse.data.statusDesc,
						$scope);
				console.log(successresponse);
			}, function(errorresponse) {
				$scope.rechargeplan(false);
				$scope.setUpdateflag(true);
				AlertDialogFactory.showAlert("Error Occurred",
						$scope);
				console.log(errorresponse)
			})

		}

		// getSelected()
		AdminRechargeOperator();
	};
	AdminRechargeController.$inject = [ '$scope', '$http', 'AlertDialogFactory','API' ];
	angular.module('app').controller('AdminRechargeController',
			AdminRechargeController);
}());
