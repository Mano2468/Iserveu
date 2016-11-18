(function() {
	'use strict';
	var MoneyTransactionController = function($http, $scope, $location,
			$filter, AlertDialogFactory, AddBenefactory,API) {
		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};
		$scope.TransModel = {};
		var original;
		$scope.TransModel = {
			transactionType : '',
			transactionMode : '',
			fromDate : '',
			toDate : ''
		}
		original = angular.copy($scope.TransModel);
		$scope.todaysDate = new Date();
		$scope.minDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth() - 3, $scope.todaysDate.getDate());
		$scope.maxDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth(), $scope.todaysDate.getDate());
		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.TransModel, original);
		};
		var DateToString = function(date) {
			// return moment(date).format('YYYY-MM-DD');
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
		$scope.Agenttransaction = function() {
			var CardNo = AddBenefactory.getBeneData();
			if (!(CardNo == null)) {
				$location.path("page/agenttransaction");
			} else {
				AlertDialogFactory.showAlert("Timeout", $scope);
				$location.path("page/404");
			}
		};

		$scope.datafetchflag = false;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}

		$scope.MoneyTransactionSubmit = function() {
			$scope.showdatafetch(true);
			var CardNo = AddBenefactory.getBeneData();
			var fromDate = DateToString($scope.TransModel.fromDate);
			var toDate = DateToString($scope.TransModel.toDate);
			var TransactionObj = JSON.stringify({
				'cardNo' : CardNo,
				'transType' : $scope.TransModel.transactionType,
				'transMode' : $scope.TransModel.transactionMode,
				'toDate' : toDate,
				'fromDate' : fromDate
			});

			if (CardNo != null) {
				console.log(TransactionObj);
				$http({
					method : 'POST',
					url : API+'cashtransactionhistory.json',
					contentType : 'application/json',
					data : TransactionObj,
				})
						.then(
								function(successresponse) {
									$scope.showdatafetch(false);
									console.log(successresponse);
									$scope.stores = successresponse.data.item;
									// var init;
									// $scope.filteredStores = [];
									// $scope.select = select;
									// $scope.numPerPageOpt = [3, 5, 10, 20];
									// $scope.numPerPage =
									// $scope.numPerPageOpt[2];
									// $scope.currentPage = 1;
									// $scope.currentPage = [];
									// ////
									// function select(page) {
									// var end, start;
									// start = (page - 1) * $scope.numPerPage;
									// end = start + $scope.numPerPage;
									// return $scope.currentPageStores =
									// $scope.filteredStores.slice(start, end);
									// };

									// function onNumPerPageChange() {
									// $scope.select(1);
									// return $scope.currentPage = 1;
									// };
									// init = function() {
									// $scope.currentPage = 1;
									// $scope.filteredStores =
									// $filter('filter')($scope.stores);
									// return $scope.select($scope.currentPage);

									// };
									// init();

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
									$scope.numPerPageOpt = [ 3, 5, 10, 20, 50,
											100 ];
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
										$scope.filteredStores = $filter(
												'filter')($scope.stores,
												$scope.searchKeywords);
										return $scope.onFilterChange();
									}
									;

									function order(rowName) {
										if ($scope.row === rowName) {
											return;
										}
										$scope.row = rowName;
										$scope.filteredStores = $filter(
												'orderBy')($scope.stores,
												rowName);
										return $scope.onOrderChange();
									}
									;

									init = function() {
										$scope.search();
										return $scope
												.select($scope.currentPage);
									};
									init();

								},
								function(errorresponse) {
									$scope.showdatafetch(false);
									AlertDialogFactory.showAlert(
											errorresponse.data.status, $scope);
								});
			} else {
				$location.path("page/404");
				AlertDialogFactory.showAlert("Login Expired", $scope)
			}
		};
	};
	MoneyTransactionController.$inject = [ '$http', '$scope', '$location',
			'$filter', 'AlertDialogFactory', 'AddBenefactory','API'];
	angular.module('app').controller('MoneyTransactionController',
			MoneyTransactionController);
}());
