(function() {
	'use strict';

	var ModalPaymentController = function($scope, AlertDialogFactory,
			$uibModalInstance,Recipent_Name) {

		$scope.paymentModel = {};
		$scope.maxDate = new Date();
		var original;
		$scope.datafetchflag = false;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}

		$scope.paymentModel = {
			deposite_date : new Date(),
			sender_Name : Recipent_Name,
			sender_BankName : '',
			sender_AccountNO : '',
			amount : '',
			transfer_Type : '',
			bank_RefId : '',
			remarks : ''

		}

		original = angular.copy($scope.paymentModel);
		$scope.revert = function() {
			$scope.paymentModel = angular.copy(original);
			$scope.paymentForm.$setPristine();
			$scope.paymentForm.$setUntouched();
			return;
		};
		$scope.canRevert = function() {
			return !angular.equals($scope.paymentModel, original)
					|| !$scope.paymentForm.$pristine;
		};
		$scope.canSubmit = function(form) {
			return form && !angular.equals($scope.paymentModel, original);
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
		// WORKS FOR THE MODAL VIEW
		$scope.ok = function(validity) {
			$uibModalInstance.close($scope.paymentModel);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};
	};
	// payment controller
	var PaymentController = function($scope, PaymentDetails, AlertDialogFactory) {

		$scope.paymentModel = {};
		$scope.maxDate = new Date();
		var original;

		$scope.paymentModel = {
			deposite_date : '',
			sender_Name : '',
			sender_BankName : '',
			sender_AccountNO : '',
			amount : '',
			transfer_Type : '',
			bank_RefId : '',
			remarks : ''

		}

		original = angular.copy($scope.paymentModel);
		$scope.revert = function() {
			$scope.paymentModel = angular.copy(original);
			$scope.paymentForm.$setPristine();
			$scope.paymentForm.$setUntouched();
			return;
		};
		$scope.canRevert = function() {
			return !angular.equals($scope.paymentModel, original)
					|| !$scope.paymentForm.$pristine;
		};
		$scope.canSubmit = function(form) {
			return form && !angular.equals($scope.paymentModel, original);
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
		$scope.PaymentSubmit = function() {
			console.log("inside  PaymentSubmit");
			$scope.datafetchflag = true;
			var deposite_dateval = DateToString($scope.paymentModel.deposite_date);
			PaymentDetails
					.PostPayment($scope.paymentModel.sender_Name,
							$scope.paymentModel.sender_BankName,
							$scope.paymentModel.sender_AccountNO,
							deposite_dateval, $scope.paymentModel.amount,
							$scope.paymentModel.transfer_Type,
							$scope.paymentModel.bank_RefId,
							$scope.paymentModel.remarks)
					.then(
							function(successresponse) {
								$scope.datafetchflag = false;
								AlertDialogFactory
										.showAlert(
												successresponse.data.statusDesc,
												$scope);

								if($scope.canRevert)$scope.revert();

							},
							function(errormessage) {
								$scope.datafetchflag = false;
								console.log(errormessage);
								AlertDialogFactory.showAlert(
										"Some Error Occured.", $scope);
							});
		};
	};
	ModalPaymentController.$inject = [ '$scope', 'AlertDialogFactory',
			'$uibModalInstance','Recipent_Name' ];
	PaymentController.$inject = [ '$scope', 'PaymentDetails',
			'AlertDialogFactory' ];
	angular.module('app').controller('PaymentController', PaymentController)
			.controller('ModalPaymentController', ModalPaymentController);
}());
