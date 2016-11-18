(function() {
	'use strict';

	var ProfileController = function($scope, $http, Profilefactory,
			AlertDialogFactory,API) {

		$scope.newUserProfile = {};
		var getProfile = function() {
			var profileparms = {};
			profileparms.id = "";
			$http
					.get(API+'user/getuserprofile.json', {
						params : profileparms
					})
					.then(
							function(successresponse) {
								console.log("success posting");
								console.log(successresponse);
								// console.log(successresponse.status);
								$scope.newUserProfile.firstName = successresponse.data.firstName;
								$scope.newUserProfile.lastName = successresponse.data.lastName;
								$scope.newUserProfile.mobileNumber = successresponse.data.mobileNumber;
								$scope.newUserProfile.email = successresponse.data.email;
								$scope.newUserProfile.city = successresponse.data.city;
								$scope.newUserProfile.state = successresponse.data.state;
								$scope.newUserProfile.address = successresponse.data.address;
							}, function(errormessage) {
								console.log(errormessage);
							});
		};
		$scope.cancel = function() {
			getProfile();
		};
		$scope.Profile = function() {

			console.log("inside  User Profile");

			Profilefactory.postProfile($scope.newUserProfile.firstName,
					$scope.newUserProfile.lastName,
					$scope.newUserProfile.mobileNumber,
					$scope.newUserProfile.email, $scope.newUserProfile.city,
					$scope.newUserProfile.state, $scope.newUserProfile.address)
			// .error(
			// function(err) {
			// if (err.field && err.msg) {
			// // err like {field: "name", msg:
			// // "Server-side error for this username!"}
			// $scope.profile_form.$setError(err.field,
			// err.msg);
			// } else {
			// // unknown error
			// $scope.profile_form.$setError('name',
			// 'Unknown error!');
			// }
			// });

			.then(
					function(successresponse) {
						AlertDialogFactory.showAlert(
								successresponse.data.statusDesc, $scope);

					},
					function(errormessage) {
						console.log(errormessage);
						AlertDialogFactory.showAlert("Some Error Occured.",
								$scope);
					});
		};

		getProfile();

	};
	ProfileController.$inject = [ '$scope', '$http', 'Profilefactory',
			'AlertDialogFactory','API' ];
	angular.module('app').controller('ProfileController', ProfileController);
}());
