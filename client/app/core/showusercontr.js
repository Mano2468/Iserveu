(function() {
	'use strict';

	var ShowUsercontroller = function($scope, $http, $rootScope, $filter,
			AlertDialogFactory, TabledataFilterFact, $uibModal, PaymentDetails,
			$location, EditUserDataFact,API) {

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
				InitGetRequest();
			};

		$scope.searchflag = true;
		$scope.datafetchflag = false;
		// for get Advanced filter data using chips
		$scope.readonly = false;
		$scope.tags = [];
		$scope.switchData = [];

		var SwitchListGen = function() {
			for (var storeidx = 0; storeidx < $scope.stores.length; storeidx++) {
				var store_Obj = $scope.stores[storeidx];
				$scope.switchData.push(store_Obj.active);
			}
			console.log($scope.switchData);
		};

		$scope.AdvancedSearch = function(currentsearch) {
			console.log(currentsearch);
			$scope.filteredStores = TabledataFilterFact.AdvancedFilter(
					$scope.stores, currentsearch);
			$scope.onFilterChange();

		};

		$scope.Debit = function(debitdata) {
			$scope.currentpayid = debitdata.userId;
			var DebitModalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'DebitModal.html',
				controller : 'DebitController'
			});
			DebitModalInstance.result.then(function(DebitData) {
				$scope.DebitModel = DebitData;
				$scope.confirmDebit();
			});
		};
		$scope.confirmDebit = function() {
			var debitObj = JSON.stringify({
				'amount' : $scope.DebitModel.amount,
				'userId' : $scope.currentpayid,
				'remarks' : $scope.DebitModel.remarks
			});
			$http({
				method : 'POST',
				url : API+'debitretailuser.json',
				contentType : 'application/json',
				data : debitObj,
			}).then(function(successresponse) {
				$scope.showdatafetch(false);
				console.log(successresponse);
				AlertDialogFactory.showAlert("successfully Debited", $scope);
				$scope.$emit("updateBalanceTrx", {
					message : "update"
				});
				InitGetRequest();
			}, function(errorresponse) {
				$scope.showdatafetch(false);
				AlertDialogFactory.showAlert("some error occured", $scope);
			});

		};

		$scope.$watch('searchflag', function(currentvalue, oldvalue) {
			// reset the search fields for both the search
			$scope.searchKeywords = null;
			$scope.tags = [];
			$scope.currentPageStores = $scope.stores;
		});
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}
		function TotalBalanceExtractor() {
			$scope.totalTransaction = 0;
			for ( var store_obj in $scope.filteredStores) {
				if ($scope.stores[store_obj]) {
					$scope.totalTransaction += $scope.stores[store_obj].currentBalance;
				}
			}
			$scope.totalTransaction = $scope.totalTransaction.toFixed(2);

		}
		;

		var PaymentModalSubmit = function() {
			console.log("inside  PaymentSubmit");
			$scope.showdatafetch(true);
			PaymentDetails
					.PostModalPayment($scope.currentpayid,
							$scope.paymentModel.sender_Name,
							$scope.paymentModel.sender_BankName,
							$scope.paymentModel.sender_AccountNO,
							$scope.paymentModel.deposite_date,
							$scope.paymentModel.amount,
							$scope.paymentModel.transfer_Type,
							$scope.paymentModel.bank_RefId,
							$scope.paymentModel.remarks)
					.then(
							function(successresponse) {
								AlertDialogFactory
										.showAlert(
												successresponse.data.statusDesc,
												$scope);
								InitGetRequest();
								if($scope.canRevert)$scope.revert();
								// refreshes the show user list
								InitGetRequest();

							}, function(errormessage) {
								$scope.showdatafetch(false);
								console.log(errormessage);
							});
		};

		// used for payment modal opening on the pay click
		$scope.open = function(paymentdata) {
			$scope.currentpayid = paymentdata.userId;
			var payModalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'paymentModal.html',
				controller : 'ModalPaymentController',
			resolve: {
			Recipent_Name : function () {
			return paymentdata.userName;
			}
			}
			});
			payModalInstance.result.then(function(payModalData) {
				$scope.paymentModel = payModalData;
				PaymentModalSubmit();
			}, function() {
				console.log("Modal dismissed");
			});
		};

		$scope.GoToEdit = function(storeobj) {
			console.log(storeobj);
			EditUserDataFact.SetUserId(storeobj.userId);
			EditUserDataFact.SetUserType(storeobj.userType);
			EditUserDataFact.SetParentUserName(storeobj.parentUserName);
			$location.path('edituser');
		};

		$scope.ActiveorDeactive = function(currUsrObj, index_val) {
			AlertDialogFactory
					.showConfirm("Confirm you action", $scope)
					.then(
							function() {

								$scope.Deactive(currUsrObj);
							},
							function() {
								//$scope.switchData[index_val] = !$scope.switchData[index_val];
								 currUsrObj.active = !currUsrObj.active;
							});
		};

		$scope.Deactive = function(curr_usrObj) {

			var ADobject = JSON.stringify({
				'userId' : curr_usrObj.userId,
				'isActive' : curr_usrObj.active
			});
			$http({
				method : 'POST',
				url : API+'setUserActive.json',
				contentType : 'application/json',
				data : ADobject,
			}).then(
					function(successresponse) {
						console.log(successresponse);
						AlertDialogFactory.showAlert("SUCCESS CHANGING STATUS",
								$scope);
					},
					function(errorresponse) {
						curr_usrObj.active = !curr_usrObj.active;
						$scope.progressbar(false);
						AlertDialogFactory.showAlert(errorresponse.data.status,
								$scope);
					});
		};

		// for the show user table display of data
		$scope.KeyChecker = function(keyvalue) {
			if (keyvalue == "active"
					&& ($rootScope.usertype == 'ROLE_ADMIN'
							|| $rootScope.usertype == 'ROLE_SUPER_ADMIN' || $rootScope.usertype == 'ROLE_MASTER_DISTRIBUTOR'))
				return true;
			return false;
		};
		/* && ($rootScope.usertype === 'ROLE_SUPER_ADMIN') */

		$scope.PayChecker = function(val) {
			if (val == "paymentOption"
					&& ($rootScope.usertype !== 'ROLE_SUPER_ADMIN')) {
				return true;
			}
			return false;
		};
		$scope.DebitChecker = function(val) {
			if (val == "paymentOption"
					&& ($rootScope.usertype == 'ROLE_ADMIN' || $rootScope.usertype == 'ROLE_MASTER_DISTRIBUTOR')) {
				return true;
			}
			return false;
		};

		var InitGetRequest = function() {
			var parameters = {};
			// admin/showusers.json
			$scope.showdatafetch(true);
			$http
					.get(API+'admin/showusers.json', {
						params : parameters
					})
					.then(
							function(successresponse) {
								console.log("success posting");
								console.log(successresponse);
								var init;
								$scope.stores = successresponse.data.allUserandBalance;
								$scope.result = 'success';

								if ($scope.stores.length <= 0) {
									AlertDialogFactory.showAlert(
											"No Data Found", $scope);
								}
								SwitchListGen();
								$scope.showdatafetch(false);
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
									TotalBalanceExtractor();
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
								$scope.showdatafetch(false);
								AlertDialogFactory.showAlert(
										"Sorry some error occured", $scope);
								console.log("success posting");
								console.log(errorresponse);
							});
		};
		InitGetRequest();

	};

	var DebitController = function($scope, AlertDialogFactory,
			$uibModalInstance) {

		$scope.Debitmodel = {
			amount : '',
			remarks : ''

		}
		var original = angular.copy($scope.Debitmodel);
		$scope.ok = function(debitData) {
			$uibModalInstance.close(debitData);
		};
		$scope.canSubmit = function(form) {
			return form && !angular.equals($scope.Debitmodel, original);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};
	};
	// updated

	ShowUsercontroller.$inject = [ '$scope', '$http', '$rootScope', '$filter',
			'AlertDialogFactory', 'TabledataFilterFact', '$uibModal',
			'PaymentDetails', '$location', 'EditUserDataFact','API' ];
	DebitController.$inject = [ '$scope', 'AlertDialogFactory',
			'$uibModalInstance' ];
	angular.module('app').controller('ShowUsercontroller', ShowUsercontroller)
			.controller('DebitController', DebitController);
}());
