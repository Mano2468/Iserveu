(function() {
	'use strict';

	angular.module('app').controller(
			'BeneDetailscontroller',
			[ '$scope', '$uibModal', '$location', '$http',
					'AlertDialogFactory', 'AddBenefactory', '$timeout','API',
					BeneDetailscontroller ]).controller(
			'modalCtrl',
			[ '$scope', '$uibModalInstance', 'Type', 'ifsc', 'benemobile',
					'beneaccount', 'benebankname', 'benename', modalCtrl ])
			.controller(
					'modalReceiptCtrl',
					[ '$scope', '$uibModalInstance', 'ReceiptData',
							modalReceiptCtrl ]);
	function BeneDetailscontroller($scope, $uibModal, $location, $http,
			AlertDialogFactory, AddBenefactory, $timeout,API) {

		$scope.progressbarflag = false;
		$scope.progressbar = function(flag) {
			$scope.progressbarflag = flag;
		}

		var ViewBene = function() {

			var BeneCardNo = AddBenefactory.getBeneData();
			var beneobj = JSON.stringify({
				'cardNo' : BeneCardNo
			});
			console.log(beneobj);
			if (!(BeneCardNo == null)) {
				$http({
					method : 'POST',
					url : API + 'cashviewbeneficiary.json',
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
				$location.path("moneytransfersignin");
			}
		};

		$scope.CardBalance = function() {

			$scope.progressbar(true);
			var BeneCardNo = AddBenefactory.getBeneData();
			var TopUpobj = JSON.stringify({
				'cardNo' : BeneCardNo
			});
			console.log(TopUpobj);
			if (!(BeneCardNo == null)) {
				$http({
					method : 'POST',
					url : API +'checkcashcardbalance.json',
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
				$location.path("moneytransfersignin");
			}
		};

		var TopUplimt = function() {

			$scope.progressbar(true);
			var BeneCardNo = AddBenefactory.getBeneData();
			var TopUpobj = JSON.stringify({
				'cardNo' : BeneCardNo
			});
			console.log(TopUpobj);
			if (!(BeneCardNo == null)) {
				$http({
					method : 'POST',
					url : API + 'checkcashcardbalance.json',
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
				$location.path("moneytransfersignin");
			}
		};
		TopUplimt();
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
			var BeneCardNo = AddBenefactory.getBeneData();
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
					url : API+'cashverification.json',
					contentType : 'application/json',
					data : verify,
				}).then(
						function(successresponse) {
							$scope.progressbar(false);
							console.log(successresponse);
							AlertDialogFactory.showAlert(
									"Successfully verified, Bene Name : "
											+ successresponse.data.benename,
									$scope);
							$scope.CardBalance();
							$scope.$emit("updateBalanceTrx", {
								message : "update"
							});
						},
						function(errorresponse) {
							$scope.progressbar(false);
							$scope.CardBalance();
							$scope.$emit("updateBalanceTrx", {
								message : "update"
							});
							AlertDialogFactory.showAlert(
									errorresponse.data.status, $scope);
						});
			} else {
				AlertDialogFactory.showAlert("Please login Again", $scope);
				// $location.path("page/404");
			}

		};

		$scope.animationsEnabled = true;

		$scope.addbene = function(select_type, item) {
			if (select_type == 2) {
				$scope.TransType = "IMPS(IFSC)"
			} else {
				$scope.TransType = "NEFT"
			}
			$scope.SelectTypedat = select_type;
			$scope.beneName = item.benename;
			$scope.bankName = item.bankname;
			$scope.Ifsc = item.ifsccode;
			$scope.Benemobile = item.mobile;
			$scope.Beneid = item.beneid;
			$scope.BeneAccountno = item.accountno;
			$scope.progressbarflag = false;
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'benemodal.html',
				controller : 'modalCtrl',

				resolve : {
					Type : function() {
						return $scope.TransType;
					},
					ifsc : function() {
						return $scope.Ifsc;
					},
					benemobile : function() {
						return $scope.Benemobile;
					},
					beneaccount : function() {
						return $scope.BeneAccountno;
					},
					benebankname : function() {
						return $scope.bankName;
					},
					benename : function() {
						return $scope.beneName;
					}
				}

			});

			modalInstance.result.then(function(amount) {
				$scope.sendMoneyModel = amount;
				$scope.progressbarflag = true;
				$scope.sendMoney();
			});
		};

		$scope.sendMoney = function() {
			var BeneCardNo = AddBenefactory.getBeneData();
			var Securitykey = AddBenefactory.getBeneKey();
			var mobileno = AddBenefactory.getmobileno();
			var amountdetails = JSON.stringify({
				'transAmount' : $scope.sendMoneyModel,
				'cardNo' : BeneCardNo,
				'ifscCode' : $scope.Ifsc,
				'transType' : $scope.SelectTypedat,
				'beneMobile' : $scope.Benemobile,
				'senderMobile' : mobileno,
				'beniId' : $scope.Beneid,
				'securityKey' : Securitykey,
				'accountNo' : $scope.BeneAccountno,
			});

			$http({
				method : 'POST',
				url : API+'cashtransaction.json',
				contentType : 'application/json',
				data : amountdetails,
			})
					.then(
							function(successresponse) {
								$scope.progressbar(false);
								console.log(successresponse);
								$scope.CardBalance();
								if (successresponse.data.statuscode === "2") {
									AlertDialogFactory
											.showConfirm(
													successresponse.data.status
															+ "\n Do You Want To Retry?",
													$scope)
											.then(
													function() {
														$scope
																.progressbar(true);
														$timeout(
																$scope
																		.Transaction(successresponse.data.transactionId),
																90000);
													}, function() {

													});
								} else {
									AlertDialogFactory
											.showAlert(
													"Rs : "
															+ successresponse.data.amount
															+ " has been successfully transfered to "
															+ successresponse.data.benename,
													$scope);
									$scope.$emit("updateBalanceTrx", {
										message : "update"
									});
								}
							},
							function(errorresponse) {
								$scope.progressbar(false);
								$scope.CardBalance();
								AlertDialogFactory.showAlert(
										errorresponse.data.status, $scope);
								$scope.$emit("updateBalanceTrx", {
									message : "update"
								});
							});

		};

		$scope.Transaction = function(id) {
			$scope.progressbar(true);
			var TransactionDetails = JSON.stringify({
				'transactionId' : id
			});
			$http({
				method : 'POST',
				url : API+'cashtransactionrequery.json',
				contentType : 'application/json',
				data : TransactionDetails,
			}).then(
					function(successresponse) {
						console.log(successresponse);
						$scope.progressbar(false);
						$scope.CardBalance();
						AlertDialogFactory.showAlert(
								successresponse.data.status, $scope);
						$scope.$emit("updateBalanceTrx", {
							message : "update"
						});
					},
					function(errorresponse) {
						console.log(errorresponse);
						$scope.progressbar(false);
						$scope.CardBalance();
						$scope.$emit("updateBalanceTrx", {
							message : "update"
						});
						AlertDialogFactory.showAlert(errorresponse.data.status,
								$scope);
					});
		};

		$scope.NewBene = function() {
			var CardNo = AddBenefactory.getBeneData();
			if (!(CardNo == null)) {
				$location.path("addbene");
			} else {
				AlertDialogFactory.showAlert("Timeout", $scope);
				// $location.path("page/404");
			}
		};
		$scope.topup = function() {
			var CardNo = AddBenefactory.getBeneData();
			if (!(CardNo == null)) {
				$location.path("topup");
			} else {
				AlertDialogFactory.showAlert("Timeout", $scope);
				// $location.path("page/404");
			}
		};
		$scope.transaction = function() {
			var CardNo = AddBenefactory.getBeneData();
			if (!(CardNo == null)) {
				$location.path("moneytransaction");
			} else {
				AlertDialogFactory.showAlert("Timeout", $scope);
				// $location.path("page/404");
			}
		};

		$scope.Agenttransaction = function() {
			var CardNo = AddBenefactory.getBeneData();
			if (!(CardNo == null)) {
				$location.path("agenttransaction");
			} else {
				AlertDialogFactory.showAlert("Timeout", $scope);
				// $location.path("page/404");
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

	function modalCtrl($scope, $uibModalInstance, Type, ifsc, benemobile,
			beneaccount, benebankname, benename) {
		$scope.amountData;
		$scope.proceedbutton = true;
		$scope.$watch('amountData', function(currentval, oldval) {
			if ($scope.amountData != null) {
				$scope.proceedbutton = false;
			} else {
				$scope.proceedbutton = true;
			}
		});
		$scope.Btype = Type;
		$scope.Bifsc = ifsc;
		$scope.Bbenemobile = benemobile;
		$scope.Bbeneaccount = beneaccount;
		$scope.Bbenebankname = benebankname;
		$scope.Bbenename = benename;
		$scope.ok = function() {
			$uibModalInstance.close($scope.amountData);
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
