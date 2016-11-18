(function() {
	'use strict';

	var AddBenecontroller = function($scope, AddBenefactory, DummyBanklist,
			AlertDialogFactory, $location, $http,API) {
		$scope.AddBenemodel = {};
		$scope.Ifsceflag = false;

		$scope.progressbarflag = false;
		$scope.progressbar = function(flag) {
			$scope.progressbarflag = flag;
		}

		$scope.AddBene = function() {
			$scope.progressbar(true);
			AddBenefactory.postbene($scope.AddBenemodel.Type,
					$scope.AddBenemodel.Choose, $scope.AddBenemodel.BeneName,
					$scope.AddBenemodel.Benemobile, $scope.AddBenemodel.Bname,
					$scope.AddBenemodel.Accno, $scope.AddBenemodel.State,
					$scope.AddBenemodel.City, $scope.AddBenemodel.Branch,
					$scope.AddBenemodel.Ifsc).then(
					function(successresponse) {
						console.log(successresponse);
						AlertDialogFactory.showAlert("Bene Added successfully",
								$scope);
						$location.path("benedetails");
					},
					function(errorresponse) {
						$scope.progressbar(false);
						AlertDialogFactory.showAlert(errorresponse.data.status,
								$scope);
					});
		};

		$scope.validIfsc = function(addbene_form) {
			var ifscobj = JSON.stringify({
				'ifsc' : $scope.AddBenemodel.Ifsc,
			});
			console.log(ifscobj);

			$scope.progressbar(true);
			$http({
				method : 'POST',
				url : API +'bank.json',
				contentType : 'application/json',
				data : ifscobj,
			})
					.then(
							function(successresponse) {
								console.log(successresponse);
								if (successresponse.data.ifsc !=null) {

									$scope.progressbar(false);
									addbene_form.ifsc.$setValidity("error",
											true);
									$scope.Ifsceflag = false;
									console.log(successresponse.data.ifsc);
									$scope.AddBenemodel.Bname = successresponse.data.bank;
									$scope.AddBenemodel.State = successresponse.data.state;
									$scope.AddBenemodel.City = successresponse.data.city;
									$scope.AddBenemodel.Branch = successresponse.data.branch;

								} else {
									$scope.progressbar(false);
									addbene_form.ifsc.$setValidity("error",
											false);
									$scope.Ifsceflag = true;
									AlertDialogFactory.showAlert(
											"IFSC CODE NOT FOUND!!", $scope);

								}
							},
							function(errorresponse) {
								console.log(errorresponse);
								AlertDialogFactory
										.showAlert(
												"Some error occured while fetching IFSC Code.",
												$scope);

							});

		}

	};

	AddBenecontroller.$inject = [ '$scope', 'AddBenefactory', 'DummyBanklist',
			'AlertDialogFactory', '$location', '$http','API' ];
	angular.module('app').controller('AddBenecontroller', AddBenecontroller);
}());
