(function() {
	'use strict';

	var TransactionController = function($http, $rootScope, $scope, $filter,
			TransactionDetails, AlertDialogFactory, TabledataFilterFact,
			$uibModal,API) {

		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};

		$scope.raiseRefundRequest = function(store) {
			var raiseRefundModal = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'RaiseRefundMODAL.html',
				controller : 'RaiseRefundCtrl',

			});

			raiseRefundModal.result.then(function(comment) {
				var parameters = JSON.stringify({
					'id' : store.id,
					'comment' : comment
				});
				$http({
					method : 'POST',
					url : API+'user/raiserefundrequests.json',
					contentType : 'application/json',
					data : parameters,
				}).then(
						function(success) {
							AlertDialogFactory.showAlert(
									success.data.statusDesc, $scope);

						},
						function(error) {
							AlertDialogFactory.showAlert(error.data.statusDesc,
									$scope);

						});
			});

		};

		$scope.transModel = {};
		var original;
		$scope.searchflag = true;
		$scope.transModel = {
			transaction_Type : '',
			from_Date :  new Date(),
			to_Date :  new Date()
		}
		$scope.complainflag = false;
		$scope.setComplainflag = function() {
			if (($rootScope.usertype === 'ROLE_RETAILER' || $rootScope.usertype === 'ROLE_USER')
					&& ($scope.transModel.transaction_Type === "RECHARGE"
							|| $scope.transModel.transaction_Type === "TRAVEL" || $scope.transModel.transaction_Type === "FUND TRANSFER")) {
				$scope.complainflag = true;
			} else {
				$scope.complainflag = false;
			}

		}
		$scope.datafetchflag = false;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}

		// ,"API FUND TRANSFER" "RECHARGE", "TRAVEL",
		if ($rootScope.usertype === "ROLE_ADMIN") {
			$scope.userTransactionTypeList = [ "RECHARGE", "TRAVEL",
					"FUND TRANSFER", "COMMISSION", "WALLET" ];
		} else if ($rootScope.usertype === "ROLE_MASTER_DISTRIBUTOR"
				|| $rootScope.usertype === "ROLE_DISTRIBUTOR") {
			$scope.userTransactionTypeList = [ "RECHARGE", "TRAVEL",
					"FUND TRANSFER", "COMMISSION", "WALLET" ];
			$scope.userTransactionTypeList = [ "RECHARGE", "TRAVEL",
					"FUND TRANSFER", "COMMISSION", "WALLET" ];
		} else if ($rootScope.usertype === "ROLE_RETAILER") {
			$scope.userTransactionTypeList = [ "RECHARGE", "TRAVEL",
					"FUND TRANSFER", "WALLET" ];
		} else if ($rootScope.usertype === "ROLE_USER") {
			$scope.userTransactionTypeList = [ "API FUND TRANSFER", "WALLET" ];
		}

		original = angular.copy($scope.transModel);

		$scope.todaysDate = new Date();
		$scope.minDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth() - 3, $scope.todaysDate.getDate());
		$scope.maxDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth(), $scope.todaysDate.getDate());

		console.log("inside tran");

		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.transModel, original);
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

		// stores the transaction totalamount data extracted from the report
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

		// $scope.exportData = function() {
		// alasql('SELECT * INTO XLSX("wallet.xlsx",{headers:true}) FROM ?',
		// [$scope.stores]);
		// };
		// for get Advanced filter data using chips
		$scope.readonly = false;
		$scope.tags = [];
		$scope.totalFlag = "false";
		$scope.AdvancedSearch = function(currentsearch) {
			console.log(currentsearch);
			$scope.filteredStores = TabledataFilterFact.AdvancedFilter(
					$scope.stores, currentsearch);
			$scope.onFilterChange();
		};

		$scope.$watch('searchflag', function(currentvalue, oldvalue) {
			// reset the search fields for both the search
			$scope.searchKeywords = null;
			$scope.tags = [];
			$scope.currentPageStores = $scope.stores;
			$scope.searchKeywords = '';
			if ($scope.search == null)
				return;
			$scope.search();
		});
		$scope.TransactionSubmit = function() {
			console.log("inside  TransactionSubmit");
			$scope.showdatafetch(true);

			var from_Date = DateToString($scope.transModel.from_Date);
			var to_Date = DateToString(new Date($scope.transModel.to_Date
					.getFullYear(), $scope.transModel.to_Date.getMonth(),
					$scope.transModel.to_Date.getDate() + 1));
			// post the given data for the user/admin
			if ($scope.$parent.usertype === "ROLE_USER") {
				var roletype = 'user';
				$scope.role = 'user';
			} else if ($scope.$parent.usertype === "ROLE_ADMIN") {
				var roletype = 'admin';
				$scope.role = 'admin';
			}

			TransactionDetails
					.PostTransaction($scope.transModel.transaction_Type,
							from_Date, to_Date, roletype)
					.then(
							function(successresponse) {
								console.log(successresponse);
								var x = successresponse.data.transactionReports;
								var y = successresponse.data.walletReport;

								if (typeof x === "undefined") {
									$scope.stores = successresponse.data.walletReport;
									if ($scope.stores.length <= 0) {
										AlertDialogFactory.showAlert(
												"No Data Found", $scope);
									}
								}
								if (typeof y === "undefined") {
									$scope.stores = successresponse.data.transactionReports;
									if ($scope.stores.length <= 0) {
										AlertDialogFactory.showAlert(
												"No Data Found", $scope);
									}
								}
								if (!($scope.transModel.transaction_Type == 'WALLET')) {
									$scope.totalFlag = true;
								} else {
									$scope.totalFlag = false;
								}

								var init;
								$scope.showdatafetch(false);
								$scope.setComplainflag();
								// Passing data to the table.

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
							function(errormessage) {
								$scope.showdatafetch(false);
								AlertDialogFactory.showAlert(
										"Some Error Occured", $scope);
								console.log(errormessage);
							});

		};

		$scope.PrintPdf = function() {
			var from_Date = DateToString($scope.transModel.from_Date);
			var to_Date = DateToString(new Date($scope.transModel.to_Date
					.getFullYear(), $scope.transModel.to_Date.getMonth(),
					$scope.transModel.to_Date.getDate() + 1));
			TransactionDetails.Postpdf($scope.transModel.transaction_Type,
					from_Date, to_Date, 'user').then(function(successresponse) {
				console.log(successresponse);
				// var blob = new Blob([successresponse], {
				// type:
				// 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'
				// });
				// saveAs(blob, 'test' + '.xlsx');

				window.location = 'export-pdf/transactiondetails.html';

			});
		};

		$scope.PrintExcel = function() {
			var from_Date = DateToString($scope.transModel.from_Date);
			var to_Date = DateToString(new Date($scope.transModel.to_Date
					.getFullYear(), $scope.transModel.to_Date.getMonth(),
					$scope.transModel.to_Date.getDate() + 1));
			TransactionDetails.Postexcel($scope.transModel.transaction_Type,
					from_Date, to_Date, 'user').then(function(successresponse) {
				console.log(successresponse);
				// var blob = new Blob([successresponse], {
				// type:
				// 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'
				// });
				// saveAs(blob, 'test' + '.xlsx');

				window.location = 'export-xlsx/transactiondetails.html';

			});
		};
	};
	var RaiseRefundCtrl = function($scope, $uibModal, $uibModalInstance) {
		$scope.commentmodel = {};

		$scope.RaiseRefundSubmit = function() {
			$uibModalInstance.close($scope.commentmodel.comment);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};

	};

	RaiseRefundCtrl.$inject = [ '$scope', '$uibModal', '$uibModalInstance' ]

	TransactionController.$inject = [ '$http', '$rootScope', '$scope',
			'$filter', 'TransactionDetails', 'AlertDialogFactory',
			'TabledataFilterFact', '$uibModal','API' ];
	angular.module('app').controller('TransactionController',
			TransactionController).controller('RaiseRefundCtrl',
			RaiseRefundCtrl);
}());
