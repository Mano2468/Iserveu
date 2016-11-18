(function() {
	'use strict';

	var RefundRequest_Ctrl = function($http, $rootScope, $scope, $filter,
			RefundDetails, AlertDialogFactory, TabledataFilterFact, $uibModal,API) {

		$scope.transModel = {};
		var original;

		$scope.searchflag = true;
		$scope.transModel = {
			transaction_Type : '',
			from_Date :  new Date(),
			to_Date :  new Date()
		}
		$scope.confirmModal = {
			id : '',
			comment : '',
			operation : ''
		};



		$scope.StatusType =
                {
                    "New": [{
                        "type": "SUCCESS"
                    }, {
                        "type": "FAILED"
                    }],
                    "Refund": [{
                        "type": "SUCCESS"
                    }],
                    "Success": [{
                    "type": "FAILED"
                    }]
                };

		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};

		$scope.datafetchflag = false;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
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

		original = angular.copy($scope.transModel);

		$scope.todaysDate = new Date();
		$scope.minDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth() - 3, $scope.todaysDate.getDate());
		$scope.maxDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth(), $scope.todaysDate.getDate());

		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.transModel, original);
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

		$scope.approveOrDecline = function(store, operation) {
			if(store.status=="NEW"){
				$scope.Type = $scope.StatusType.New;
			}
			else if(store.status=="REFUNDED"){
               $scope.Type = $scope.StatusType.Refund;
			}
			else if(store.status=="FAILED"){
				$scope.Type = $scope.StatusType.Refund;
			}
			else{
				$scope.Type = $scope.StatusType.Success;
			}
			$scope.confirmModal.id = store.id;
			$scope.confirmModal.operation = operation;
			var commentModal = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'commentmodal.html',
				controller : 'modalRefundCtrl',
				resolve : {
					Stype : function() {
						return $scope.Type;
					}
				}

			});

			commentModal.result.then(function(providerModalData) {
				$scope.confirmModal.comment = providerModalData.comment;
				$scope.confirmModal.status = providerModalData.type;
				$scope.postOperation($scope.confirmModal);
			}, function() {
				console.log("Modal dismissed");
			});

		};

		$scope.Decline = function(store, operation) {
			$scope.declineData = {
			id : '',
			comment : '',
			operation : ''
		};
			$scope.declineData.id = store.id;
			$scope.declineData.operation = operation;
			var DeclineModal = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'Declinemodal.html',
				controller : 'DeclineModalCtrl',

			});

			DeclineModal.result.then(function(ModalData) {
				$scope.declineData.comment = ModalData.comment;
				$scope.postOperation($scope.declineData);
			}, function() {
				console.log("Modal dismissed");
			});

		};
		$scope.postOperation = function(confirmModal) {

			var approverequestordeclineJson = JSON.stringify(confirmModal);

			// parameters.approverequestordecline = approverequestordeclineJson;
			$scope.showdatafetch(true);
			$http({
				method : 'POST',
				url : API+'approveordeclinerefund.json',
				contentType : 'application/json',
				data : approverequestordeclineJson,
			}).then(
					function(balanceresponse) {
                      $scope.showdatafetch(false);
						console.log(balanceresponse);
						AlertDialogFactory.showAlert(
								balanceresponse.data.statusDesc, $scope);
						$scope.showdatafetch(false);
						$scope.$emit("updateBalanceTrx", {message : "update"});
						$scope.TransactionSubmit();

					},
					function(errorresponse) {
						$scope.showdatafetch(false);
						AlertDialogFactory.showAlert(
								errorresponse.data.message, $scope);
					});

		};

		$scope.TransactionSubmit = function() {
			$scope.showdatafetch(true);
			var from_Date = DateToString($scope.transModel.from_Date);
			var to_Date = DateToString(new Date($scope.transModel.to_Date
					.getFullYear(), $scope.transModel.to_Date.getMonth(),
					$scope.transModel.to_Date.getDate() + 1));
			// post the given data for the user/admin

			RefundDetails
					.PostTransaction($scope.transModel.transaction_Type,
							from_Date, to_Date)
					.then(
							function(successresponse) {
								var x = successresponse.data.complainReport;

								if (typeof x === "undefined") {
									$scope.stores = [];
									if ($scope.stores.length <= 0) {
										AlertDialogFactory.showAlert(
												"No Data Found", $scope);
									}
								} else {
									$scope.stores = x;
								}

								var init;
								$scope.showdatafetch(false);
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

							},
							function(errormessage) {
								$scope.showdatafetch(false);
								AlertDialogFactory.showAlert(
										"Some Error Occured", $scope);
							});
		};
	};

	var modalRefundCtrl = function($scope, $uibModal, $uibModalInstance,Stype) {
		$scope.stype = Stype;
		$scope.confirmModal = {};

		$scope.ok = function() {

			$uibModalInstance.close($scope.confirmModal);

		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};

	};

	var DeclineModalCtrl = function($scope, $uibModal, $uibModalInstance) {
		$scope.DeclineModel = {};

		$scope.ok = function() {

			$uibModalInstance.close($scope.DeclineModel);

		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};

	};

	RefundRequest_Ctrl.$inject = [ '$http', '$rootScope', '$scope', '$filter',
			'RefundDetails', 'AlertDialogFactory', 'TabledataFilterFact',
			'$uibModal','API'];
	modalRefundCtrl.$inject = [ '$scope', '$uibModal', '$uibModalInstance','Stype' ];
	DeclineModalCtrl.$inject = ['$scope', '$uibModal', '$uibModalInstance'];
	angular.module('app').controller('RefundRequest_Ctrl', RefundRequest_Ctrl)
			.controller('modalRefundCtrl', modalRefundCtrl).controller('DeclineModalCtrl',DeclineModalCtrl);
}());
