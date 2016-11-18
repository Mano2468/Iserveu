(function() {
	'use strict';

	var ApiOtpcontroller = function($scope, $http, $location, ApiNonKycFormfactory,AlertDialogFactory,API) {
		$scope.otpmodel = {};

		$scope.progressbarflag = false;
		$scope.progressbar = function(flag) {
			$scope.progressbarflag = flag;
		}

		$scope.OTP = function() {

			$scope.txanId = ApiNonKycFormfactory.getData();

			var OtpObj = JSON.stringify({
				'otp' : $scope.otpmodel.Otp,
				'transactionId' : $scope.txanId
			});
			$scope.progressbar(true);
			$http({
				method : 'POST',
				url : API+'dcashsenderregirster.json',
				contentType : 'application/json',
				data : OtpObj
			}).then(function(successresponse) {
				$scope.progressbar(false);
				$location.path("page/Apimoneytransfersignin");
			}, function(errorresponse) {
				AlertDialogFactory.showAlert(errorresponse.data.statusDesc, $scope);
				$scope.progressbar(false);
			});
		};

		$scope.ResendOtp = function() {
			$scope.txanId = ApiNonKycFormfactory.getData();
			var ResendOtpObj = JSON.stringify({
				'transactionId' : $scope.txanId
			});
			$scope.progressbar(true);
			$http({
				method : 'POST',
				url : API+'dcashsenderresendotp.json',
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

	ApiOtpcontroller.$inject = [ '$scope', '$http', '$location',
			'ApiNonKycFormfactory','AlertDialogFactory','API' ];
	angular.module('app').controller('ApiOtpcontroller', ApiOtpcontroller);
}());
