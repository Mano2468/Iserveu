/*
    The below anonymous  function prevents global namespace collision
    there we have defined a single contoller  and finally passed it to
    the angular module contoller
 */
(function() {
	'use strict';
	// controller controlling the sender form
	var SendController = function($scope, $http,SenderDetails,
			TokenManger, $rootScope, $location,
			AlertDialogFactory,API) {
		// flags handling show hide in ui
		$scope.regflag = false;
		$scope.newadd = true;
		$scope.otpflag = false;
		$scope.enrollflag = false;
		$scope.limitflag = false;
		var verifyMessageFlag = false;

		// signin form model object declaration and response vars
		$scope.senderFormModel = {};
		// retail login
		$scope.transactionmodel = {};

		// signin response data
		var restresponse = {};
		// signup data needed for verification
		var verifydata = {};
		// reset the sender form
		$scope.clearsenderform = function() {
			$scope.senderFormModel.phoneno = "";
			$scope.senderFormModel.sendername = "";
			$scope.senderFormModel.otpnumber = "";
			$scope.limitflag = false;

		};
		// reset when we get a success response from transaction success form
		// $scope.$on("resetphone_No", function(event, data) {
		// $scope.clearsenderform();
		// });
		// click on the reload button causes to log out and start a complete new
		// session
		// $scope.LogOut = function() {
		// 	LoginFactory.logOut();
		// 	$rootScope.auth = LoginFactory.isAuthenticated();
		// 	$location.path("/login");
		// }
		// secondary function to perform operations after data fetch is
		// successful
		var senderOperator = function() {
			// check status and see if user is not present in data base
			// then add customer
			var statusdata = SenderDetails.checkStatus();
			if (statusdata === -37 || statusdata === -31) {
				// User does not exist in system
				// helps in conditional disabling of phoneno field
				$scope.regflag = true;
				$scope.newadd = false;
				$scope.limitflag = false;

				AlertDialogFactory.showAlert(
						"Customer needs to enroll with verification", $scope);

			} else if (statusdata === 0) {
				// user exists in system and the data is with us
				// so we broadcast that to RecipientController
				$rootScope.$broadcast('data_available_now',
						"DataAccess: activated");
				if (verifyMessageFlag) {

					// AlertDialogFactory.showAlert(
					// "Customer verified and Beneficiary List Activated",
					// $scope);

					verifyMessageFlag = false;
				} else {

					// AlertDialogFactory.showAlert("Beneficiary List
					// Activated",
					// $scope);

				}
				// as we are getting the successful data for customer
				// So stop the phoneno validation watcher
				// unregPhonevalid()
			} else if (statusdata === -35 && verifyMessageFlag) {

				AlertDialogFactory.showAlert(
						"Customer is not verified try resending otp", $scope);
				verifyMessageFlag = false;
			} else {
				// unknown error cases do nothing and simply log it to
				// console
				// and needs to remove these true false statements
				// $scope.regflag = true;
				// $scope.newadd = false;
				if (verifyMessageFlag) {
					AlertDialogFactory.showAlert(
							"Unknown verification error try again  resend OTP",
							$scope);
					$scope.senderFormModel.otpnumber = "";
					verifyMessageFlag = false;
				} else {

					AlertDialogFactory
							.showAlert(
									"Unknown error try again entering phone number in login form",
									$scope);
					$scope.senderFormModel.phoneno = "";
				}
			}
		};

		// function making call to get the valid user data only active when only
		// login not while enroll
		var MakeGetCustomerDataCall = function(validity) {
			if ((validity && $scope.senderFormModel.phoneno != null)
					&& !$scope.regflag) {
				console.log("getting customer data");
				// allows to show the progress of sending data to server
				$scope.panel1(true);
				SenderDetails
						.GetUserData($scope.senderFormModel.phoneno,
								TokenManger.getToken())
						.then(
								function(successmessage) {
									restresponse = successmessage.data;
									console.log(restresponse);
									$scope.panel1(false);
									$rootScope.$broadcast('BalanceLimit');

									// TokenManger.setToken(restresponse.token);
									SenderDetails.extractdataObj(restresponse);
									// // //
									// call the sender operator function to
									// perform further business logic operations
									senderOperator();
								},
								function(errormessage) {
									$scope.panel1(false);

									AlertDialogFactory
											.showAlert(
													"Error Fetcheing customer data try again ...",
													$scope);
									$scope.senderFormModel.phoneno = "";
								});
			}
		};

		// Auto submit hit function for sender form when phone number is valid
		// using watcher
		var unregPhonevalid = $scope.$watch('signinForm.customerphno.$valid',
				function(validity) {
					$rootScope.$broadcast('no_access', "DataAccess: inactive");
					MakeGetCustomerDataCall(validity);

				});

		// catch data for the otp verification
		var verifyextractor = function() {
			SenderDetails.extractVerifyData(verifydata);
			// check for the status
			var statusdata = verifydata.status;
			if (statusdata === 0) {
				$scope.regflag = false;
				$scope.otpflag = true;
				$scope.otpvalue = verifydata.data.otp;
				if (resendFlag) {

					AlertDialogFactory
							.showAlert(
									"New otp send success and proceed to OTP verification",
									$scope);
					resendFlag = !resendFlag;
				} else {

					// AlertDialogFactory
					// .showAlert(
					// "Customer Enrollment completed and proceed to OTP
					// verification",
					// $scope);
				}
			} else if (statusdata === 30 || statusdata === 31) {
				// remove the 31 status if not requied for resend otp case
				// sender already exists so we redirect it to get customer
				// details
				$scope.regflag = false;
				$scope.newadd = true;
				AlertDialogFactory.showAlert("Customer already exists", $scope);

				// call the get data function
				MakeGetCustomerDataCall($scope.signinForm.customerphno.$valid);
			} else if (statusdata === -36 && resendFlag) {
				// remove if this case is not hit for resend otp case

				AlertDialogFactory.showAlert(
						"Not Enrolled as a customer already:", $scope);
				resendFlag = !resendFlag;
			} else {
				AlertDialogFactory.showAlert("Enrollment Failed:", $scope);
				console.log("Enrollment on server Failed try again");
				$scope.enrollflag = false;
			}
		};
		$scope.progressbarflag1 = false;
		$scope.panel1 = function(flag) {
			$scope.progressbarflag1 = flag;
		}
		// Erolls a new user on submit click
		$scope.SubmitEnroll = function(formisvalid) {

			if (formisvalid) {
				console.log("I am submitted enrollment data");
				$scope.enrollflag = true;
				$scope.panel1(true);
				// make a post request and colect response data
				SenderDetails.PostNewUserData($scope.senderFormModel,
						TokenManger.getToken()).then(
						function(successresponse) {
							console.log("success");
							$scope.panel1(false);
							console.log(successresponse);
							verifydata = successresponse;
							TokenManger.setToken(successresponse.token);
							verifyextractor();
						},
						function(errormessage) {
							$scope.panel1(false);
							console.log("Enrollment response error");

							AlertDialogFactory.showAlert(
									"Error Fetcheing verify data try again:",
									$scope);
							$scope.enrollflag = false;
						});
			}
		};
		$scope.SubmitEnroll.$inject = [ 'formisvalid' ];

		// OTP verifier function is called only after data is loaded
		$scope.OtpVerify = function(validity) {

			if (validity) {
				console.log("sending OTP for verification");
				$scope.panel1(true);
				SenderDetails
						.PostVerificationData($scope.senderFormModel.phoneno,
								$scope.senderFormModel.otpnumber,
								TokenManger.getToken())
						.then(
								function(successresponse) {
									console.log("verification success");
									$scope.panel1(false);
									console.log(successresponse.data);
									restresponse = successresponse;
									TokenManger.setToken(successresponse.token);
									SenderDetails.extractdataObj(restresponse);
									$scope.otpflag = false;
									verifyMessageFlag = true;
									// call the sender operator function to
									// perform further business logic operations
									senderOperator();
								},
								function(errormessage) {
									$scope.panel1(false);
									console.log("verification response error");

									AlertDialogFactory
											.showAlert(
													"Error Fetcheing verify otp response Resend OTP:",
													$scope);
								});
			} else {
				console.log("otp mismatch");
			}
		};

		// otp resend function for resending the otp
		var resendFlag = false;
		$scope.ResendOtp = function(validity) {
			// NOTE here based on enrollment form validity we are allowing to
			// make a resend request
			// remove this validity check if not needed

			if (validity) {
				console.log("resending otp new request");
				$scope.panel1(true);
				SenderDetails.PostResendotp($scope.senderFormModel.phoneno,
						TokenManger.getToken()).then(
						function(successresponse) {
							console.log(successresponse);
							TokenManger.setToken(successresponse.token);
							verifydata = successresponse;
							// sets resendFlag to true used in the verify
							// extractor for status showing
							resendFlag = !resendFlag;
							$scope.panel1(false);
							verifyextractor();

						},
						function(errormessage) {
							$scope.panel1(false);
							console.log(errormessage);

							AlertDialogFactory.showAlert(
									"Error Fetcheing verify data try again",
									$scope);
						});
			}
		};

		// progressbar

		$scope.progressbarflag1 = false;
		$scope.pranel1 = function(flag) {
			$scope.progressbarflag1 = flag;
		}

		// for refund

		$scope.Refund = function() {
			$scope.panel1(true);
			var refundobj = JSON.stringify({
				'tid' : $scope.transactionmodel.id,
				'otp' : $scope.transactionmodel.otp
			});
			console.log(refundobj);
			$http({
				method : 'POST',
				url : API+'refund-transaction.json',
				contentType : 'application/json',
				data : refundobj,
			}).then(
					function(successresponse) {
						console.log(successresponse);
						$scope.panel1(false);
						AlertDialogFactory.showAlert(
								successresponse.data.message, $scope);
					},
					function(errorresponse) {
						console.log(errorresponse);
						AlertDialogFactory.showAlert(
								errorresponse.data.message, $scope);
						$scope.panel1(false);

					});
		};

		$scope.RefundOtp = function(transactionId) {
			if (transactionId == null)
				return;
			$scope.panel1(true);
			var refundotp = JSON.stringify({
				'transactionID' : transactionId
			});
			console.log(refundotp);
			$http({
				method : 'POST',
				url : API+'refundresendotp.json',
				contentType : 'application/json',
				data : refundotp,
			}).then(
					function(successresponse) {
						console.log(successresponse);
						$scope.panel1(false);
						AlertDialogFactory.showAlert(
								successresponse.data.message, $scope);
					},
					function(errorresponse) {
						console.log(errorresponse);

						$scope.panel1(false);
						AlertDialogFactory.showAlert(
								errorresponse.data.message, $scope);

					});
		};

		$scope.$on('BalanceLimit', function(event, data) {
			$scope.limitflag = true;
			$scope.amountRemaining =parseFloat(restresponse.data.limit[0].remaining)+parseFloat(restresponse.data.limit[1].remaining);
			if($scope.amountRemaining>=25000){
				$scope.amountRemaining=$scope.amountRemaining-25000;
			}
		});

		$scope.$watch('senderFormModel.phoneno', function(currentval, oldval) {
			if (currentval != oldval)
				$scope.limitflag = false;
		});

		$scope.Ekotransaction = function() {
			$location.path("page/ekotransaction");
		};
	};

	// inject prevents the uglifier minifier to break the angular app
	SendController.$inject = [ '$scope', '$http', 'SenderDetails',
			'TokenManger', '$rootScope', '$location',
			'AlertDialogFactory','API'];

	// add the controllers to angular module
	angular.module('app').controller('SendController', SendController);
}());
