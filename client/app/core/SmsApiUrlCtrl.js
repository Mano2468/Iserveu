(function() {
	'use strict';

	var SMSApiController = function($scope, $rootScope, $http,
			AlertDialogFactory,API) {
		$scope.smsurlModel = {};
		$scope.smsapiflag = false;
		$scope.reset = function(){
			getSMSurl();
		}
		$scope.SMSurl = function() {
			$scope.smsapiflag = true;
			$http({
				method : 'POST',
				url : API+'adminsmsapi.json',
				contentType : 'application/json',
				data : $scope.smsurlModel.sms
			}).then(
					function(successresponse) {
						$scope.smsapiflag = false;
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
					},
					function(errorresponse) {
						$scope.smsapiflag = false;
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		};
		var getSMSurl = function() {
			$scope.smsapiflag = true;
			$http.get(API+'adminsmsapi.json').then(function(successresponse) {
				$scope.smsapiflag = false;
				console.log(successresponse);
				$scope.smsurlModel.sms = successresponse.data.statusDesc;
			}, function(errormessage) {
				$scope.smsapiflag = false;
				console.log(errormessage);
			});
		};
		getSMSurl();
	};

	SMSApiController.$inject = [ '$scope', '$rootScope', '$http',
			'AlertDialogFactory','API' ];
	angular.module('app').controller('SMSApiController', SMSApiController);
}());
