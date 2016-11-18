(function() {
	'use strict';

	var BalanceApprovalController = function($scope, $rootScope, $http,
			$filter, AlertDialogFactory,API) {

		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};

		$scope.options = {
				buttonDefaultText : 'Refresh',
				buttonSizeClass : 'btn-xs',
				buttonSubmittingClass : 'btn-info',
				buttonSuccessClass : 'btn-success',
				buttonErrorText : 'There was an error',
				iconsPosition : 'left',
				buttonSubmittingIcon : 'zmdi zmdi-refresh-alt'
			};
			$scope.isSubmitting = null;
			$scope.result = null;

			$scope.RefreshSubmit = function() {
				$scope.isSubmitting = true;
				fetchRequests();
			};

		var parameters = {};
		var init;
		$scope.datafetchflag = false;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}
		$scope.approveOrDecline = function(store, operation) {

			var url = API + 'admin/approveordeclinerequest.json';

			var approverequestordeclineJson = JSON.stringify({
				'requestId' : store.id,
				'operation' : operation
			});

			$scope.showdatafetch(true);
			$http({
				method : 'POST',
				url : url,
				contentType : 'application/json',
				data : approverequestordeclineJson,
			}).then(
							function(balanceresponse) {

								console.log(balanceresponse);
								if (balanceresponse.data.status === 0) {
									$rootScope.balance = balanceresponse.data.balance;
									$scope.stores = balanceresponse.data.fetchraisedRequests;
									init();
								}
								AlertDialogFactory
										.showAlert(
												balanceresponse.data.statusDesc,
												$scope);
								$scope.showdatafetch(false);

							},
							function(errorresponse) {
								$scope.showdatafetch(false);
								AlertDialogFactory.showAlert(
										"Some Error Occured", $scope);
							});

		};
		var fetchRequests=function(){
		$scope.showdatafetch(true);
		$http.get(API+'admin/fetchinterwalletrequests.json', {
			params : parameters
		}).then(
				function(successresponse) {
					$scope.showdatafetch(false);
					$scope.stores = successresponse.data.fetchraisedRequests;
					$scope.result = 'success';
					$scope.searchKeywords = '';
					$scope.filteredStores = [];
					$scope.row = '';
					$scope.select = select;
					$scope.onFilterChange = onFilterChange;
					$scope.onNumPerPageChange = onNumPerPageChange;
					$scope.onOrderChange = onOrderChange;
					$scope.search = search;
					$scope.order = order;
					$scope.numPerPageOpt = [ 3, 5, 10, 20 ];
					$scope.numPerPage = $scope.numPerPageOpt[2];
					$scope.currentPage = 1;
					$scope.currentPage = [];

					function select(page) {
						var end, start;
						start = (page - 1) * $scope.numPerPage;
						end = start + $scope.numPerPage;
						return $scope.currentPageStores = $scope.filteredStores
								.slice(start, end);
					}
					;

					function onFilterChange() {
						$scope.select(1);
						$scope.currentPage = 1;
						return $scope.row = '';
					}
					;

					function onNumPerPageChange() {
						$scope.select(1);
						return $scope.currentPage = 1;
					}
					;

					function onOrderChange() {
						$scope.select(1);
						return $scope.currentPage = 1;
					}
					;

					function search() {
						$scope.filteredStores = $filter('filter')(
								$scope.stores, $scope.searchKeywords);
						return $scope.onFilterChange();
					}
					;

					function order(rowName) {
						if ($scope.row === rowName) {
							return;
						}
						$scope.row = rowName;
						$scope.filteredStores = $filter('orderBy')(
								$scope.stores, rowName);
						return $scope.onOrderChange();
					}
					;

					init = function() {
						$scope.search();
						return $scope.select($scope.currentPage);
					};

					init();

				}, function(errorresponse) {
					$scope.showdatafetch(false);
					AlertDialogFactory.showAlert("Some Error Occured", $scope);
				});
		};
		fetchRequests();
	};

	BalanceApprovalController.$inject = [ '$scope', '$rootScope', '$http',
			'$filter', 'AlertDialogFactory','API'];
	angular.module('app').controller('BalanceApprovalController',
			BalanceApprovalController);
}());
