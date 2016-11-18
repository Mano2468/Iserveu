(function() {
	'use strict';
	// This function handles all requests for bene and its response data storage
	var ProviderFactory = function($http,API) {
		var ProviderDetails = {};
		console.log("provider factory");
		// handle post request for the adding or edit provider
		ProviderDetails.PostProvider = function(ptype, pname, providerId,
				providercode) {
			console.log("Provider Factory");
			if (providerId == null) {
				var url = API+'admin/addServiceProvider.json';
				var providerdetails = JSON.stringify({
					'providerType' : ptype,
					'providerName' : pname,
					'providerCode' : providercode
				});
			} else {
				var url = API+'admin/updateServiceProvider.json';
				var providerdetails = JSON.stringify({
					'providerType' : ptype,
					'providerName' : pname,
					'id' : providerId,
					'providerCode' : providercode
				});
			}
			console.log(providerdetails);
			var providerparameter = {};
			providerparameter.serviceProvider = providerdetails;
			return $http.get(url, {
				params : providerparameter
			});
		};
		// handle post request for getting the provider data on load
		ProviderDetails.GetProvider = function() {
			console.log("get Provider");
			return $http.get(API+'admin/getServiceProviders.json');
		};

		// handle post request for getting the direct children data on load
		ProviderDetails.getDirectChildren = function() {
			console.log("get Children");
			return $http.get(API+'get-direct-children.json');
		};

		// handle post request for getting the serviceProvider for user on load
		ProviderDetails.getAssignedServiceProviders = function(userId) {
			console.log("get Provider for user" + userId);
			return $http.get(API+'get-assigned-scheme-providers/' + userId
					+ ".json");
		};

		// handle post request for getting the serviceProvider for user on load
		ProviderDetails.getSchemes = function(userId, providerId) {
			var schemedetails = JSON.stringify({
				'userId' : userId,
				'providerId' : providerId

			});

			return $http({
				method : 'POST',
				url : API+'get-assigned-schemes.json',
				contentType : 'application/json',
				data : schemedetails
			});

		};

		ProviderDetails.updateSchemes = function(schemeobj,list) {
			var schemedetails = JSON.stringify(list);

			return $http({
				method : 'POST',
				url : API+'persist-user-schemes/'+schemeobj.userId+'.json',
				contentType : 'application/json',
				data : schemedetails
			});

		};

		return ProviderDetails;
	};

	ProviderFactory.$inject = [ '$http','API' ];
	angular.module("app").factory('ProviderFactory', ProviderFactory);
}());
