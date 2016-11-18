(function() {
	'use strict';

	var CreateUser = function($rootScope, $scope, $http, $q, $timeout,
			WizardHandler, NewUserDetails, AlertDialogFactory,API) {

		$scope.newUserModel = {};
		$scope.form_user_name = {};

		$scope.form_signup = {};
		$scope.canExit = false;
		$scope.stepActive = true;
		$scope.datafetchflag = false;
		$scope.featureselectFlag = true;
		$scope.showdatafetch = function(flag) {
			$scope.datafetchflag = flag;
		}
		//"USER",
		if ($rootScope.usertype === "ROLE_SUPER_ADMIN") {
			$scope.userTypeList = [  "ADMIN" ];
		}else if ($rootScope.usertype === "ROLE_ADMIN") {
			$scope.userTypeList = [  "MASTER DISTRIBUTOR",
					"DISTRIBUTOR", "RETAILER" ];
		} else if ($rootScope.usertype === "ROLE_MASTER_DISTRIBUTOR") {
			$scope.userTypeList = [ "DISTRIBUTOR", "RETAILER" ];
		} else if ($rootScope.usertype === "ROLE_DISTRIBUTOR") {
			$scope.userTypeList = [ "RETAILER" ];
		}

		var original1;
		var original2;
		$scope.newUserModel = {
			userType : '',
			firstName : '',
			lastName : '',
			email : '',
			mobileNumber : '',
			city : '',
			state : '',
			address : '',

		}

		$scope.userNameModel = {
			userNameExist : true,
			userName : '',
			password : '',
			confirmPassword : ''
		}

		original1 = angular.copy($scope.newUserModel);
		original2 = angular.copy($scope.userNameModel);
		$scope.revert = function() {
			$scope.newUserModel = angular.copy(original1);
			$scope.userNameModel = angular.copy(original2);
			$scope.form_signup.$setPristine();
			$scope.form_signup.$setUntouched();
			$scope.form_user_name.$setPristine();
			$scope.form_user_name.$setUntouched();
			return;
		};

		$scope.canfinished = function(formValid) {
			if (formValid.$valid) {
				$scope.form_user_name = formValid;
				return true;
			} else {
				return false;
			}

		};
		$scope.canSubmitformSignup = function(formValid) {
			if (formValid.$valid
					&& !angular.equals($scope.newUserModel, original1)) {
				$scope.form_signup = formValid;
				return true;
			} else {
				return false;
			}

		};



		$scope.validUserNames = function(form_user_name) {
			var parameters = {};
			var usernamevalidationobj = JSON.stringify({
				'userName' : $scope.userNameModel.userName,
			});
			console.log(usernamevalidationobj);

			$scope.datafetchflag = true;
			$http({
				method : 'POST',
				url : API+'admin/doesusernameexist.json',
				contentType : 'application/json',
				data : usernamevalidationobj,
			}).then(
					function(response) {
						$scope.datafetchflag = false;
						if (!response.data.status) {
							form_user_name.UserId.$setValidity("error", true);
							$scope.userNameModel.userNameExist = true;
						} else {
							form_user_name.UserId.$setValidity("error", false);
							$scope.userNameModel.userNameExist = false;
						}

						console.log(response);

					},
					function errorCallback(response) {
						console.log(response);
						$scope.datafetchflag = false;
						AlertDialogFactory.showAlert(
								"Some error occured while fetching Usernames.",
								$scope);

					});

		}

		$scope.finished = function() {
			$scope.datafetchflag = true;
			NewUserDetails.PostNewUserData($scope.newUserModel.userType,
					$scope.newUserModel.firstName,
					$scope.newUserModel.lastName,
					$scope.newUserModel.mobileNumber,
					$scope.newUserModel.email, $scope.newUserModel.city,
					$scope.newUserModel.state, $scope.newUserModel.address,
					$scope.userNameModel.password,
					$scope.userNameModel.userName,$scope.selectedFeaturelist,$scope.newUserModel.minBalance).then(
					function(successresponse) {
						$scope.datafetchflag = false;
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);
					$scope.revert();
					$scope.goBack();

					},
					function(errormessage) {
						$scope.datafetchflag = false;
						AlertDialogFactory.showAlert("Some Error Occured.",
								$scope);
						console.log(errormessage);
					});

		};


		$scope.selectedFeaturelist = [];
	    $scope.toggleFeature = function toggleFeature(data) {
	      var idx = $scope.selectedFeaturelist.indexOf(data);

	      if (idx > -1) {
	        $scope.selectedFeaturelist.splice(idx, 1);
	      }
	      else {
	        $scope.selectedFeaturelist.push(data);
	        $scope.featureselectFlag = false;
	      }
	    };

	    $scope.CheckFeature = function(){
	    	if(($scope.selectedFeaturelist).length>=0) return false;
	    	return true;
	    };

		$scope.GetfeatureList = function(){
		$http.get(API+'user/getcreationfeatures.json')
			.then(function(successresponse) {
				console.log(successresponse);
				$scope.FeatureList = successresponse.data.assignedFeatures;
		},function(errorresponse){
			console.log(errorresponse);
			});
		}
		$scope.logStep = function() {
			console.log("Step continued");
		};
		$scope.goBack = function() {
			WizardHandler.wizard().goTo(0);
		};
		$scope.exitWithAPromise = function() {
			var d = $q.defer();
			$timeout(function() {
				d.resolve(true);
			}, 1000);
			return d.promise;
		};
		$scope.exitToggle = function() {
			$scope.canExit = !$scope.canExit;
		};
		$scope.stepToggle = function() {
			$scope.stepActive = !$scope.stepActive;
		}
		$scope.exitValidation = function() {
			return $scope.canExit;
		};
	};
	CreateUser.$inject = [ '$rootScope', '$scope', '$http', '$q', '$timeout',
			'WizardHandler', 'NewUserDetails', 'AlertDialogFactory','API'];
	angular.module('app').controller('CreateUser', CreateUser);
}());
