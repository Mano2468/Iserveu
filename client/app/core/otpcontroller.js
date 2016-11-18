(function() {
	'use strict';

	var Otpcontroller = function($scope, $http, $location, NonKycFormfactory,AlertDialogFactory,API) {
		$scope.otpmodel = {};

		$scope.progressbarflag = false;
		$scope.progressbar = function(flag) {
			$scope.progressbarflag = flag;
		}

		$scope.OTP = function() {

			$scope.txanId = NonKycFormfactory.getData();

			var OtpObj = JSON.stringify({
				'otp' : $scope.otpmodel.Otp,
				'transactionId' : $scope.txanId
			});
			$scope.progressbar(true);
			$http({
				method : 'POST',
				url : API+'cashsenderregirster.json',
				contentType : 'application/json',
				data : OtpObj
			}).then(function(successresponse) {
				$scope.progressbar(false);
				$location.path("moneytransfersignin");
			}, function(errorresponse) {
				AlertDialogFactory.showAlert(errorresponse.data.statusDesc, $scope);
				$scope.progressbar(false);
			});
		};

		$scope.ResendOtp = function() {
			$scope.txanId = NonKycFormfactory.getData();
			var ResendOtpObj = JSON.stringify({
				'transactionId' : $scope.txanId
			});
			$scope.progressbar(true);
			$http({
				method : 'POST',
				url : API+'cashsenderresendotp.json',
				contentType : 'application/json',
				data : ResendOtpObj
			}).then(function(successresponse) {
				AlertDialogFactory.showAlert(successresponse.data.statusDesc, $scope);
				$scope.progressbar(false);
				// $location.path("/page/benedetails");
			}, function(errorresponse) {
				AlertDialogFactory.showAlert(errorresponse.data.statusDesc, $scope);
				$scope.progressbar(false);

			});
		};

	};

	Otpcontroller.$inject = [ '$scope', '$http', '$location',
			'NonKycFormfactory','AlertDialogFactory','API' ];
	angular.module('app').controller('Otpcontroller', Otpcontroller);
}());
