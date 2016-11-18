(function() {
	'use strict';
	var Profilefactory = function($http,API) {
		var userProfilefactory = {};

		userProfilefactory.postProfile = function(fname, lastname, mobileno,
				email, city, state, address) {
			var profileobj = {
				'firstName' : fname,
				'lastName' : lastname,
				'mobileNumber' : mobileno,
				'email' : email,
				'city' : city,
				'state' : state,
				'address' : address
			};

			var profileparms = {};
			profileparms.profileupdate = profileobj;
			return $http({
				method : 'POST',
				url : API+'user/updateprofile.json',
				contentType : 'application/json',
				data : profileobj,
			});

		};
		return userProfilefactory;
	};

	Profilefactory.$inject = [ "$http" ,"API"];
	angular.module("app").factory('Profilefactory', Profilefactory);
}());
