(function() {
	'use strict';

	var RefundRequestController = function($scope, $http, AlertDialogFactory,API) {
		$scope.refunrequestflag = false;
		$scope.updatepending = function() {
			$scope.refunrequestflag = true;
			$http.get(API+'update-pending-transactions.json').then(
					function(successresponse) {
						$scope.refunrequestflag = false;
						if (successresponse.data == true) {
							AlertDialogFactory.showAlert("success");
							console.log(successresponse);
						} else {
							$scope.refunrequestflag = false;
							AlertDialogFactory
									.showAlert("some error occured!!");
						}
					})
		};

	};

	RefundRequestController.$inject = [ '$scope', '$http',
			'AlertDialogFactory', 'AppService','API' ];
	angular.module('app').controller('RefundRequestController',
			RefundRequestController);
}());
