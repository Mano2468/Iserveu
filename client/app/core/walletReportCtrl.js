(function() {
	'use strict';
	var AdminWalletController = function($http, $scope, $rootScope, $filter,
			$location, AlertDialogFactory, TabledataFilterFact,API) {
		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};



		$scope.listFlag = false;
		$scope.AdminfieldFlag = false;
		$scope.adminwalletModel = {};
		var original;
		$scope.searchflag = true;
		$scope.adminwalletModel = {
			from_Date :  new Date(),
			to_Date :  new Date(),
			transaction_Type : ''
		}
		original = angular.copy($scope.adminwalletModel);
		$scope.todaysDate = new Date();
		$scope.minDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth() - 3, $scope.todaysDate.getDate());
		$scope.maxDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth(), $scope.todaysDate.getDate());
		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.adminwalletModel, original);
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

		$scope.totalTransaction = 0;
		// move to factory as common functionality
		function TransactionTotalExtract() {
			$scope.totalTransaction = 0;
			for ( var store_obj in $scope.filteredStores) {
				if ($scope.filteredStores[store_obj].transactionType == "CREDIT") {
					$scope.totalTransaction += $scope.filteredStores[store_obj].amountTransacted;
				} else {
					$scope.totalTransaction -= $scope.filteredStores[store_obj].amountTransacted;
				}
			}
			$scope.totalTransaction = $scope.totalTransaction.toFixed(2);

		}
		;
		var getAdmin = function() {
			$scope.Admindatafetch(true);
			// var adminwallet = {};
			// $http.get('user/getuserprofile.json', {
			// params : adminwallet
			// })
			$http({
				method : 'POST',
				url : API+'getalladminusers.json',
				contentType : 'application/json',
			// data: WalletObj,
			}).then(function(successresponse) {
				$scope.Admindatafetch(false);
				$scope.listFlag = true;
				$scope.AdminList = successresponse.data.alladminIdandNames;
			}, function(errorresponse) {
				$scope.Admindatafetch(false);
				// AlertDialogFactory.showAlert(
				// errorresponse, $scope);
			})
		};

		$scope.Admindatafetchflag = false;
		$scope.Admindatafetchflag1 = false;
		$scope.Admindatafetch = function(flag) {
			$scope.Admindatafetchflag = flag;
		}
		$scope.Admindatafetch1 = function(flag) {
			$scope.Admindatafetchflag1 = flag;
		}

		$scope.WalletReportSubmit = function() {
			$scope.Admindatafetch1(true);
			var fromDate = DateToString($scope.adminwalletModel.from_Date);
			var toDate = DateToString(new Date($scope.adminwalletModel.to_Date
					.getFullYear(), $scope.adminwalletModel.to_Date.getMonth(),
					$scope.adminwalletModel.to_Date.getDate() + 1));
			var WalletObj = JSON.stringify({
				'toDate' : toDate,
				'fromDate' : fromDate,
				'adminUserId' : $scope.adminwalletModel.Childtransaction_Type.userId
			});
			console.log(WalletObj);
			$http({
				method : 'POST',
				url : API+'getachildswalletreport.json',
				contentType : 'application/json',
				data : WalletObj,
			})
					.then(
							function(successresponse) {
								console.log(successresponse);
								$scope.Admindatafetch1(false);
								$scope.stores = successresponse.data.walletReport;
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
								$scope.numPerPageOpt = [ 3, 5, 10, 20, 50, 100,
										200 ];
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
									$scope.totalTransaction = 0;
									TransactionTotalExtract();
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
								$scope.Admindatafetch1(false);
								AlertDialogFactory.showAlert(
										errorresponse.data.statusDesc, $scope);
							});
		};
		$scope.getChild = function(id) {
			$scope.Admindatafetch(true);
			$http({
				method : 'GET',
				url : API + 'getchildren/' +id+""+ '.json',
				contentType : 'application/json',
			}).then(function(successresponse) {

				$scope.Admindatafetch(false);
				$scope.listFlag = true;
				$scope.ChildList = successresponse.data;
			}, function(errorresponse) {
				$scope.Admindatafetch(false);
				// AlertDialogFactory.showAlert(
				// errorresponse, $scope);
			})
		};
		$scope.$watch('adminwalletModel.transaction_Type', function(currentval, oldval) {
			$scope.plans = false;
			if ($scope.adminwalletModel.transaction_Type.adminUserName ==''
					|| $scope.adminwalletModel.transaction_Type.adminUserName == null
					|| currentval != oldval) {
				$scope.adminwalletModel.Childtransaction_Type = "";

			}
		});
		var GetAllUser = function() {
			if ($rootScope.usertype == 'ROLE_SUPER_ADMIN') {
				getAdmin();
			} else {
				$scope.getChild("");
				$scope.AdminfieldFlag = true;
			}
		};
		GetAllUser();
	};
	AdminWalletController.$inject = [ '$http', '$scope', '$rootScope',
			'$filter', '$location', 'AlertDialogFactory', 'TabledataFilterFact','API' ];
	angular.module('app').controller('AdminWalletController',
			AdminWalletController);
}());
