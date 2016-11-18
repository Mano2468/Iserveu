(function() {
	'use strict';
	var RechargeCtrl = function($scope, $rootScope, RechargeFact,
			AlertDialogFactory, $http,API) {
		$scope.RechargeModel = {};
		$scope.mobrech = true;
		$scope.circleEnable = false;
		$scope.addfield = false;
		$scope.datafetch = false;
		$scope.MobileForm = {};
		$scope.DthForm = {};
		$scope.DataCard = {};
		var original;

		$scope.RechargeModel = {
			Mtype : "Rr",
			phnumber : '',
			operator : '',
			amount : '',
			circle : '',
			accountNo : '',
			stdCode : '',
			auth : ''
		};

		$scope.progressbarflag = false;
		$scope.Rprogressbar = function(flag) {
			$scope.progressbarflag = flag;
		}

		original = angular.copy($scope.RechargeModel);
		$scope.revert = function() {
			$scope.RechargeModel = angular.copy(original);
			$scope.MobileForm.$setPristine();
			$scope.MobileForm.$setUntouched();
			return;
		};

		$scope.canSubmit = function(form) {
			$scope.MobileForm = form;
			return form.$valid
					&& !angular.equals($scope.RechargeModel, original);
		};

		$scope.OperatorCheck = function() {
			var inputMin = 5;
			if ($scope.RechargeModel.phnumber
					&& ($scope.RechargeModel.phnumber).length == inputMin) {
				console.log($scope.RechargeModel.phnumber);
				$http
						.get(
								API+'getoperator/' + $scope.RechargeModel.phnumber
										+ '.json')
						.then(
								function(success) {
									console.log(success.data);
									if (success.data.responseStatus == 1) {
										$scope.RechargeModel.operator = success.data.operatorByMobileNumberOutput.operatorDescription;
										// $scope.RechargeModel.operator =
										// "AIRCEL";
									}
								}, function(error) {
									console.log(error);

								});
			}
		};

		var circleChecker = function() {
			for (var i = 0; i < Number($rootScope.userfeature.length); i++) {

				if ($rootScope.userfeature[i].id == "10"||$rootScope.userfeature[i].id == "15") {
					$scope.circleflag = true;

				}
			}
		}

		circleChecker();

		$scope.MobileRecharge = function() {
			$scope.Rprogressbar(true);
			$scope.datafetch = true;
			if ($scope.RechargeModel.circle == null) {
				$scope.RechargeModel.circle = '';
			}
			RechargeFact.PostMobileRecharge($scope.RechargeModel.Mtype,
					$scope.RechargeModel.phnumber,
					$scope.RechargeModel.operator, $scope.RechargeModel.amount,
					$scope.RechargeModel.accountNo,
					$scope.RechargeModel.stdCode, $scope.RechargeModel.circle,
					$scope.RechargeModel.auth).then(
					function(successresponse) {
						$scope.Rprogressbar(false);
						$scope.datafetch = false;
						console.log("success posting");
						console.log(successresponse);
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);

						$scope.revert();

					},
					function(errormessage) {
						$scope.Rprogressbar(false);
						$scope.datafetch = false;
						console.log(errormessage);
						AlertDialogFactory.showAlert("RECHARGE FAILED!\n"
								+ errormessage.data.statusDesc, $scope);
					});
		};

		$scope.$watchGroup(
				[ 'RechargeModel.operator', 'RechargeModel.phnumber' ],
				function(currentval, oldval) {
					$scope.plansflag = false;
					if ($scope.RechargeModel.operator != ''
							&& $scope.RechargeModel.operator != null
							&& $scope.RechargeModel.phnumber != null
							&& $scope.RechargeModel.phnumber != ""
							&& currentval != oldval) {
						$scope.plansflag = true;
						$scope.plansdetails = null;
						$scope.RechargeModel.circle = null;

					} else {
						$scope.plansflag = false;
						$scope.show = false;
					}
				});
		$scope.$watch('RechargeModel.circle', function(currentval, oldval) {
			$scope.plans = false;
			if ($scope.RechargeModel.circle != ''
					&& $scope.RechargeModel.circle != null
					&& currentval != oldval) {
				$scope.browseplans('TUP');
				$scope.plans = true;
				$scope.plansdetails = null;

			} else {
				$scope.plans = false;
			}
		});

		$scope.$watchGroup([ 'mobrech', 'circleflag' ], function(currentval,
				oldval) {
			if ($scope.mobrech == true && $scope.circleflag == true)
				$scope.circleEnable = true;
		});

		$scope.priceChange = function(value) {
			$scope.RechargeModel.amount = parseInt(value);
		}
		$scope.browseplans = function(type) {
			$scope.Rprogressbar(true);
			$scope.RechargeType = type;
			var plans = JSON.stringify({
				'rechargeType' : $scope.RechargeType,
				'operatorCode' : $scope.RechargeModel.operator,
				'circleCode' : $scope.RechargeModel.circle
			});

			$http({
				method : 'POST',
				url : API+'joloplanService.json',
				contentType : 'application/json',
				data : plans
			})
					.then(
							function(successresponse) {
								$scope.Rprogressbar(false);
								console.log(successresponse.data);
								if (successresponse.data
										&& successresponse.data.constructor === Array) {
									$scope.plansdetails = successresponse.data;
									$scope.failure = null;
								} else {
									$scope.Rprogressbar(false);
									$scope.plansdetails = null;
									$scope.failure = "Sorry, no plans available for this category";
								}
								console.log($scope.plansdetails);
								// AlertDialogFactory.showAlert(successresponse.status,
								// $scope);

							},
							function(errorresponse) {
								AlertDialogFactory.showAlert(
										errorresponse.status, $scope);

							});
		}

		// special
		$scope.SpecialRechargeModel = {};
		var original11;

		$scope.SpecialRechargeModel = {
			Stype : "stv",
			phnumber : '',
			operator : '',
			amount : '',
			circle : '',
			accountNo : '',
			stdCode : '',
			auth : ''
		};

		original11 = angular.copy($scope.SpecialRechargeModel);

		$scope.revert11 = function() {
			$scope.SpecialRechargeModel = angular.copy(original11);
			$scope.SpecialForm.$setPristine();
			$scope.SpecialForm.$setUntouched();
			return;
		};

		$scope.canSubmit11 = function(form) {
			$scope.SpecialForm = form;
			return form.$valid
					&& !angular.equals($scope.SpecialRechargeModel, original11);
		};

		$scope.SpecialRecharge = function() {
			$scope.Rprogressbar(true);
			$scope.datafetch = true;
			RechargeFact.PostSpecialRecharge($scope.SpecialRechargeModel.Stype,
					$scope.SpecialRechargeModel.operator,
					$scope.SpecialRechargeModel.phnumber,
					$scope.SpecialRechargeModel.amount,
					$scope.SpecialRechargeModel.accountNo,
					$scope.SpecialRechargeModel.stdCode,
					$scope.SpecialRechargeModel.circle,
					$scope.SpecialRechargeModel.auth).then(
					function(successresponse) {
						$scope.datafetch = false;
						console.log("success posting");
						console.log(successresponse);
						$scope.Rprogressbar(false);
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);

						$scope.revert11();

					},
					function(errormessage) {
						$scope.datafetch = false;
						$scope.Rprogressbar(false);
						console.log(errormessage);
						AlertDialogFactory.showAlert("RECHARGE FAILED!\n"
								+ errormessage.data.statusDesc, $scope);

					});
		};

		// dth
		$scope.DthRechargeModel = {};

		var original1;

		$scope.DthRechargeModel = {
			Dtype : 'dth',
			operator : '',
			customerid : '',
			amount : '',
			accountNo : '',
			stdCode : '',
			circle : '',
			auth : ''
		};

		original1 = angular.copy($scope.DthRechargeModel);

		$scope.revert1 = function() {
			$scope.DthRechargeModel = angular.copy(original1);
			$scope.DthForm.$setPristine();
			$scope.DthForm.$setUntouched();
			return;
		};

		$scope.canSubmit1 = function(form) {
			$scope.DthForm = form;
			return form.$valid
					&& !angular.equals($scope.DthRechargeModel, original1);
		};

		$scope.DthRecharge = function() {
			$scope.Rprogressbar(true);
			$scope.datafetch = true;
			RechargeFact.PostDthRecharge($scope.DthRechargeModel.operator,
					$scope.DthRechargeModel.customerid,
					$scope.DthRechargeModel.amount,
					$scope.DthRechargeModel.accountNo,
					$scope.DthRechargeModel.stdCode,
					$scope.DthRechargeModel.Dtype,
					$scope.DthRechargeModel.circle,
					$scope.DthRechargeModel.auth).then(
					function(successresponse) {
						$scope.Rprogressbar(false);
						$scope.datafetch = false;
						console.log("success posting");
						console.log(successresponse);
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);

						$scope.revert1();

					},
					function(errormessage) {
						$scope.Rprogressbar(false);
						$scope.datafetch = false;
						console.log(errormessage);
						AlertDialogFactory.showAlert("RECHARGE FAILED!\n"
								+ errormessage.data.statusDesc, $scope);

					});
		};
		// datacard
		$scope.DataCardRechargeModel = {};

		var original2;

		$scope.DataCardRechargeModel = {
			DataType : 'datacard',
			datacardno : '',
			operator : '',
			amount : '',
			accountNo : '',
			stdCode : '',
			circle : '',
			auth : ''

		};

		original2 = angular.copy($scope.DataCardRechargeModel);
		$scope.revert2 = function() {
			$scope.DataCardRechargeModel = angular.copy(original2);
			$scope.DataCard.$setPristine();
			$scope.DataCard.$setUntouched();
			return;
		};

		$scope.canSubmit2 = function(form) {
			$scope.DataCard = form;
			return form.$valid
					&& !angular.equals($scope.DataCardRechargeModel, original2);
		};

		$scope.DataCardRecharge = function() {
			$scope.Rprogressbar(true);
			$scope.datafetch = true;
			RechargeFact.PostDataCardRecharge(
					$scope.DataCardRechargeModel.datacardno,
					$scope.DataCardRechargeModel.operator,
					$scope.DataCardRechargeModel.amount,
					$scope.DataCardRechargeModel.accountNo,
					$scope.DataCardRechargeModel.stdCode,
					$scope.DataCardRechargeModel.DataType,
					$scope.DataCardRechargeModel.circle,
					$scope.DataCardRechargeModel.auth).then(
					function(successresponse) {
						$scope.Rprogressbar(false);
						$scope.datafetch = false;
						console.log("success posting");
						console.log(successresponse);
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);

						$scope.revert2();

					},
					function(errormessage) {
						$scope.Rprogressbar(false);
						$scope.datafetch = false;
						console.log(errormessage);
						AlertDialogFactory.showAlert("RECHARGE FAILED!\n"
								+ errormessage.data.statusDesc, $scope);

					});
		};

		$scope.$watch('PostPaidRechargeModel.operator', function(currentval,
				oldval) {
			if (($scope.PostPaidRechargeModel.operator == null)
					&& (currentval == null))
				return;
			if (currentval == "BSNL POSTPAID") {
				$scope.addfield = true;
			} else {
				$scope.addfield = false;
			}
		});

		$scope.PostPaidRechargeModel = {};

		var original3;

		$scope.PostPaidRechargeModel = {
			PostPaidType : 'bill',
			datacardno : '',
			operator : '',
			amount : '',
			accountNo : '',
			stdCode : '',
			circle : '',
			auth : ''

		};

		original3 = angular.copy($scope.PostPaidRechargeModel);
		$scope.revert3 = function() {
			$scope.PostPaidRechargeModel = angular.copy(original3);
			$scope.PostPaid.$setPristine();
			$scope.PostPaid.$setUntouched();
			return;
		};

		$scope.canSubmit3 = function(form) {
			$scope.PostPaid = form;
			return form.$valid
					&& !angular.equals($scope.PostPaidRechargeModel, original3);
		};

		$scope.Postpaid_Recharge = function() {
			$scope.Rprogressbar(true);
			$scope.datafetch = true;
			RechargeFact.PostPaidRecharge(
					$scope.PostPaidRechargeModel.phnumber,
					$scope.PostPaidRechargeModel.operator,
					$scope.PostPaidRechargeModel.billamount,
					$scope.PostPaidRechargeModel.PostPaidType,
					$scope.PostPaidRechargeModel.accountNo,
					$scope.PostPaidRechargeModel.stdCode,
					$scope.PostPaidRechargeModel.circle,
					$scope.PostPaidRechargeModel.auth).then(
					function(successresponse) {
						$scope.Rprogressbar(false);
						$scope.datafetch = false;
						console.log("success posting");
						console.log(successresponse);
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
					},
					function(errormessage) {
						$scope.Rprogressbar(false);
						$scope.datafetch = false;
						console.log(errormessage);
						AlertDialogFactory.showAlert("RECHARGE FAILED!\n"
								+ errormessage.data.statusDesc, $scope);
					});
		};

		// utilityBill starts here

		$scope.UtilitybillModel = {};
		$scope.placeholderPhone = {};
		$scope.placeholderAccount = {};
		$scope.placeholderOperator = {};
		$scope.placeholderService = {};
		$scope.placeholderAmount = {};
		$scope.BSNLLANDLINE = {};
		$scope.BSNLLANDLINE = {
			PhoneNumber : "Phone Number",
			AccountNumber : "Account Number",
			SelectOperator : "Select Operator",
			ServiceType : "Service Type",
			Amount : "Amount"
		};

		$scope.MTNLDELHI = {};
		$scope.MTNLDELHI = {
			PhoneNumber : "Phone number",
			AccountNumber : "Customer Account Number",
			SelectOperator : "Select Operator",
			Amount : "Amount"
		};
		$scope.COMMON = {};
		$scope.COMMON = {
			PhoneNumber : "Customer number",
			SelectOperator : "Select Operator",
			Amount : "Amount"
		};
		$scope.Selected = {};
		$scope.Selected = {
			AccountNumber : "Account Number",
			PhoneNumber : "Number",
			SelectOperator : "Select Operator",
			Amount : "Amount"
		}
		$scope.MSEDC = {};
		$scope.MSEDC = {
			PhoneNumber : "Customer number",
			AccountNumber : "Billing Unit",
			SelectOperator : "Select Operator",
			ServiceType : "Processing Cycle",
			Amount : "Amount"
		}

		var original6;

		$scope.UtilitybillModel = {
			// utilityType : 'Utility_bills',
			datacardno : '',
			operator : '',
			amount : '',
			accountNo : '',
			stdCode : '',
			circle : '',
			auth : '',
			Bauth : ''

		};

		original6 = angular.copy($scope.UtilitybillModel);
		$scope.revert3 = function() {
			$scope.UtilitybillModel = angular.copy(original6);
			$scope.Utility.$setPristine();
			$scope.Utility.$setUntouched();
			return;
		};

		$scope.canSubmit6 = function(form) {
			$scope.Utility = form;
			return form.$valid
					&& !angular.equals($scope.UtilitybillModel, original6);
		};
		$scope.submitFlag = false;
		$scope.FetchBillAmount = function() {
			if ($scope.UtilitybillModel.auth == '') {
				var auth = $scope.UtilitybillModel.Bauth;
			} else {
				var auth = $scope.UtilitybillModel.auth;
			}
			$scope.Rprogressbar(true);
			var fetch_amount = JSON.stringify({
				'mobileNumber' : $scope.UtilitybillModel.phnumber,
				'operatorCode' : $scope.UtilitybillModel.operator,
				'amount' : $scope.UtilitybillModel.billamount,
				'stdCode' : $scope.UtilitybillModel.stdCode,
				'accountNo' : $scope.UtilitybillModel.accountNo,
				'rechargeType' : $scope.UtilitybillModel.utilityType,
				'circleCode' : $scope.UtilitybillModel.circle,
				'auth' : $scope.UtilitybillModel.auth
			});
			$http({
				method : 'POST',
				url : API+'fetchbillamount.json',
				contentType : 'application/json',
				data : fetch_amount
			})
					.then(
							function(successresponse) {
								$scope.Rprogressbar(false);
								$scope.UtilitybillModel.billamount = parseInt(successresponse.data.statusDesc);
								AlertDialogFactory
										.showAlert(
												"Your bill AMOUNT : Rs"
														+ successresponse.data.statusDesc
														+ "/-", $scope);
								$scope.submitFlag = true;
							},
							function(errorresponse) {
								$scope.submitFlag = false;
								$scope.Rprogressbar(false);
								AlertDialogFactory.showAlert(
										errorresponse.data.statusDesc, $scope);
							});
		};

		$scope.Utility_billpay = function() {
			$scope.Rprogressbar(true);
			$scope.datafetch = true;
			RechargeFact
					.UtilityBillPay($scope.UtilitybillModel.phnumber,
							$scope.UtilitybillModel.operator,
							$scope.UtilitybillModel.billamount,
							$scope.UtilitybillModel.utilityType,
							$scope.UtilitybillModel.accountNo,
							$scope.UtilitybillModel.stdCode,
							$scope.UtilitybillModel.circle,
							$scope.UtilitybillModel.auth,
							$scope.UtilitybillModel.Bauth)
					.then(
							function(successresponse) {
								$scope.Rprogressbar(false);
								$scope.datafetch = false;
								console.log("success posting");
								console.log(successresponse);
								AlertDialogFactory
										.showAlert(
												successresponse.data.statusDesc,
												$scope);
							},
							function(errormessage) {
								$scope.Rprogressbar(false);
								$scope.datafetch = false;
								console.log(errormessage);
								AlertDialogFactory.showAlert(
										"RECHARGE FAILED!\n"
												+ errormessage.data.statusDesc,
										$scope);
							});
		};

		/*
		 * $scope.isAccNoRequired= function(UtilitybillModel){
		 * $http.get('utilityOperatorsrequirements.json').success(function(data) {
		 * $scope.utilityOperatorsrequirements = data;
		 * if(data.UtilitybillModel.operator.equalsIgnorecase("true")) return
		 * true; else false; }); };
		 */
		$scope.AccoutField = false;
		$scope.AuthField = false;
		$scope.BauthField = false;
		// $scope.HideAccField = false;
		$scope
				.$watch(
						'UtilitybillModel.operator',
						function(currentval, oldval) {
							if ($scope.UtilitybillModel.operator == "Mahanagar Gas Limited Utility") {
								$scope.UtilitybillModel.utilityType = 'Utility_bills';
								$scope.AccoutField = true;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.placeholderPhone = $scope.Selected.PhoneNumber;
								$scope.placeholderAccount = $scope.Selected.AccountNumber;
								$scope.placeholderOperator = $scope.Selected.SelectOperator;
								$scope.placeholderAmount = $scope.Selected.Amount;

							} else if ($scope.UtilitybillModel.operator == "Tata AIG Life Utility"
									|| $scope.UtilitybillModel.operator == "ICICI Pru Life Utility") {
								$scope.UtilitybillModel.utilityType = 'Utility_bills';
								$scope.AccoutField = true;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = true;
								$scope.placeholderPhone = "Policy Number";
								$scope.placeholderAccount = "Date of Birth";
								$scope.placeholderOperator = $scope.Selected.SelectOperator;
								$scope.placeholderAmount = $scope.Selected.Amount;
							} else if ($scope.UtilitybillModel.operator == "Reliance Energy(Mumbai) Utility") {
								$scope.UtilitybillModel.utilityType = 'Utility_bills';
								$scope.AccoutField = true;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.placeholderPhone = "Customer number";
								$scope.placeholderAccount = "Cycle Number";
								$scope.placeholderOperator = $scope.Selected.SelectOperator;
								$scope.placeholderAmount = $scope.Selected.Amount;
							} else if ($scope.UtilitybillModel.operator == "Mahanagar Gas Limited Utility") {

								$scope.AccoutField = true;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.placeholderPhone = "Customer Account Number";
								$scope.placeholderAccount = "Bill Group Number";
								$scope.placeholderOperator = $scope.Selected.SelectOperator;
								$scope.placeholderAmount = $scope.Selected.Amount;

							} else if ($scope.UtilitybillModel.operator == "Torrent Power Utility") {
								$scope.UtilitybillModel.utilityType = 'Utility_bills';
								$scope.AccoutField = true;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.placeholderPhone = "Service Number";
								$scope.placeholderAccount = "City";
								$scope.placeholderOperator = $scope.Selected.SelectOperator;
								$scope.placeholderAmount = $scope.Selected.Amount;
							} else if ($scope.UtilitybillModel.operator == "MTNL Delhi LandLine Utility") {
								$scope.UtilitybillModel.utilityType = 'Utility_bills';
								$scope.AccoutField = true;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.placeholderPhone = $scope.MTNLDELHI.PhoneNumber;
								$scope.placeholderAccount = $scope.MTNLDELHI.AccountNumber;
								$scope.placeholderOperator = $scope.MTNLDELHI.SelectOperator;
								$scope.placeholderAmount = $scope.MTNLDELHI.Amount;
							}

							else if ($scope.UtilitybillModel.operator == "Brihan Mumbai Electric Supply and Transport Undertaking"
									|| $scope.UtilitybillModel.operator == "Southern power Distribution Company Ltd of Andhra Pradesh( APSPDCL)"
									|| $scope.UtilitybillModel.operator == "Gujarat Gas company Limited") {
								$scope.AccoutField = false;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.UtilitybillModel.utilityType = 'bill';
								$scope.placeholderPhone = "Service Number";
								$scope.placeholderOperator = $scope.COMMON.SelectOperator;
								$scope.placeholderAmount = $scope.COMMON.Amount;
							} else if ($scope.UtilitybillModel.operator == "Rajasthan Vidyut Vitran Nigam Limited") {
								$scope.AccoutField = false;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.UtilitybillModel.utilityType = 'bill';
								$scope.placeholderPhone = "K Number ";
								$scope.placeholderOperator = $scope.COMMON.SelectOperator;
								$scope.placeholderAmount = $scope.COMMON.Amount;
							} else if ($scope.UtilitybillModel.operator == "ADANI GAS") {
								$scope.AccoutField = false;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.UtilitybillModel.utilityType = 'bill';
								$scope.placeholderPhone = "Customer ID";
								$scope.placeholderOperator = $scope.COMMON.SelectOperator;
								$scope.placeholderAmount = $scope.COMMON.Amount;
							}

							else if ($scope.UtilitybillModel.operator == "BSES Rajdhani"
									|| $scope.UtilitybillModel.operator == "BSES Yamuna"
									|| $scope.UtilitybillModel.operator == "North Delhi Power Limited"
									|| $scope.UtilitybillModel.operator == "Madhya Pradesh Madhya Kshetra Vidyut Vitaran Company Limited - Bhopal"
									|| $scope.UtilitybillModel.operator == "Noida Power Company Limited"
									|| $scope.UtilitybillModel.operator == "Madhya Pradesh Paschim Kshetra Vidyut Vitaran Indor"
									|| $scope.UtilitybillModel.operator == "India Power Corporation Limited"
									|| $scope.UtilitybillModel.operator == "Bangalore Electricity Supply Company") {
								$scope.AccoutField = false;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.UtilitybillModel.utilityType = 'bill';
								$scope.placeholderPhone = $scope.COMMON.PhoneNumber;
								$scope.placeholderOperator = $scope.COMMON.SelectOperator;
								$scope.placeholderAmount = $scope.COMMON.Amount;
							}

							else if ($scope.UtilitybillModel.operator == "MSEDC Limited Utility") {
								$scope.UtilitybillModel.utilityType = 'Utility_bills';
								$scope.AccoutField = true;
								$scope.AuthField = true;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.UtilitybillModel.Bauth = '';
								$scope.placeholderPhone = $scope.MSEDC.PhoneNumber;
								$scope.placeholderAccount = $scope.MSEDC.AccountNumber;
								$scope.placeholderOperator = $scope.MSEDC.SelectOperator;
								$scope.placeholderAmount = $scope.MSEDC.Amount;
								$scope.placeholderService = $scope.MSEDC.ServiceType;

							} else if ($scope.UtilitybillModel.operator == "BSNL Landline Utility") {
								$scope.UtilitybillModel.utilityType = 'Utility_bills';
								$scope.AccoutField = true;
								$scope.AuthField = false;
								$scope.BauthField = true;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.UtilitybillModel.auth = '';
								$scope.placeholderPhone = $scope.BSNLLANDLINE.PhoneNumber;
								$scope.placeholderAccount = $scope.BSNLLANDLINE.AccountNumber;
								$scope.placeholderOperator = $scope.BSNLLANDLINE.SelectOperator;
								$scope.placeholderAmount = $scope.BSNLLANDLINE.Amount;
								$scope.placeholderService = $scope.BSNLLANDLINE.ServiceType;
							} else if ($scope.UtilitybillModel.operator == "Calcutta Electricity Supply Ltd") {
								$scope.UtilitybillModel.utilityType = 'bill';
								$scope.AccoutField = false;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.placeholderPhone = "Consumer ID";
								$scope.placeholderOperator = $scope.COMMON.SelectOperator;
								$scope.placeholderAmount = $scope.COMMON.Amount;
							} else if ($scope.UtilitybillModel.operator == "Chhattisgarh State Electricity Board"
									|| $scope.UtilitybillModel.operator == "Jamshedpur Utilities and Services Company Limited") {
								$scope.AccoutField = false;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.placeholderPhone = "Business Partener Number";
								$scope.placeholderOperator = $scope.COMMON.SelectOperator;
								$scope.placeholderAmount = $scope.COMMON.Amount;
							} else {
								$scope.UtilitybillModel.utilityType = 'bill';
								$scope.AccoutField = false;
								$scope.AuthField = false;
								$scope.BauthField = false;
								$scope.submitFlag = false;
								// $scope.HideAccField = false;
								$scope.placeholderPhone = $scope.COMMON.PhoneNumber;
								$scope.placeholderOperator = $scope.COMMON.SelectOperator;
								$scope.placeholderAmount = $scope.COMMON.Amount;
							}
						});

		$scope.$watch('UtilitybillModel.phnumber',
				function(currentval, oldval) {
					if (currentval !== oldval) {
						$scope.submitFlag = false;
					}
				});
	};

	RechargeCtrl.$inject = [ '$scope', '$rootScope', 'RechargeFact',
			'AlertDialogFactory', '$http' ,'API'];
	angular.module('app').controller('RechargeCtrl', RechargeCtrl);
}());
