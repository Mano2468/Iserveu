(function() {
	'use strict';

	var RefundStatusControl = function($http, $rootScope, $scope, $filter, AlertDialogFactory,
		 TabledataFilterFact,API) {

		$scope.RefundStatusModel = {};
		var original;


		$scope.searchflag = true;
		$scope.RefundStatusModel = {
			TransactionType : '',
			fromDate :  new Date(),
			toDate :  new Date()
		}

		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};

		$scope.refundstatusflag = false;
		$scope.refundstatus = function(flag) {
			$scope.refundstatusflag = flag;
		}

		if ($rootScope.usertype === "ROLE_ADMIN") {
			$scope.userTransactionTypeList = [ "RECHARGE", "TRAVEL",
					"FUND TRANSFER" ];
		} else if ($rootScope.usertype === "ROLE_RETAILER") {
			$scope.userTransactionTypeList = [ "RECHARGE", "TRAVEL",
					"FUND TRANSFER" ];
		} else if ($rootScope.usertype === "ROLE_USER") {
			$scope.userTransactionTypeList = [ "API FUND TRANSFER" ];
		}

		original = angular.copy($scope.RefundStatusModel);

		$scope.todaysDate = new Date();
		$scope.minDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth() - 3, $scope.todaysDate.getDate());
		$scope.maxDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth(), $scope.todaysDate.getDate());

		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.RefundStatusModel, original);
		};

		var DateToString = function(date) {
			if (date != null) {
				var month = '' + (date.getMonth() + 1);
				var day = '' + date.getDate();
				var year = date.getFullYear();

				if (month.length < 2)
					month = '0' + month;
				if (day.length < 2)
					day = '0' + day;

				return [ year, month, day ].join('-');
			} else {
				return "";
			}
		};

		// for get Advanced filter data using chips
		$scope.readonly = false;
		$scope.tags = [];

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


		$scope.RefundStatusSubmit = function() {
			$scope.refundstatus(true);
			var fromDate = DateToString($scope.RefundStatusModel.fromDate);
			var toDate = DateToString(new Date($scope.RefundStatusModel.toDate
					.getFullYear(), $scope.RefundStatusModel.toDate.getMonth(),
					$scope.RefundStatusModel.toDate.getDate() + 1));
			var RefundStatusObj = JSON.stringify({
				'transactionType': $scope.RefundStatusModel.TransactionType,
				'toDate' : toDate,
				'fromDate' : fromDate
			});
			console.log(RefundStatusObj);
			$http({
				method : 'POST',
				url : API+'refunddetails.json',
				contentType : 'application/json',
				data : RefundStatusObj,
			})
					.then(
							function(successresponse) {
								console.log(successresponse);
								$scope.refundstatus(false);
								$scope.stores = successresponse.data.complainReport;
								var init;
								$scope.searchKeywords = '';
								$scope.filteredStores = [];
								$scope.row = '';
								$scope.select = select;
								$scope.onFilterChange = onFilterChange;
								$scope.onNumPerPageChange = onNumPerPageChange;
								$scope.onOrderChange = onOrderChange;
								$scope.search = search;
								$scope.order = order;
								$scope.numPerPageOpt = [ 3, 5, 10, 20, 50, 100 ];
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
											$scope.stores,
											$scope.searchKeywords);
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

							},
							function(errorresponse) {
								$scope.refundstatus(false);
								AlertDialogFactory.showAlert(
										errorresponse.data.status, $scope);
							});
		};
	};


	RefundStatusControl.$inject = [ '$http', '$rootScope', '$scope', '$filter', 'AlertDialogFactory', 'TabledataFilterFact','API'];
	angular.module('app').controller('RefundStatusControl', RefundStatusControl);
}());
