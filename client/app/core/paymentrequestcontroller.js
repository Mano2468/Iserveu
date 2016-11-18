(function() {
	'use strict';

	var PaymentRequestReportController = function($scope, $rootScope, $filter,
			BalanceRequestService, TabledataFilterFact) {
		$scope.searchflag = true;
		// for get Advanced filter data using chips
		$scope.readonly = false;
		$scope.tags = [];
		$scope.datafetchflag = false;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}
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
			InitBalanceRequest();
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

		var InitBalanceRequest = function() {
			$scope.showdatafetch(true);
			BalanceRequestService
					.paymentRequestCheck()
					.then(
							function(successresponse) {
								$scope.showdatafetch(false);
								$scope.stores = successresponse.data.fetchraisedRequests;
								$scope.result = 'success';
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

							}, function(errormessage) {
								$scope.showdatafetch(false);
							});

		};

		$scope.PaymentPrintReceipt = function(print_data) {
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

		};

		InitBalanceRequest();
	};
	PaymentRequestReportController.$inject = [ '$scope', '$rootScope',
			'$filter', 'BalanceRequestService', 'TabledataFilterFact' ];
	angular.module('app').controller('PaymentRequestReportController',
			PaymentRequestReportController);
}());