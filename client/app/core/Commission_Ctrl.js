(function() {
	'use strict';

	var CommissionController = function($scope, $http, BasePackageFact,
			AlertDialogFactory,API) {
		var Commission = function() {
			BasePackageFact.GetBasePackage().then(function(response) {
				console.log(response.data);
				$scope.commission = response.data;
			}, function(errormessage) {
				console.log(errormessage);
			});
		};
		Commission();
	};

	CommissionController.$inject = [ '$scope', '$http', 'BasePackageFact',
			'AlertDialogFactory', 'API'];
	angular.module('app').controller('CommissionController',
			CommissionController);
}());
