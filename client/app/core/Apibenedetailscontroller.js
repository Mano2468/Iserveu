(function() {
	'use strict';

	angular.module('app').controller(
			'ApiBeneDetailscontroller',
			[ '$scope', '$uibModal', '$location', '$http',
					'AlertDialogFactory', 'ApiAddBenefactory','API',
					ApiBeneDetailscontroller ]).controller('ApimodalCtrl',
			[ '$scope', '$uibModalInstance', ApimodalCtrl ]).controller(
			'modalReceiptCtrl',
			[ '$scope', '$uibModalInstance', 'ReceiptData', modalReceiptCtrl ]);
	function ApiBeneDetailscontroller($scope, $uibModal, $location, $http,
			AlertDialogFactory, ApiAddBenefactory,API) {

		$scope.progressbarflag = false;
		$scope.progressbar = function(flag) {
			$scope.progressbarflag = flag;
		}

		var ViewBene = function() {

			var BeneCardNo = ApiAddBenefactory.getBeneData();
			var beneobj = JSON.stringify({
				'cardNo' : BeneCardNo
			});
			console.log(beneobj);
			if (!(BeneCardNo == null)) {
				$http({
					method : 'POST',
					url : API+ 'dcashviewbeneficiary.json',
					contentType : 'application/json',
					data : beneobj,
				}).then(function(successresponse) {
					console.log(successresponse);
					$scope.BeneList = successresponse.data.item;
					console.log($scope.BeneList);
				}, function(errorresponse) {

				});
			} else {
				AlertDialogFactory.showAlert("please login again", $scope);
				$location.path("/Apimoneytransfersignin");
			}
		};

		$scope.CardBalance = function() {

			$scope.progressbar(true);
			var BeneCardNo = ApiAddBenefactory.getBeneData();
			var TopUpobj = JSON.stringify({
				'cardNo' : BeneCardNo
			});
			console.log(TopUpobj);
			if (!(BeneCardNo == null)) {
				$http({
					method : 'POST',
					url : API +'dcheckcashcardbalance.json',
					contentType : 'application/json',
					data : TopUpobj,
				}).then(
						function(successresponse) {
							$scope.Balance = successresponse.data;
							console.log(successresponse.data);
							$scope.progressbar(false);
						},
						function(errorresponse) {
							$scope.progressbar(false);
							AlertDialogFactory.showAlert(
									errorresponse.data.status, $scope);

						});
			} else {
				AlertDialogFactory.showAlert("please login again", $scope);
				$location.path("/Apimoneytransfersignin");
			}
		};

		// for verify

		$scope.VerifyBene = function(item) {

			AlertDialogFactory
					.showConfirm(
							"Rs 5 will be deducted from the main account (maintained with us of the Client); and Rs 1 will be transferred to beneficiary account.",
							$scope).then(function() {

						$scope.VerifyBeneConfirmed(item);
					}, function() {

					});
		};
		$scope.VerifyBeneConfirmed = function(item) {

			$scope.progressbar(true);
			var BeneCardNo = ApiAddBenefactory.getBeneData();
			var verify = JSON.stringify({
				'cardNo' : BeneCardNo,
				'ifscCode' : item.ifsccode,
				'beneMobile' : item.mobile,
				'beniId' : item.beneid,
				'branchName' : item.branchname,
				'bankName' : item.bankname,
				'accountNo' : item.accountno,
			});

			if (!(BeneCardNo == null)) {
				$http({
					method : 'POST',
					url : API+'dcashverification.json',
					contentType : 'application/json',
					data : verify,
				}).then(
						function(successresponse) {
							$scope.progressbar(false);
							console.log(successresponse);
							AlertDialogFactory.showAlert(
								"Successfully verified, Bene Name : "
								+ successresponse.data.benename, $scope);
							$scope.$emit("updateBalanceTrx", {message : "update"});
						},
						function(errorresponse) {
							$scope.progressbar(false);
							AlertDialogFactory.showAlert(
									errorresponse.data.status, $scope);
						});
			} else {
				AlertDialogFactory.showAlert("Please login Again", $scope);
				$location.path("/404");
			}

		};

		$scope.animationsEnabled = true;

		$scope.addbene = function(select_type, item) {
			$scope.SelectTypedat = select_type;
			$scope.Ifsc = item.ifsccode;
			$scope.Benemobile = item.mobile;
			$scope.Beneid = item.beneid;
			$scope.BeneAccountno = item.accountno;
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'Apibenemodal.html',
				controller : 'ApimodalCtrl',

			// resolve : {
			// selectTypeDat : function() {
			// return $scope.SelectTypedat;
			// },
			// ifsc : function() {
			// return $scope.Ifsc;
			// },
			// benemobile : function() {
			// return $scope.Benemobile;
			// },
			// beneid : function() {
			// return $scope.Beneid;
			// },
			// beneaccount : function() {
			// return $scope.BeneAccountno;
			// }
			// }
			});

			modalInstance.result.then(function(amount) {
				$scope.sendMoneyModel = amount;
				$scope.progressbarflag = true;
				$scope.sendMoney();
			});
		};

		$scope.sendMoney = function() {
			var BeneCardNo = ApiAddBenefactory.getBeneData();
			var Securitykey = ApiAddBenefactory.getBeneKey();
			var amountdetails = JSON.stringify({
				'transAmount' : $scope.sendMoneyModel,
				'cardNo' : BeneCardNo,
				'ifscCode' : $scope.Ifsc,
				'transType' : $scope.SelectTypedat,
				'beneMobile' : $scope.Benemobile,
				'beniId' : $scope.Beneid,
				'securityKey' : Securitykey,
				'accountNo' : $scope.BeneAccountno,
			});

			$http({
				method : 'POST',
				url : API+'dcashtransaction.json',
				contentType : 'application/json',
				data : amountdetails,
			}).then(
					function(successresponse) {
						$scope.progressbar(false);
						console.log(successresponse);
						AlertDialogFactory.showAlert("Rs : "
								+ successresponse.data.amount
								+ " has been successfully transfered to "
								+ successresponse.data.benename, $scope);
						$scope.$emit("updateBalanceTrx", {message : "update"});

					},
					function(errorresponse) {
						$scope.progressbar(false);
						AlertDialogFactory.showAlert(errorresponse.data.status,
								$scope);
					});

		};

		$scope.NewBene = function() {
			var CardNo = ApiAddBenefactory.getBeneData();
			if (!(CardNo == null)) {
				$location.path("/Apiaddbene");
			} else {
				AlertDialogFactory.showAlert("Timeout", $scope);
				$location.path("/404");
			}
		};
		$scope.topup = function() {
			var CardNo = ApiAddBenefactory.getBeneData();
			if (!(CardNo == null)) {
				$location.path("/Apitopup");
			} else {
				AlertDialogFactory.showAlert("Timeout", $scope);
				$location.path("/404");
			}
		};
		$scope.transaction = function() {
			var CardNo = ApiAddBenefactory.getBeneData();
			if (!(CardNo == null)) {
				$location.path("/Apimoneytransaction");
			} else {
				AlertDialogFactory.showAlert("Timeout", $scope);
				$location.path("/404");
			}
		};

		$scope.receipt = function(data) {
			$scope.receivedData = data;
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'receipt.html',
				controller : 'modalReceiptCtrl',

				resolve : {
					ReceiptData : function() {
						return $scope.receivedData;
					}
				}
			});
		};

		$scope.toggleAnimation = function() {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};
		ViewBene();
	}

	function ApimodalCtrl($scope, $uibModalInstance) {
		$scope.amount;
		$scope.ok = function() {
			$uibModalInstance.close($scope.amount);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};

	}
	function modalReceiptCtrl($scope, $uibModalInstance, ReceiptData) {

		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};

		$scope.Rdata = ReceiptData;

	}

})();
