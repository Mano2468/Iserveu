/*
    The below anonymous  function prevents global namespace collision
    there we have defined a single contoller  and finally passed it to
    the angular module contoller
 */
(function() {
	'use strict';
	// controller controlling the Transfer Money form
	var TransferController = function($scope, BeneDetails, TokenManger,
			$rootScope,AlertDialogFactory) {
		var ResetTransferForm = function() {
			$scope.notformactivate = true;
			$scope.disablepayflag = true;
			$scope.disablequickpayflag = true;
			// transfer form model object declaration
			$scope.transferFormModel = {};
			$scope.ChannelList = BeneDetails.getchannel();
			$scope.transferFormModel.transfermode = BeneDetails.getselect();

		};

		// initialization of tranfer form
		ResetTransferForm();
		// submit hit function for transfer form on pay button

		// progressbar
		// $scope.getenabled= function(list){
		// return list.selected;
		// }
		$scope.progressbarflag3 = false;
		$scope.panel3 = function(flag) {
			$scope.progressbarflag3 = flag;
		}
		var PrintPdf = function(PrintData) {
			var RecipentName = PrintData.recipient_name;
			var BankName = PrintData.bankName;
			var AccountNo = PrintData.account;
			// var Ifsc = PrintData.ifscCode;
			var Amount = PrintData.amount;
			var userName = $rootScope.user;
			var BrandName = $rootScope.BrandName;
			// var TransactionTd = PrintData.tid;
			var dd = {

				content : [
						{
							text : 'Retailer Name : ' + userName,
							style : 'header'
						},
						{
							text : BrandName,
							style : 'header',
							alignment : 'right'
						},

						{
							table : {
								// headers are automatically repeated if the
								// table spans
								// over multiple pages
								// you can declare how many rows should be
								// treated as
								// headers
								headerRows : 1,
								widths : [ '*', 'auto', 100, '*' ],
								body : [
										[ 'RecipentName', 'BankName',
												'AccountNo', 'Amount' ], [ {
											text : RecipentName,
											bold : true
										}, {
											text : BankName,
											bold : true
										}, {
											text : AccountNo,
											bold : true
										}, {
											text : Amount,
											bold : true
										} ], ]
							}
						}, {
							text : '\nThank You\n' + BrandName,
							style : 'header2',
							alignment : 'right'
						}, ],
				styles : {
					header : {
						fontSize : 18,
						bold : true,
						margin : [ 0, 0, 0, 10 ]
					},
					subheader : {
						fontSize : 16,
						bold : true,
						margin : [ 0, 10, 0, 5 ]
					},
					tableExample : {
						margin : [ 0, 5, 0, 15 ]
					},
					tableHeader : {
						bold : true,
						fontSize : 13,
						color : 'black'
					}
				},
				defaultStyle : {
				// alignment: 'justify'
				}
			};
			var date = new Date();
			var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
					+ date.getDate() + " " + date.getHours() + ":"
					+ date.getMinutes() + ":" + date.getSeconds();
			pdfMake.createPdf(dd).download('receipt-' + str + '.pdf');
		};

		$scope.messageFlag = false;
		$scope.$on("IMPS DOWN", function(event, data) {
			console.log(data);
			$scope.messageFlag = true;
		});
		$scope.$on("message", function(event, data) {
			console.log(data);
			$scope.messageFlag = false;
		});

		$scope.transferFormSubmit = function(valid) {
			var ifscvalidity = BeneDetails.ifscget()
			if (valid && ifscvalidity) {
				console.log($scope.transferFormModel);

				$scope.panel3(true);
				BeneDetails
						.PostPay($scope.transferFormModel.amount,
								$scope.transferFormModel.transfermode,
								TokenManger.getToken())
						.then(
								function(successresponse) {
									$scope.panel3(false);
									console.log(successresponse);
									var PrintData = successresponse.data;
									PrintData.amount = angular
											.copy($scope.transferFormModel.amount);
									$scope.$emit("updateBalanceTrx", {
										message : "update"
									});
									TokenManger.setToken(successresponse.token);
									// generalised common case for adding bene
									// to the list
									var statusvalue = successresponse.status;
									if (statusvalue === 0
											|| (statusvalue >= -52 && statusvalue <= -50)) {
										BeneDetails
												.setNewBene(successresponse.data);
										$rootScope.$broadcast("new_bene_added",
												"update bene_list");
									}
									// performing actions based on status data
									// using switch
									switch (statusvalue) {
									case 0:

										// update the max limit amount
										AlertDialogFactory
												.PdfConfirm(
														successresponse.message,
														$scope)
												.then(function() {
													PrintPdf(PrintData);

												}, function() {

												});

										/*
										 * $scope.amountRemaining =
										 * $scope.amountRemaining -
										 * $scope.transferFormModel.amount;
										 */
										$rootScope
												.$broadcast(
														'RecipientFormActive',
														"now you can start transaction again");
										break;
									case -50:

										AlertDialogFactory
												.showAlert(
														"Beneficiary added but money transfer failed due to insufficinet Balance",
														$scope);

										break;
									case -51:

										AlertDialogFactory
												.showAlert(
														"Beneficiary added but money transfer failed as Escrow transaction limit reached try again after some time",
														$scope);

										break;
									case -52:

										AlertDialogFactory
												.showAlert(
														"Beneficiary added but money transfer failed ",
														$scope);

										break;
									case -46:

										AlertDialogFactory
												.showAlert(
														"Maximum Beneficiary count Limit reached try removing a Beneficiary before adding  a new ",
														$scope);

										break;
									case -47:

										AlertDialogFactory
												.showAlert(
														"Invalid account try again ...",
														$scope);

										break;
									case -48:

										AlertDialogFactory
												.showAlert(
														"Activating Quick pay as Beneficiary exists ...",
														$scope);

										$scope.disablequickpayflag = false;
										$scope.disablepayflag = true;

										break;
									default:

										AlertDialogFactory
												.showAlert(
														successresponse.message,
														$scope);

									}
								},
								function(errormessage) {
									$scope.panel3(false);
									console.log(errormessage);
									AlertDialogFactory.showAlert(
											errormessage.data.data.message,
											$scope);

								});
			} else {
				console.log("no data to show");
			}
		};

		// used to handle the qick pay process of the users.for a existing bene
		// in the bene list
		$scope.QuickPay = function(validity) {

			if (validity) {

				// $scope.transferFormModel.loginkey,
				$scope.panel3(true);
				BeneDetails
						.PostQuickPay($scope.transferFormModel.amount,
								$scope.transferFormModel.transfermode,
								TokenManger.getToken())
						.then(
								function(successresponse) {
									$scope.panel3(false);
									console.log(successresponse);
									var QData = BeneDetails
											.getBeneDataQuickpay();
									var QPrintData = {
										"account" : QData.account,
										"bankName" : QData.bank,
										"recipient_name" : QData.recipient_name,
										"amount" : $scope.transferFormModel.amount

									}
									$scope.$emit("updateBalanceTrx", {
										message : "update"
									});
									TokenManger.setToken(successresponse.token);
									$scope.notformactivate = true;
									switch (successresponse.status) {
									case 0:

										/*
										 * AlertDialogFactory.showAlert(
										 * successresponse.message, $scope);
										 */
										AlertDialogFactory
												.PdfConfirm(
														successresponse.message,
														$scope)
												.then(function() {
													PrintPdf(QPrintData);

												}, function() {

												});

										// update the max amount limit

										// $scope.amountRemaining =
										// $scope.amountRemaining
										// - $scope.transferFormModel.amount;
										// $rootScope
										// .$broadcast('resetphone_No',
										// "now you can reset for new
										// transaction");

										$rootScope
												.$broadcast(
														'RecipientFormActive',
														"now you can start transaction again");
										break;
									case -53:

										AlertDialogFactory
												.showAlert(
														"You have insufficient balance",
														$scope);

										break;
									case -54:
										AlertDialogFactory
												.showAlert(
														"Your allowed Escrow balance limit is already reached",
														$scope);

										break;
									case -55:

										AlertDialogFactory
												.showAlert(
														"Invalid Bank / Transation failure",
														$scope);

										break;
									default:

										AlertDialogFactory
												.showAlert(
														successresponse.message,
														$scope);

									}
								},
								function(errormessage) {
									$scope.panel3(false);
									console.log(errormessage);
									AlertDialogFactory.showAlert(
											errormessage.data.message, $scope);

								});
			}
		};
		// on the recipt of broadcast from bene list if bene is selected
		$scope.$on('QuickFundtransfer', function(event, data) {
			console.log(data);
			ResetTransferForm();
			// activate the fundtransfer form
			$scope.notformactivate = false;
			$scope.disablepayflag = true;
			$scope.disablequickpayflag = false;
			// $scope.amountRemaining = BeneDetails.getQuickPayMaxLimitData();
		});
		// deactivate quickpay
		$scope.$on('QuickFundtransfer_stop', function(event, data) {
			console.log(data);
			$scope.notformactivate = true;
			$scope.disablepayflag = true;
			$scope.disablequickpayflag = true;
		});
		// deactivate the form when some one changes the customer phone number
		// in the process of transaction
		$scope.$on('no_access', function(event, data) {
			console.log(data);
			// reset all form fields
			ResetTransferForm();
		});
		// activats the pay button when bene data activated broadcast is
		// recieved
		// from recipient controller
		$scope.$on('paybene_data_available', function(event, data) {
			console.log(data);
			ResetTransferForm();
			$scope.notformactivate = false;
			$scope.disablepayflag = false;
			$scope.disablequickpayflag = true;
			$scope.amountRemaining = BeneDetails.getPayMaxLimitData();
		});
		// deactivate the transfer form if user tries to make changes in the add
		// bene form while transfer form is active
		$scope.$on('paybene_data_unavailable', function(event, data) {
			console.log(data);
			ResetTransferForm();
		});
	};
	// inject prevents the uglifier minifier to break the angular app
	TransferController.$inject = [ '$scope', 'BeneDetails', 'TokenManger',
			'$rootScope', 'AlertDialogFactory' ];

	// add the controllers to angular module
	angular.module('app').controller('TransferController', TransferController);
}());
