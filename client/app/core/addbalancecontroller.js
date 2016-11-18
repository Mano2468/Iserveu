(function() {
	'use strict';

	var AddBalanceController = function($scope, $rootScope, AddBalancefactory,
			AlertDialogFactory) {
		var original;
		$scope.balance = {
			amount : '',
			comment : ''
		};
		$scope.datafetchflag = false;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}

		original = angular.copy($scope.balance);
		// https://github.com/angular/material/issues/1903
		$scope.revert = function() {
			$scope.balance = angular.copy(original);
			$scope.form_add_balance.$setPristine();
			$scope.form_add_balance.$setUntouched();
			return;
		};

		$scope.canRevert = function() {
			return !angular.equals($scope.balance, original)
					|| !$scope.form_add_balance.$pristine;
		};
		$scope.canSubmit = function() {
			return $scope.form_add_balance.$valid
					&& !angular.equals($scope.balance, original);
		};
		$scope.BalanceSubmit = function() {
			$scope.showInfoOnSubmit = true;
			console.log("inside  Balance controller");
			console.log($scope.balance);
			$scope.datafetchflag = true;
			AddBalancefactory.Postaddbalance($scope.balance.amount,
					$scope.balance.comment).then(
					function(balanceresponse) {
						$scope.datafetchflag = false;
						console.log("success posting");
						console.log(balanceresponse);
						AlertDialogFactory.showAlert(
								balanceresponse.data.statusDesc, $scope);
						console.log(balanceresponse.status);
						$rootScope.balance = balanceresponse.data.balance;
						$scope.revert();
					}, function(errormessage) {
						$scope.datafetchflag = false;
						console.log(errormessage);
						AlertDialogFactory.showAlert(
								"Some error occured.", $scope);
					});

		};
	};

	AddBalanceController.$inject = [ '$scope', '$rootScope',
			'AddBalancefactory', 'AlertDialogFactory' ];
	angular.module('app').controller('AddBalanceController',
			AddBalanceController);
}());