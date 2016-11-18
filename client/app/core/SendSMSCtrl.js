(function() {
	'use strict';

	var SendSmsController = function($scope, $http, AlertDialogFactory,API) {
		$scope.SendSmsModel = {};
		$scope.SendSmsflag = false;
		$scope.SmsSendform = {};
		var original1 = angular.copy($scope.SendSmsModel);
		$scope.revert = function() {
			$scope.SendSmsModel = angular.copy(original1);
			$scope.SmsSendform.$setPristine();
			$scope.SmsSendform.$setUntouched();
			return;
		};

		$scope.SendSMS = function() {
			$scope.SendSmsflag = true;
			var urlObj = JSON.stringify({
				'msg' : $scope.SendSmsModel.message,
				'group' : $scope.SendSmsModel.group
			});
			$http({
				method : 'POST',
				url : API+'sendgroupsms.json',
				contentType : 'application/json',
				data : urlObj
			}).then(
					function(successresponse) {
						$scope.SendSmsflag = false;
						$scope.revert();
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
					},
					function(errorresponse) {
						$scope.SendSmsflag = false;
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		};
	};

	SendSmsController.$inject = [ '$scope', '$http', 'AlertDialogFactory' ];
	angular.module('app').controller('SendSmsController', SendSmsController);
}());
