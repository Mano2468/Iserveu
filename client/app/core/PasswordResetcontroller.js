(function() {
	'use strict';

	angular.module('app').controller(
			'Password_ResetController',
			[ '$scope', '$uibModal',
					Password_ResetController ]).controller('modalchangeCrl',
			[ '$scope', '$uibModalInstance', '$http','API','AlertDialogFactory', modalchangeCrl ]);

	function Password_ResetController($scope, $uibModal) {

		$scope.animationsEnabled = true;

		$scope.password = function(size) {

		$uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : 'modal.html',
				controller : 'modalchangeCrl',
				size : size,

			});

		};

		$scope.toggleAnimation = function() {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};
	}

	function modalchangeCrl($scope, $uibModalInstance, $http,API, AlertDialogFactory) {

		$scope.password = {};
		$scope.PasswordReset = function() {
//			var passwordObj = JSON.stringify({
//				'password' : $scope.password.newpassword,
//
//			});

			var passwordparms = {};
			passwordparms.password = $scope.password.newpassword;
			$http.get(API+'changepassword.json', {
				params : passwordparms
			}).then(function(successresponse) {
				console.log(successresponse);
				// AlertDialogFactory.showAlert("Success!", $scope);
			}, function(errorresponse) {
				console.log(errorresponse);
				// AlertDialogFactory.showAlert("Some Error Occured", $scope);

			});

		};

		var original;

		$scope.password = {
			newpassword : '',
			confirmpassword : ''
		};

		original = angular.copy($scope.password);

		$scope.canSubmit = function(form) {
			return form && !angular.equals($scope.password, original);
		};



		$scope.cancel = function() {
			$uibModalInstance.dismiss("cancel");
		};

	}

})();
