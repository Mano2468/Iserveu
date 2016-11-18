(function() {
	'use strict';

	var AddFeatureController = function($scope, $rootScope, $filter, $uibModal,
			AddFeatureFactory, AlertDialogFactory) {
		var original;
		var init;
		$scope.editflag = false;
		$scope.featureUnique = {};
		$scope.feature = {
			featureName : '',
			featureDescription : ''
		};

		$scope.searchflag = true;
		$scope.readonly = false;
		$scope.tags = [];
		$scope.datafetchflag = false;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}

		original = angular.copy($scope.feature);
		$scope.revert = function() {
			$scope.feature = angular.copy(original);
			$scope.form_add_feature.$setPristine();
			$scope.form_add_feature.$setUntouched();
			return;
		};
		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};

		$scope.AdvancedSearch = function(currentsearch) {
			$scope.filteredStores = TabledataFilterFact.AdvancedFilter(
					$scope.stores, currentsearch);
			$scope.onFilterChange();
		};
		$scope.$watch('searchflag', function(currentvalue, oldvalue) {
			// reset the search fields for both the search
			$scope.searchKeywords = null;
			$scope.tags = [];
			$scope.currentPageStores = $scope.stores;
		});

		$scope.canRevert = function() {
			return !angular.equals($scope.feature, original)
					|| !$scope.form_add_feature.$pristine;
		};
		$scope.canSubmit = function() {
			return $scope.form_add_feature.$valid
					&& !angular.equals($scope.feature, original);
		};
		$scope.featureSubmit = function() {
			$scope.showInfoOnSubmit = true;
			$scope.datafetchflag = true;
			AddFeatureFactory.Postaddfeature($scope.feature.featureName,
					$scope.feature.featureDescription).then(
					function(featureresponse) {
						$scope.datafetchflag = false;
						AlertDialogFactory.showAlert(
								featureresponse.data.statusDesc, $scope);
						$scope.revert();
					},
					function(errormessage) {
						$scope.datafetchflag = false;
						AlertDialogFactory.showAlert(
								errormessage.data.statusDesc, $scope);
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
				console.log(providerModalData);
				$scope.providermodel = providerModalData;
				$scope.featureUnique.serviceProvider.push({
					"id" : "",
					"providerName" : $scope.providermodel.pname,
					"providerType" : $scope.providermodel.ptype,
					"providerCode" : $scope.providermodel.pcode
				});

				console.log($scope.featureUnique);
				$scope.updateFeature($scope.featureUnique);
				$scope.editflag = false;
				// updates the table local store
				$scope.stores = $scope.featureUnique.serviceProvider;
				$scope.searchKeywords = '';
				$scope.filteredStores = [];
				$scope.row = '';
				$scope.numPerPageOpt = [ 3, 5, 10, 20 ];
				$scope.numPerPage = $scope.numPerPageOpt[2];
				$scope.currentPage = 1;
				$scope.currentPage = [];
				init();

			}, function() {
				console.log("failed to add");
			});
		};

		$scope.showfeaturelist = function() {
			$scope.datafetchflag = true;
			AddFeatureFactory
					.getFeatures()
					.then(
							function(featureresponse) {
								$scope.datafetchflag = false;
								$scope.stores = featureresponse.data;
								if ($scope.stores.length <= 0) {
									AlertDialogFactory.showAlert(
											"No Data Found", $scope);
								}
								$scope.showdatafetch(false);
								$scope.searchKeywords = '';
								$scope.filteredStores = [];
								$scope.row = '';
								$scope.numPerPageOpt = [ 3, 5, 10, 20 ];
								$scope.numPerPage = $scope.numPerPageOpt[2];
								$scope.currentPage = 1;
								$scope.currentPage = [];

								$scope.select = function(page) {
									var end, start;
									start = (page - 1) * $scope.numPerPage;
									end = start + $scope.numPerPage;
									return $scope.currentPageStores = $scope.filteredStores
											.slice(start, end);
								};

								$scope.onFilterChange = function() {
									$scope.select(1);
									$scope.currentPage = 1;
									return $scope.row = '';
								};

								$scope.onNumPerPageChange = function() {
									$scope.select(1);
									return $scope.currentPage = 1;
								};

								$scope.onOrderChange = function() {
									$scope.select(1);
									return $scope.currentPage = 1;
								};

								$scope.search = function() {
									$scope.filteredStores = $filter('filter')(
											$scope.stores,
											$scope.searchKeywords);
									return $scope.onFilterChange();
								};

								$scope.order = function(rowName) {
									if ($scope.row === rowName) {
										return;
									}
									$scope.row = rowName;
									$scope.filteredStores = $filter('orderBy')(
											$scope.stores, rowName);
									return $scope.onOrderChange();
								};

								init = function() {
									$scope.search();
									return $scope.select($scope.currentPage);
								};

								init();

							},
							function() {
								$scope.datafetchflag = false;
								AlertDialogFactory.showAlert(
										"Some Error Occured!!", $scope);
							});
		};

		$scope.editFeature = function(featureObj) {
			$scope.editflag = true;
			console.log(featureObj);
			$scope.featureUnique = featureObj;
			$scope.stores = featureObj.serviceProvider;
			init();
		};

		$scope.updateFeature = function(featureObj) {
			$scope.datafetchflag = true;
			AddFeatureFactory.PostUpdateFeature(featureObj).then(
					function(succes) {
						$scope.datafetchflag = false;
						$scope.editflag = false;
						$scope.showfeaturelist();
						AlertDialogFactory.showAlert(succes.data.statusDesc,
								$scope);

					},
					function(error) {
						$scope.datafetchflag = false;
						$scope.showfeaturelist();
						$scope.editflag = false;
						AlertDialogFactory.showAlert("ERROR"
								+ error.data.statusDesc, $scope);
					});
		};

	};

	AddFeatureController.$inject = [ '$scope', '$rootScope', '$filter',
			'$uibModal', 'AddFeatureFactory', 'AlertDialogFactory' ];
	angular.module('app').controller('AddFeatureController',
			AddFeatureController);
}());
