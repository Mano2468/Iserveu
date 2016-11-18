(function() {
	'use strict';

	var PromotionalController = function($rootScope, $scope, $http,
			AlertDialogFactory, AppService,API) {
		$scope.promotionalModel = {};
		$scope.PData = AppService.GetUserInfoStore();
		$scope.selection = [];
		$scope.toggleSelection = function toggleSelection(data) {
			var idx = $scope.selection.indexOf(data);

			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}

			else {
				$scope.selection.push(data);
			}
		};
		var checkbox = function() {
			if ($rootScope.usertype === "ROLE_MASTER_DISTRIBUTOR") {
				$scope.CheckBoxList = [ 'DISTRIBUTOR', 'RETAILER' ];
			} else {
				$scope.CheckBoxList = [ 'MASTER', 'DISTRIBUTOR', 'RETAILER' ];
			}
		}
		checkbox();
		$scope.promotional = function() {

			var promotionalObj = JSON.stringify({
				'promotionalMessage' : $scope.promotionalModel.comment,
				'roles' : $scope.selection
			});
			$http({
				method : 'POST',
				url : API+'updatePromotionalMessage.json',
				contentType : 'application/json',
				data : promotionalObj
			}).then(
					function(successresponse) {
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
					},
					function(errorresponse) {
						AlertDialogFactory.showAlert(
								errorresponse.data.statusDesc, $scope);
					});
		}

	};

	PromotionalController.$inject = [ '$rootScope', '$scope', '$http',
			'AlertDialogFactory', 'AppService' ,'API'];
	angular.module('app').controller('PromotionalController',
			PromotionalController);
}());
