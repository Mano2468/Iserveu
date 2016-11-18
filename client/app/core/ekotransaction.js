(function() {
	'use strict';
	var EkoTransactionController = function($http, $timeout, $scope,
			$rootScope, $filter, $location, AlertDialogFactory,
			TabledataFilterFact,$uibModal,API) {
		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};
		$scope.ekotransModel = {};

		$scope.searchflag = true;
		var original;
		$scope.ekotransModel = {};
		original = angular.copy($scope.ekotransModel);
		$scope.ekotransModel = {
			fromDate : new Date(),
			toDate : new Date()
		}
		$scope.options = {
			buttonDefaultText : 'refresh',
			buttonSizeClass : 'btn-xs',
			buttonSubmittingClass : 'btn-info',
			buttonSuccessClass : 'btn-success',
			buttonErrorText : 'There was an error',
			iconsPosition : 'left',
			buttonSubmittingIcon : 'zmdi zmdi-refresh-alt'
		};

		$scope.transaction = function(store) {
			store.ref.isSubmitting = true;
			var idObj = JSON.stringify({
				'transactionID' : store.apiTId
			});
			$http({
				method : 'POST',
				url : API+'getTransansactionDeatil.json',
				contentType : 'application/json',
				data : idObj,
			})
					.then(
							function(successresponse) {

								console.log(successresponse);
								$timeout(function() {
									store.ref.result = 'success';
								}, 2000);
								if (successresponse.data.data.txstatus_desc)
									store.apiComment = successresponse.data.data.txstatus_desc;
								AlertDialogFactory.showAlert(
										successresponse.data.message, $scope);
							},
							function(errormessage) {
								$timeout(function() {
									store.ref.result = 'error';
								}, 2000);
								AlertDialogFactory.showAlert(
										errormessage.data.message, $scope);
								console.log(errormessage);
							});

		}
		$scope.complainflag = false;
		$scope.setComplainflag = function() {
			if (($rootScope.usertype === 'ROLE_RETAILER' || $rootScope.usertype === 'ROLE_USER')) {
				$scope.complainflag = true;
			} else {
				$scope.complainflag = false;
			}

		}

		$scope.CheckforRefresh = function(type, txnid) {
			if (type == "FUND_TRANSFER" && txnid != null) {
				return true;
			} else {
				return false;
			}
		}

//		$scope.raiseRefundRequest = function(store) {
//			var parameters = JSON.stringify({
//				'id' : store.id
//			});
//			$http({
//				method : 'POST',
//				url : 'user/raiserefundrequests.json',
//				contentType : 'application/json',
//				data : parameters,
//			})
//			.then(function(success) {
//				AlertDialogFactory.showAlert(success.data.statusDesc, $scope);
//
//			}, function(error) {
//				AlertDialogFactory.showAlert(error.data.statusDesc, $scope);
//
//			});
//		};


		$scope.raiseRefundRequest = function(store) {
			var raise_RefundModal = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'Raise_RefundMODAL.html',
				controller : 'Raise_RefundCtrl',

			});

			raise_RefundModal.result.then(function(comment) {
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


		$scope.todaysDate = new Date();
		$scope.minDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth() - 3, $scope.todaysDate.getDate());
		$scope.maxDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth(), $scope.todaysDate.getDate());
		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.ekotransModel, original);
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

		$scope.ekodatafetchflag = false;
		$scope.ekoshowdatafetch = function(flag) {
			$scope.ekodatafetchflag = flag;
		}

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

		$scope.EkoTransactionSubmit = function() {
			$scope.ekoshowdatafetch(true);
			var fromDate = DateToString($scope.ekotransModel.fromDate);
			var toDate = DateToString(new Date($scope.ekotransModel.toDate
					.getFullYear(), $scope.ekotransModel.toDate.getMonth(),
					$scope.ekotransModel.toDate.getDate() + 1));
			var EkoTransactionObj = JSON.stringify({
				'toDate' : toDate,
				'fromDate' : fromDate
			});
			console.log(EkoTransactionObj);
			$http({
				method : 'POST',
				url : API+'getfundtransfertransactions.json',
				contentType : 'application/json',
				data : EkoTransactionObj,
			})
					.then(
							function(successresponse) {
								console.log(successresponse);
								$scope.ekoshowdatafetch(false);
								$scope.stores = successresponse.data.transactionReports;
								var init;
								$scope.setComplainflag();
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
							function(errorresponse) {
								$scope.ekoshowdatafetch(false);
								AlertDialogFactory.showAlert(
										errorresponse.data.status, $scope);
							});
		};
	};

	var Raise_RefundCtrl = function($scope, $uibModal, $uibModalInstance) {
		$scope.commentmodel = {};

		$scope.RaiseRefundSubmit = function() {
			$uibModalInstance.close($scope.commentmodel.comment);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};

	};
	Raise_RefundCtrl.$inject = [ '$scope', '$uibModal', '$uibModalInstance' ]
	EkoTransactionController.$inject = [ '$http', '$timeout', '$scope',
			'$rootScope', '$filter', '$location', 'AlertDialogFactory',
			'TabledataFilterFact' ,'$uibModal','API'];
	angular.module('app').controller('EkoTransactionController',
			EkoTransactionController).controller('Raise_RefundCtrl',
					Raise_RefundCtrl);
}());
