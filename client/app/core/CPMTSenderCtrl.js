(function() {
	'use strict';

	var CpmtSenderController = function($scope, $mdDialog, $uibModal, $http,
			$filter, AlertDialogFactory, DummyBanklist,API) {
		$scope.login = true;
		$scope.register = false;
		$scope.AddbeneForm = false;
		$scope.addbeneFlag = false;
		$scope.RecipentListForm = false;
		$scope.recipentlistFlag = false;
		$scope.submitbuttonflag = false;
		$scope.loginmodel = {};
		$scope.otpmodel = {};
		$scope.AddBeneModel = {};
		$scope.Registermodel = {};
		$scope.Addbeneotpmodel = {};
		$scope.ProgressbarFlag = false;
		$scope.addbeneOtc = false;
		$scope.selectedbeneFlag = false;
		$scope.deleteBeneFlag = false;
		$scope.transferFlag = false;
		$scope.reinitializeFlag = false;

		$scope.$watch('loginmodel.phone',
				function(currentval, oldval) {
					if ($scope.loginmodel.phone != ''
							&& $scope.loginmodel.phone != null
							&& currentval != oldval) {
						$scope.submitbuttonflag = false;
					} else {
						$scope.BalanceFlag = false;
						$scope.AddbeneForm = false;
						$scope.addbeneFlag = false;
						$scope.RecipentListForm = false;
						$scope.recipentlistFlag = false;
						$scope.addbeneOtc = false;
						$scope.deleteBeneFlag = false;
						$scope.transferFlag = false;
						$scope.selectedbeneFlag = false;
						$scope.ResetAddbeneField();
					}
				});

		$scope.AddNewBene = function() {
			if ($scope.AddbeneForm) {
				$scope.addbeneOtc = false;
				$scope.addbeneFlag = true;
				$scope.recipentlistFlag = false;
				$scope.transferFlag = false;
				$scope.deleteBeneFlag = false;
				$scope.ResetAddbeneField();
				$scope.selectedbeneFlag = false;
			}
		};
		$scope.RecipentList = function() {
			if ($scope.RecipentListForm) {
				$scope.selectedbeneFlag = false;
				$scope.recipentlistFlag = true;
				$scope.addbeneFlag = false;
				$scope.deleteBeneFlag = false;
				$scope.ResetAddbeneField();
			}
		};

		$scope.ResetFormField = function() {
			$scope.Registermodel.firstname = "";
			$scope.Registermodel.lastname = "";
			$scope.Registermodel.mobileno = "";
			$scope.loginmodel.phone = "";
			$scope.register = true;
		};

		$scope.ResetAddbeneField = function() {
			$scope.AddBeneModel.benename = "";
			$scope.AddBeneModel.benetype = "";
			$scope.AddBeneModel.accountno = "";
			$scope.AddBeneModel.ifsc = "";
		};
		$scope.ValidePhoneChecker = function() {
			$scope.ProgressbarFlag = true;

			var phoneNo = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '5',
				'pin' : '',
				'otc' : '',
				'fName' : '',
				'routingType' : '',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : '',
				'beneNickName' : '',
				'beneIFSC' : '',
				'lname' : '',
				'beneName' : '',
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});

			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : phoneNo,
			})
					.then(
							function(successresponse) {
								console.log(successresponse.data.apiResponse.addinfo);
								$scope.ProgressbarFlag = false;
								var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
								if (successresponse.data !== null
										&& response.Response == "ERROR") {
									AlertDialogFactory.showAlert(response.Message, $scope);
								}else{
								$scope.AddbeneForm = true;
								$scope.BalanceFlag = true;
								$scope.RecipentListForm = true;
								$scope.submitbuttonflag = true;
								$scope.RecipentList();
								var Benedata = successresponse.data.apiResponse.addinfo;
								$scope.Benelist = {};
								$scope.Benelist = JSON.parse(Benedata);
								console.log($scope.Benelist);
								$scope.beneBalance = $scope.Benelist.CardDetail.Balance;

								AlertDialogFactory
										.showAlert(
												successresponse.data.statusDesc,
												$scope);
								}

							},
							function(errorresponse) {
								console.log(errorresponse);

								AlertDialogFactory.showAlert(
										errorresponse.data.statusDesc, $scope);
								$scope.Registermodel.mobileno = $scope.loginmodel.phone;
								$scope.login = false;
								$scope.register = true;
								$scope.ProgressbarFlag = false;
							});
		}

		$scope.NewRegistration = function() {
			$scope.ProgressbarFlag = true;
			var newUserRegistration = JSON.stringify({
				'number' : $scope.Registermodel.mobileno,
				'type' : '0',
				'pin' : '',
				'otc' : '',
				'fName' : $scope.Registermodel.firstname,
				'routingType' : '',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : '',
				'beneNickName' : '',
				'beneIFSC' : '',
				'lname' : $scope.Registermodel.lastname,
				'beneName' : '',
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : newUserRegistration,
			}).then(
					function(successresponse) {
						$scope.ProgressbarFlag = false;
						$scope.BalanceFlag = false;
						$scope.register = false;
						console.log(successresponse);
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						$scope.otcdata = successresponse.data;
						}
						console.log($scope.otcdata);
					},
					function(errorresponse) {
						console.log(errorresponse);
						$scope.ProgressbarFlag = false;
						$scope.BalanceFlag = false;
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});

		};

		$scope.OTPsubmit = function() {
			$scope.ProgressbarFlag = true;
			var addinfoJson = angular
					.fromJson($scope.otcdata.apiResponse.addinfo);
			var OtpVerify = JSON.stringify({
				'number' : $scope.Registermodel.mobileno,
				'type' : '2',
				'pin' : '',
				'otc' : $scope.otpmodel.otp,
				'fName' : '',
				'routingType' : '',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : addinfoJson.RequestNo,
				'beneNickName' : '',
				'beneIFSC' : '',
				'lname' : '',
				'beneName' : '',
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : OtpVerify,
			})
					.then(
							function(successresponse) {
								$scope.ProgressbarFlag = false;
								var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
								if (successresponse.data !== null
										&& response.Response == "ERROR") {
									AlertDialogFactory.showAlert(response.Message, $scope);
								}else{
								$scope.login = true;
								$scope.loginmodel.phone = $scope.Registermodel.mobileno;
								}
								// $scope.AddbeneForm = true;
								// $scope.RecipentListForm = true;
								// $scope.submitbuttonflag = true;
								// $scope.RecipentList();
								console.log(successresponse);
							},
							function(errorresponse) {
								$scope.ProgressbarFlag = false;
								AlertDialogFactory.showAlert(
										errorresponse.data.statusDesc, $scope);
							});
		};

		$scope.ResendOTP = function() {
			$scope.ProgressbarFlag = true;
			var addinfoJson = angular
					.fromJson($scope.otcdata.apiResponse.addinfo);
			var ResendOtpforverification = JSON.stringify({
				'number' : $scope.Registermodel.mobileno,
				'type' : '9',
				'pin' : '',
				'otc' : '',
				'fName' : '',
				'routingType' : '',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : addinfoJson.RequestNo,
				'beneNickName' : '',
				'beneIFSC' : '',
				'lname' : '',
				'beneName' : '',
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : ResendOtpforverification,
			}).then(
					function(successresponse) {
						$scope.ProgressbarFlag = false;
						console.log(successresponse);
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
						}
					},
					function(errorresponse) {
						$scope.ProgressbarFlag = false;
						console.log(errorresponse);
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});

		};

		$scope.AddBene = function() {
			$scope.ProgressbarFlag1 = true;
			var addbeneobj = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '4',
				'pin' : '',
				'otc' : '',
				'fName' : '',
				'routingType' : $scope.AddBeneModel.benetype,
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : $scope.AddBeneModel.accountno,
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : '',
				'beneNickName' : '',
				'beneIFSC' : $scope.AddBeneModel.ifsc,
				'lname' : '',
				'beneName' : $scope.AddBeneModel.benename,
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : addbeneobj,
			})
					.then(
							function(successresponse) {
								$scope.ProgressbarFlag1 = false;
								var response = jQuery
										.parseJSON(successresponse.data.apiResponse.addinfo);
								console.log(response.Response);
								if (successresponse.data !== null
										&& response.Response == "ERROR") {
									$scope.addbeneOtc = false;
									AlertDialogFactory.showAlert(
											response.Message, $scope);
								} else {
									$scope.addbeneOtc = true;
									$scope.AddBeneotcRef = successresponse.data;
									console.log(successresponse);
									AlertDialogFactory.showAlert(
											successresponse.data.statusDesc,
											$scope);
								}
							},
							function(errorresponse) {
								$scope.ProgressbarFlag1 = false;
								console.log(errorresponse);
								AlertDialogFactory.showAlert(
										errorresponse.data.statusDesc, $scope);
							});

		};

		$scope.AddbeneOTPsubmit = function() {
			$scope.ProgressbarFlag1 = true;
			var addbeneOtcRef = angular
					.fromJson($scope.AddBeneotcRef.apiResponse.addinfo);
			console.log(addbeneOtcRef);
			var OtpVerify = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '2',
				'pin' : '',
				'otc' : $scope.Addbeneotpmodel.otp,
				'fName' : '',
				'routingType' : '',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : addbeneOtcRef.RequestNo,
				'beneNickName' : '',
				'beneIFSC' : '',
				'lname' : '',
				'beneName' : '',
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : OtpVerify,
			}).then(
					function(successresponse) {
						console.log(successresponse);
						$scope.ProgressbarFlag1 = false;
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						$scope.addbeneOtc = false;
						$scope.Addbeneotpmodel.otp = "";
						// $scope.RecipentListForm = true;
						$scope.ResetAddbeneField();
						$scope.ValidePhoneChecker();
						$scope.RecipentList();
						}
					},
					function(errorresponse) {
						$scope.ProgressbarFlag1 = false;
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		};

		$scope.AddBeneResendOTP = function() {
			$scope.ProgressbarFlag1 = true;
			var addbeneOtcRef = angular
					.fromJson($scope.AddBeneotcRef.apiResponse.addinfo);
			var AddbeneresendOtp = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '9',
				'pin' : '',
				'otc' : '',
				'fName' : '',
				'routingType' : '',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : addbeneOtcRef.RequestNo,
				'beneNickName' : '',
				'beneIFSC' : '',
				'lname' : '',
				'beneName' : '',
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : AddbeneresendOtp,
			}).then(
					function(successresponse) {
						$scope.ProgressbarFlag1 = false;
						console.log(successresponse);
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
						}
					},
					function(errorresponse) {
						$scope.ProgressbarFlag1 = false;
						console.log(errorresponse);
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		}

		$scope.SelectedBene = function(bene) {
			$scope.VerifyBene = bene;
			$scope.selectedBene = bene.BeneficiaryName;
			$scope.selectedBeneData = bene;
			$scope.selectedbeneFlag = true;
			$scope.transferFlag = true;
		};

		$scope.DeleteSelectedBene = function(deleteBene) {
			console.log(deleteBene);
			$scope.ProgressbarFlag1 = true;
			var deleteobj = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '6',
				'pin' : '',
				'otc' : '',
				'fName' : '',
				'routingType' : 'IMPS',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : '',
				'beneNickName' : '',
				'beneIFSC' : deleteBene.IFSC,
				'lname' : '',
				'beneName' : '',
				'beneCode' : deleteBene.BeneficiaryCode,
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : deleteobj,
			}).then(
					function(successresponse) {
						$scope.ProgressbarFlag1 = false;
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						$scope.DeleteBeneotcRef = successresponse.data;
						$scope.recipentlistFlag = false;
						$scope.deleteBeneFlag = true;
						}
						console.log(successresponse);
					},
					function(errorresponse) {
						$scope.ProgressbarFlag1 = false;
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		};

		$scope.DeleteBeneOTPsubmit = function() {
			$scope.ProgressbarFlag1 = true;
			var deletebeneOtcRef = angular
					.fromJson($scope.DeleteBeneotcRef.apiResponse.addinfo);
			console.log(deletebeneOtcRef);
			var deleteotp = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '2',
				'pin' : '',
				'otc' : $scope.Deletebeneotpmodel.otp,
				'fName' : '',
				'routingType' : '',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : deletebeneOtcRef.RequestNo,
				'beneNickName' : '',
				'beneIFSC' : '',
				'lname' : '',
				'beneName' : '',
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : deleteotp,
			}).then(
					function(successresponse) {
						console.log(successresponse);
						$scope.ProgressbarFlag1 = false;
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						$scope.ValidePhoneChecker();
						$scope.Deletebeneotpmodel.otp = "";
						$scope.deleteBeneFlag = false;
						}
					},
					function(errorresponse) {
						$scope.ProgressbarFlag1 = false;
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		};

		$scope.DeleteBeneResendOTP = function() {
			$scope.ProgressbarFlag1 = true;
			var deletebeneOtcRef = angular
					.fromJson($scope.DeleteBeneotcRef.apiResponse.addinfo);
			var deletebeneresendOtp = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '9',
				'pin' : '',
				'otc' : '',
				'fName' : '',
				'routingType' : '',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : deletebeneOtcRef.RequestNo,
				'beneNickName' : '',
				'beneIFSC' : '',
				'lname' : '',
				'beneName' : '',
				'beneCode' : '',
				'account' : '',
				'amount' : '1.00',
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : deletebeneresendOtp,
			}).then(
					function(successresponse) {
						$scope.ProgressbarFlag1 = false;
						console.log(successresponse);
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
						}
					},
					function(errorresponse) {
						$scope.ProgressbarFlag1 = false;
						console.log(errorresponse);
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		}

		$scope.verifyBene = function() {
			$scope.ProgressbarFlag1 = true;
			console.log($scope.VerifyBene);
			var verifybeneObj = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '10',
				'pin' : '',
				'otc' : '',
				'fName' : '',
				'routingType' : 'IMPS',
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : '',
				'beneNickName' : '',
				'beneIFSC' : $scope.VerifyBene.IFSC,
				'lname' : '',
				'beneName' : '',
				'beneCode' : $scope.VerifyBene.BeneficiaryCode,
				'account' : '',
				'amount' : '5.75',
				'amount_All' : '5.75',
				'comment' : 'BenValidation'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : verifybeneObj,
			}).then(
					function(successresponse) {
						$scope.ProgressbarFlag1 = false;
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
						}
						console.log(successresponse);
					},
					function(errorresponse) {
						$scope.ProgressbarFlag1 = false;
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		}

		$scope.Fundtransfer = function() {

			$scope.ProgressbarFlag2 = true;
			var fundtransferObj = JSON.stringify({
				'number' : $scope.loginmodel.phone,
				'type' : '3',
				'pin' : '',
				'otc' : '',
				'fName' : '',
				'routingType' : $scope.FundTransfermodel.transfertype,
				'mothersMaidenName' : '',
				'state' : '',
				'beneAccount' : '',
				'beneMobile' : '',
				'address' : '',
				'birthDay' : '',
				'gender' : '',
				'otcRefCode' : '',
				'beneNickName' : '',
				'beneIFSC' : $scope.selectedBeneData.IFSC,
				'lname' : '',
				'beneName' : $scope.selectedBene,
				'beneCode' : $scope.selectedBeneData.BeneficiaryCode,
				'account' : '',
				'amount' : $scope.FundTransfermodel.amount,
				'amount_All' : '1.00',
				'comment' : 'test'
			});
			$http({
				method : 'POST',
				url : API+'cpmtservice.json',
				contentType : 'application/json',
				data : fundtransferObj,
			}).then(
					function(successresponse) {
						$scope.ProgressbarFlag2 = false;
						console.log(successresponse);
						var response = jQuery.parseJSON(successresponse.data.apiResponse.addinfo);
						if (successresponse.data !== null
								&& response.Response == "ERROR") {
							AlertDialogFactory.showAlert(response.Message, $scope);
						}else{
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
						}
					},
					function(errorresponse) {
						if (errorresponse.data.status == -3) {
							$scope.ProgressbarFlag2 = false;
							AlertDialogFactory.showConfirm(
									"Do U Want To Reinitialize Transaction",
									$scope).then(function() {
								$scope.showTabDialog();
							}, function() {
								console.log("cancelled");
							});
						} else {
							$scope.ProgressbarFlag2 = false;
							AlertDialogFactory.showAlert(
									errorresponse.data.statusDesc, $scope);
						}

					});
		};

		$scope.showTabDialog = function() {
			$mdDialog.show({
				controller : DialogController,
				templateUrl : 'tabDialog.tmpl.html',
				parent : angular.element(document.body),
				// targetEvent: ev,
				clickOutsideToClose : false,
				locals : {
					benelist : $scope.Benelist
				}
			}).then(function(selectedbene) {
				$scope.SelectedBene(selectedbene);
				$scope.reinitializeFlag = true;
				$scope.ProgressbarFlag2 = true;
				var ReinitializeTxnObj = JSON.stringify({
					'number' : $scope.loginmodel.phone,
					'type' : '7',
					'pin' : '',
					'otc' : '',
					'fName' : '',
					'routingType' : $scope.FundTransfermodel.transfertype,
					'mothersMaidenName' : '',
					'state' : '',
					'beneAccount' : '',
					'beneMobile' : '',
					'address' : '',
					'birthDay' : '',
					'gender' : '',
					'otcRefCode' : '',
					'beneNickName' : '',
					'beneIFSC' : $scope.selectedBeneData.IFSC,
					'lname' : '',
					'beneName' : '',
					'beneCode' : $scope.selectedBeneData.BeneficiaryCode,
					'account' : '',
					'amount' : $scope.FundTransfermodel.amount,
					'amount_All' : '1.00',
					'comment' : 'test'
				});
				$http({
					method : 'POST',
					url : API+'cpmtservice.json',
					contentType : 'application/json',
					data : ReinitializeTxnObj,
				}).then(function(successresponse) {
					$scope.ProgressbarFlag2 = false;
					$scope.reinitializeFlag = false;
					console.log(successresponse);
				}, function(errorresponse) {
					$scope.ProgressbarFlag2 = false;
					$scope.reinitializeFlag = false;
				});

			}, function() {
				$scope.status = 'You cancelled the dialog.';
				console.log($scope.status);
			});
		};

		$scope.IFSCCodeFinder = function() {
			var IfscModal = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'IFSCMODAL.html',
				controller : 'IFSCmodalCtrl',
				resolve : {
					BankNameList : function() {
						return $scope.bankcodelist;
					}
				}

			});

			IfscModal.result.then(function(data) {
				$scope.AddBeneModel.ifsc = data.ifscCode;
			});

		};
		function loadbankcode() {
			$scope.bankcodelist = DummyBanklist.getBanklist();
			// applying the filter for making the BANKNAME data title case
			for (var incr = 0; incr < $scope.bankcodelist.length; incr++) {
				$scope.bankcodelist[incr]["BANKNAME"] = $filter('uppercase')(
						$scope.bankcodelist[incr]["BANKNAME"]);
			}
		}
		loadbankcode();
	};

	var IFSCmodalCtrl = function($scope, $http, $uibModalInstance, BankNameList) {
		$scope.BankList = BankNameList;
		// $scope.BranchlistArray = BranchList;
		// $scope.BranchName;
		$scope.BranchDetails = function(bankname) {
			$scope.ProgressbarFlag1 = true;
			$http.get(API+'getbankbranches/' + bankname.BANKNAME + '.json').then(
					function(success) {
						$scope.ProgressbarFlag1 = false;
						console.log(success);
						if (success.data && success.data.constructor === Array
								&& success.data.length > 0)
							$scope.BranchList = success.data;
					},
					function(error) {
						$scope.ProgressbarFlag1 = false;
						AlertDialogFactory
								.showAlert(error.data.message, $scope);
					});
		}
		$scope.ok = function() {
			$uibModalInstance.close($scope.BranchName);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");

		};

	};

	function DialogController($scope, $mdDialog, benelist) {
		$scope.Benelist = benelist;
		$scope.selecet = false;
		$scope.Selected = function(bene) {
			$scope.selecet = true;
			$scope.SelectedBeneForTxn = bene;
			$scope.Benename = bene.BeneficiaryName;
		};

		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function() {
			$mdDialog.hide($scope.SelectedBeneForTxn);
		};
	}

	CpmtSenderController.$inject = [ '$scope', '$mdDialog', '$uibModal',
			'$http', '$filter', 'AlertDialogFactory', 'DummyBanklist','API' ];
	IFSCmodalCtrl.$inject = [ '$scope', '$http', '$uibModalInstance',
			'BankNameList' ];
	DialogController.$inject = [ '$scope', '$mdDialog', 'benelist' ];

	// add the controllers to angular module
	angular.module('app').controller('CpmtSenderController',
			CpmtSenderController).controller('IFSCmodalCtrl', IFSCmodalCtrl)
			.controller('DialogController', DialogController);
}());
