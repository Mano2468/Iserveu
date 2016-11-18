(function() {
	'use strict';

	var Providercontroller = function($scope, $rootScope, $uibModal,
			ProviderFactory, $filter, AlertDialogFactory) {
		$scope.animationsEnabled = true;
		$scope.schemeObj = {};
		$scope.schemeForm = {};
		$scope.updateallowed = false;
		$scope.noEditFlag = true;
		var schemeObjoriginal = angular.copy($scope.schemeObj);
		$scope.datafetchflag = false;
		$scope.providerId = null;
		console.log("provider controller");

		var Provider = function() {
			$scope.providermodel.pname = $filter('uppercase')(
					$scope.providermodel.pname);
			ProviderFactory.PostProvider($scope.providermodel.ptype,
					$scope.providermodel.pname, $scope.providerId,
					$scope.provider_code).then(function(successresponse) {
				console.log("success posting");
				console.log(successresponse);
				$rootScope.$broadcast('updateBasePackage', "");
				$scope.Providerlist = successresponse.data;
			}, function(errormessage) {
				console.log(errormessage);
			});
		};

		// used for editing existing provider
		$scope.open = function(providerdata) {
			$scope.providerId = providerdata.id;
			$scope.provider_Name = providerdata.providerName;
			$scope.provider_type = providerdata.providerType;
			$scope.provider_code = providerdata.providerCode;
			console.log($scope.provider_name);
			var editModalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'myModalContent.html',
				controller : 'ModalInstanceCtrl',
				resolve : {
					nameData : function() {
						return $scope.provider_Name;
					},
					typeData : function() {
						return $scope.provider_type;
					},
					codeData : function() {
						return $scope.provider_code;
					}
				}
			});

			editModalInstance.result.then(function(providerModalData) {
				$scope.providermodel = providerModalData;
				Provider();
			}, function() {
				console.log("Modal dismissed");
			});
		};
		// used for adding new provider data
		$scope.open1 = function() {
			$scope.providerId = null;
			var addModalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'myModalContent1.html',
				controller : 'ModalInstanceCtrl',
				resolve : {
					nameData : function() {
						return null;
					},
					typeData : function() {
						return null;
					},
					codeData : function() {
						return null;
					}
				}
			});

			addModalInstance.result.then(function(providerModalData) {
				$scope.providermodel = providerModalData;
				$scope.provider_code = $scope.providermodel.pcode;
				Provider();
			}, function() {
				console.log("Modal dismissed");
			});
		};

		$scope.toggleAnimation = function() {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};

		$scope.getdirectChildren = function() {
			$scope.datafetchflag = true;
			ProviderFactory.getDirectChildren().then(function(success) {
				$scope.datafetchflag = false;
				$scope.directChildren = success.data;
				console.log($scope.directChildren);
			}, function(error) {
				$scope.datafetchflag = false;

			});
		};
		$scope.getServiceProviders = function() {
			// if ($scope.selectedSchemeObj.userId == null
			// 		|| $scope.selectedSchemeObj == null)
			// 	return;
			$scope.datafetchflag = true;
			ProviderFactory.getAssignedServiceProviders(
					$scope.selectedSchemeObj.userId).then(function(success) {
				$scope.datafetchflag = false;
				$scope.assignedServiceProviders = success.data;
				console.log($scope.assignedServiceProviders);
			}, function(error) {
				$scope.datafetchflag = false;

			});
		};
		$scope.noupdateFlag = true;
		$scope.setUpdateflag = function(data) {
			$scope.noupdateFlag = data;
		}
		$scope.getScheme = function(userId, providerId) {
			$scope.datafetchflag = true;
			ProviderFactory.getSchemes(userId, providerId).then(
					function(success) {
						$scope.datafetchflag = false;
						$scope.schemeObj.scheme = success.data;
						console.log($scope.schemeObj);

					}, function(error) {
						$scope.datafetchflag = false;
						console.log(error);

					});
		};

		$scope.updateScheme = function(validity) {
			if (!validity)
				return;
			console.log($scope.assignedServiceProviders);
			$scope.datafetchflag = true;
			ProviderFactory.updateSchemes($scope.selectedSchemeObj,
					$scope.assignedServiceProviders).then(
					function(success) {
						$scope.assignedServiceProviders = success.data;
						$scope.datafetchflag = false;
						console.log(success);
						$scope.setUpdateflag(true);
						AlertDialogFactory.showAlert("update Success ...",
								$scope);
					},
					function(errorresponse) {
						$scope.datafetchflag = false;
						console.log(errorresponse);
						AlertDialogFactory.showAlert(
								"Failed to update Try Again ...", $scope);

					});
		};

		$scope.CheckValideCharge = function(TxnType, Owncharge, charge) {
			if (TxnType) {
				if (Owncharge <= charge) {
					return false;
				} else {
					return true;
				}
			} else {
				if (Owncharge >= charge) {
					return false;
				} else {
					return true;
				}
			}
		};
		// $scope.editPackageData = function(basepackdata) {
		// $scope.model = angular.copy(basepackdata);
		// };

		// $scope.save = function(idx) {
		// $scope.updateallowed = true;
		// $scope.noEditFlag = false;
		// $scope.editFlag = true;
		// };

		// $scope.reset = function() {
		// $scope.model = {};
		// };

		// $scope.canSubmit = function(form) {
		// $scope.schemeForm = form;
		// return (form.$valid && !angular.equals($scope.schemeObj,
		// schemeObjoriginal));
		// };

	};

	Providercontroller.$inject = [ '$scope', '$rootScope', '$uibModal',
			'ProviderFactory', '$filter', 'AlertDialogFactory' ];

	angular.module('app').controller('Providercontroller', Providercontroller);
}());
