(function() {
	'use strict';
	var KracRechargeCtrl = function($scope, KracRechargeFact,
			AlertDialogFactory) {
		$scope.RechargeModel = {};
		$scope.RechargeModel.Ttype = "Rr";
		$scope.topup = true;
		$scope.datafetch = false;
		$scope.TopUpForm = {};
		$scope.SpecialForm = {};
		$scope.DthForm = {};

      $scope.progressbarflag = false;
		$scope.progressbar = function(flag) {
			$scope.progressbarflag = flag;
		}


		var original;

		$scope.RechargeModel = {
		Ttype: "Rr"	,		
		phnumber : '',
		operator : '',
		amount : ''
		};

		original = angular.copy($scope.RechargeModel);
		$scope.revert = function() {
		$scope.RechargeModel = angular.copy(original);
		$scope.TopUpForm.$setPristine();
		$scope.TopUpForm.$setUntouched();
		return;
		};

		$scope.canSubmit = function(form) {
		$scope.TopUpForm = form;
		return form.$valid
		&& !angular.equals($scope.RechargeModel, original);
		};

		$scope.TopUp = function() {
			$scope.progressbar(true);
			$scope.datafetch = true;
			KracRechargeFact
					.PostTopUpRecharge($scope.RechargeModel.Ttype,$scope.RechargeModel.phnumber,
							$scope.RechargeModel.operator,
							$scope.RechargeModel.amount)
					.then(
							function(successresponse) {
								$scope.datafetch = false; 
								console.log("success posting");
								console.log(successresponse);
								$scope.progressbar(false);
								$scope.$emit("updateBalanceTrx", {message : "update"});
								AlertDialogFactory.showAlert(
										"RECHARGE SUCCESS", $scope);

								$scope.revert();

							},
							function(errormessage) {
								$scope.datafetch = false;
								$scope.progressbar(false);
							
								console.log(errormessage);
								AlertDialogFactory
										.showAlert(
												"RECHARGE FAILED!\n"
														+ errormessage.data.statusDesc,
												$scope);
							});
		};

		// special
		$scope.SpecialRechargeModel = {};
        $scope.SpecialRechargeModel.Stype = "stv";
		var original1;

		$scope.SpecialRechargeModel = {
		Stype: "stv",
		phnumber : '',
		operator : '',
		amount : ''
		};

		original1 = angular.copy($scope.SpecialRechargeModel);

		$scope.revert1 = function() {
		$scope.SpecialRechargeModel = angular.copy(original1);
		$scope.SpecialForm.$setPristine();
		$scope.SpecialForm.$setUntouched();
		return;
		};

		$scope.canSubmit1 = function(form) {
		$scope.SpecialForm = form;
		return form.$valid
		&& !angular.equals($scope.SpecialRechargeModel, original1);
		};

		$scope.SpecialRecharge = function() {
			$scope.progressbar(true);
			$scope.datafetch = true;
			KracRechargeFact.PostSpecialRecharge($scope.SpecialRechargeModel.Stype,$scope.SpecialRechargeModel.operator,
					$scope.SpecialRechargeModel.phnumber,
					$scope.SpecialRechargeModel.amount).then(
					function(successresponse) {
						$scope.datafetch = false;
						console.log("success posting");
						console.log(successresponse);
						$scope.progressbar(false);
						AlertDialogFactory.showAlert("SPECIAL RECHARGE SUCCESS",
								$scope);
						$scope.$emit("updateBalanceTrx", {message : "update"});

						$scope.revert1();

					},
					function(errormessage) {
						$scope.datafetch = false;
						$scope.progressbar(false);
						console.log(errormessage);
						AlertDialogFactory.showAlert("RECHARGE FAILED!\n"
								+ errormessage.data.statusDesc, $scope);
						
					});
		};
		// datacard
		$scope.DthRechargeModel = {};
       $scope.DthRechargeModel.Dtype = "dth" ;
		var original2;

		$scope.DthRechargeModel = {
		Dtype: "dth",
		customerid : '',
		operator : '',
		amount : ''
		};

		original2 = angular.copy($scope.DthRechargeModel);
		$scope.revert2 = function() {
		$scope.DthRechargeModel = angular.copy(original2);
		$scope.DthForm.$setPristine();
		$scope.DthForm.$setUntouched();
		return;
		};

		 $scope.canSubmit2 = function(form) {
		 $scope.DthForm = form;
		 return form.$valid
		 && !angular.equals($scope.DthRechargeModel, original2);
		 };

		$scope.DthRecharge = function() {
			$scope.progressbar(true);
			$scope.datafetch = true;
			KracRechargeFact.PostDthRecharge(
				     $scope.DthRechargeModel.Dtype ,
					$scope.DthRechargeModel.customerid,
					$scope.DthRechargeModel.operator,
					$scope.DthRechargeModel.amount).then(
					function(successresponse) {
						$scope.datafetch = false;
						$scope.progressbar(false);
						console.log("success posting");
						console.log(successresponse);
						AlertDialogFactory.showAlert(
								"DTH RECHARGE SUCCESS", $scope);
						$scope.$emit("updateBalanceTrx", {message : "update"});
						
						 $scope.revert2();

					},
					function(errormessage) {
						$scope.datafetch = false;
						$scope.progressbar(false);
						console.log(errormessage);
						AlertDialogFactory
								.showAlert("RECHARGE FAILED!\n"
								+ errormessage.data.statusDesc, $scope);
						
					});
		};

	};
	KracRechargeCtrl.$inject = [ '$scope', 'KracRechargeFact',
			'AlertDialogFactory' ];
	angular.module('app').controller('KracRechargeCtrl', KracRechargeCtrl);
}());
