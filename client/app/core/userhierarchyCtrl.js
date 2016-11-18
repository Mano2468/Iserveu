(function() {
	'use strict';

	var UserHierarchyCtrl = function($scope, $http, AlertDialogFactory,API) {

		$scope.UserHierarchyModel = {};
		$scope.submitFlag = true;
		$scope.mappingflag = false;

		var Alist = function() {
			$http({
				method : 'POST',
				url : API+'getalladminusers.json',
				contentType : 'application/json',
			}).then(function(successresponse) {
				console.log(successresponse);
				$scope.AdminList = successresponse.data.alladminIdandNames;
			}, function(errorresponse) {
				console.log(errorresponse);
			});
		};

		$scope.DRlist = function(AdminName) {

			if (AdminName.id) {
				$scope.mappingflag = true;
				$http({
					method : 'POST',
					url : API+'getUserTree/' + AdminName.id + '.json',
					contentType : 'application/json',
				})
						.then(
								function(successresponse) {
									$scope.mappingflag = false;
									console.log(successresponse);
									$scope.DistributorRetailerList = successresponse.data.distributorRetailer;
									$scope.AdminMaster = successresponse.data.adminMater;
									$scope.AdminDistributorMS = successresponse.data.adminMasterDistributor;
								}, function(errorresponse) {
									$scope.mappingflag = false;
									console.log(errorresponse);
								});
			}
		}
		$scope.CheckDR = function(data) {
			console.log(data);
			if (data.userRole == "ROLE_DISTRIBUTOR") {
				$scope.Parentlist = $scope.AdminMaster;
			}
			if (data.userRole == "ROLE_RETAILER") {
				$scope.Parentlist = $scope.AdminDistributorMS;
			}
		}

		$scope.MappingData = function(mappingRequest) {
			console.log(mappingRequest);
            $scope.mappingflag = true;
			var mappingRequest = JSON.stringify({
				'adminUser' : mappingRequest.Adminmodel,
				'childUser' : mappingRequest.DRmodel,
				'parentUser' : mappingRequest.Pmodel
			});
			$http({
				method : 'POST',
				url : API+'mapuser.json',
				data : mappingRequest,
				contentType : 'application/json',
			}).then(
					function(successresponse) {
						$scope.mappingflag = false;
						$scope.UserHierarchyModel.DRmodel = "";
						$scope.UserHierarchyModel.Pmodel = "";
						console.log(successresponse);
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
					},
					function(errorresponse) {
						$scope.mappingflag = false;
						console.log(errorresponse);
						AlertDialogFactory.showAlert(errorresponse.data.statusDesc,
								$scope);
					});

		};

		$scope.$watchCollection('UserHierarchyModel', function(currentval,
				oldval) {
			if ($scope.UserHierarchyModel.Pmodel != ''
					&& $scope.UserHierarchyModel.Pmodel != null) {
				$scope.submitFlag = false;
			}
			if (currentval.Adminmodel != oldval.Adminmodel) {
				$scope.UserHierarchyModel.DRmodel = "";
				$scope.submitFlag = true;
			}
			if (currentval.DRmodel != oldval.DRmodel) {
				$scope.UserHierarchyModel.Pmodel = "";
				$scope.submitFlag = true;
			}
			if ($scope.UserHierarchyModel.Pmodel == "") {
				$scope.submitFlag = true;
			}
		});

		Alist();
	};

	UserHierarchyCtrl.$inject = [ '$scope', '$http', 'AlertDialogFactory' ,'API'];
	angular.module('app').controller('UserHierarchyCtrl', UserHierarchyCtrl);
}());
