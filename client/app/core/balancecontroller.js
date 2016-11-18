(function() {
	'use strict';

	var Balancecontroller = function($scope, $rootScope, $http, $filter,
			BalanceRequestService, TabledataFilterFact,API) {
		$scope.searchflag = true;
		// for get Advanced filter data using chips
		$scope.readonly = false;
		$scope.tags = [];
		$scope.datafetchflag = false;
		$scope.BalanceRequestModel = {};
		$scope.BalanceRequestModel = {
			fromDate : new Date(),
			toDate : new Date()
		}
		var original;
		original = angular.copy($scope.BalanceRequestModel);
		$scope.todaysDate = new Date();
		$scope.minDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth() - 3, $scope.todaysDate.getDate());
		$scope.maxDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth(), $scope.todaysDate.getDate());
		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.BalanceRequestModel, original);
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

		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}
		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};

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
		});
		$scope.totalTransaction = 0;
		// TODO move to factory as common functionality
		function TransactionTotalExtract() {
			$scope.totalTransaction = 0;
			for ( var store_obj in $scope.filteredStores) {

				$scope.totalTransaction += $scope.filteredStores[store_obj].amount;

			}
			$scope.totalTransaction = $scope.totalTransaction.toFixed(2);

		}
		;

		$scope.InitBalanceRequest = function() {
			console.log("inside  balance contr");
			$scope.showdatafetch(true);
			var fromDate = DateToString($scope.BalanceRequestModel.fromDate);
			var toDate = DateToString(new Date(
					$scope.BalanceRequestModel.toDate.getFullYear(),
					$scope.BalanceRequestModel.toDate.getMonth(),
					$scope.BalanceRequestModel.toDate.getDate() + 1));
			var BalanceRequestObj = JSON.stringify({
				'toDate' : toDate,
				'fromDate' : fromDate
			});
			console.log(BalanceRequestObj);
			$http({
				method : 'POST',
				url : API+'fetchallinterwalletrequests.json',
				contentType : 'application/json',
				data : BalanceRequestObj,
			})
					.then(
							function(successresponse) {
								$scope.showdatafetch(false);
								$scope.stores = successresponse.data.fetchraisedRequests;
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
									TransactionTotalExtract();
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
									// $scope.ShowUserSubmit();
									$scope.search();
									return $scope.select($scope.currentPage);
								};

								init();

							}, function(errormessage) {
								$scope.showdatafetch(false);
								console.log(errormessage);
							});

		};

		$scope.PrintReceipt = function(print_data) {
			console.log(print_data);

			var id = print_data.id.toString();
			var sender_name = print_data.senderName;
			var bank_name = print_data.senderBankName;
			var bank_account = print_data.senderAccountNo;
			var d_date = print_data.depositDate;
			var Amount = print_data.amount.toString();
			var r_id = print_data.bankRefId;
			var re_from = print_data.requestFrom;
			var re_to = print_data.requestTo;
			var re_time = print_data.requestedTime;
			var userName = $rootScope.user;
			var BrandName = $rootScope.BrandName;
			var PrintBalanceReceipt = {
				content : [
						{
							text : BrandName,
							style : 'header'
						},
						{
							text : 'Retailer Name : ' + userName,
							style : 'header'
						},

						{
							style : 'tableExample',
							table : {
								body : [
										[ 'Id', 'Sender Name', 'Bank Name',
												'Bank A/C No', 'Deposit Date',
												'Amount', 'Bank Ref Id',
												'Request From', 'Request To',
												'Requested Time' ],
										[ id, sender_name, bank_name,
												bank_account, d_date, Amount,
												r_id, re_from, re_to, re_time ] ]
							}
						}, {
							text : '\nThank You\n' + BrandName,
							style : 'header',
							alignment : 'right'
						} ],
				styles : {
					header : {
						fontSize : 15,
						bold : true,
						margin : [ 0, 0, 0, 10 ]
					},
					subheader : {
						fontSize : 13,
						bold : true,
						margin : [ 0, 10, 0, 5 ]
					},
					tableExample : {
						margin : [ 0, 5, 0, 25 ]
					},
					tableHeader : {
						bold : true,
						fontSize : 11,
						color : 'black'
					}
				},
				defaultStyle : {
					alignment : 'justify'
				}

			}
			var date = new Date();
			var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
					+ date.getDate() + " " + date.getHours() + ":"
					+ date.getMinutes() + ":" + date.getSeconds();
			pdfMake.createPdf(PrintBalanceReceipt).download(
					'receipt-' + str + '.pdf');

		}

		// InitBalanceRequest();
	};
	Balancecontroller.$inject = [ '$scope', '$rootScope', '$http', '$filter',
			'BalanceRequestService', 'TabledataFilterFact','API' ];
	angular.module('app').controller('Balancecontroller', Balancecontroller);
}());
