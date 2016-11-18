(function() {
	'use strict';
	// This function handles all requests for bene and its response data storage
	var NewUserDetails = function($http,API) {
		var userfactory = {};
		userfactory.PostNewUserData = function(userType, firstName, lastName,
				mobileNumber, email, city, state, address, password,
				userName,featureList,minbalance) {
			console.log("new user submit");
			var userobj = JSON.stringify({

				'userName' : userName,
				'password' : password,
				'userType' : userType,
				'firstName' : firstName,
				'lastName' : lastName,
				'mobileNumber' : mobileNumber,
				'email' : email,
				'city' : city,
				'state' : state,
				'address' : address,
				'creationfeature' :featureList,
				'' :minbalance
			});
//			console.log(userobj);
//			var userparms = {};
//			userparms.usercreation = userobj;
			return $http({
				method : 'POST',
				url : API+'createuser.json',
				contentType : 'application/json',
				data : userobj,
			});




//			$http.get('admin/createuser.json', {
//				params : userparms
//			});
		};

		return userfactory;
	};
	NewUserDetails.$inject = [ "$http","API" ];
	angular.module("app").factory('NewUserDetails', NewUserDetails);
}());
