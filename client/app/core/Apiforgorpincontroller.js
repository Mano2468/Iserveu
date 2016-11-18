(function() {
	'use strict';

	var ApiForgotPincontroller = function($scope, $http, $location,
			AlertDialogFactory,API) {
		$scope.forgotmodel = {};

		var original;

		$scope.forgotmodel = {
			Mobileno : ''
		}

		original = angular.copy($scope.forgotmodel);

		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.forgotmodel, original);
		};
		$scope.submitForm = function() {
			$scope.showInfoOnSubmit = true;
			return $scope.revert();
		};
		$scope.Pin = function() {

			var PinObj = JSON.stringify({
				'userMobileNumber' : $scope.forgotmodel.Mobileno
			});
			$http({
				method : 'POST',
				url : API+'dcashforgotpin.json',
				contentType : 'application/json',
				data : PinObj,
			}).then(function(successresponse) {
				AlertDialogFactory.showAlert(successresponse.status, $scope);
				$location.path("page/Apimoneytransfersignin");

			}, function(errorresponse) {
				AlertDialogFactory.showAlert(errorresponse.status, $scope);

			});
		};

	};

	ApiForgotPincontroller.$inject = [ '$scope', '$http', '$location',
			'AlertDialogFactory','API' ];
	angular.module('app').controller('ApiForgotPincontroller',
			ApiForgotPincontroller);
}());
