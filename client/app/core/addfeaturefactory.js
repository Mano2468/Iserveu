(function() {
	'use strict';
	// This function handles all requests for bene and its response data storage
	var AddFeatureFactory = function($http,API) {
		var addfeature = {};
		addfeature.Postaddfeature = function(featureName, featureDescription) {
			console.log("inside feature factory");
			var addfeatureobj = JSON.stringify({
				'featureName' : featureName,
				'featureDescription' : featureDescription
			});

			return $http({
				method : 'POST',
				url : API+'super-admin/add-feature.json',
				contentType : 'application/json',
				data : addfeatureobj
			});
		};
		addfeature.getFeatures = function() {
			var parameters = {};
			return $http.get(API+'super-admin/getallfeatures.json', {
				params : parameters
			});

		};
		addfeature.PostUpdateFeature = function(feature) {
			var updatefeatureobj = JSON.stringify(feature);
			return $http({
				method : 'POST',
				url : API+'super-admin/add-feature.json',
				contentType : 'application/json',
				data : updatefeatureobj
			});
		};

		return addfeature;
	};
	AddFeatureFactory.$inject = [ "$http","API"];
	angular.module("app").factory('AddFeatureFactory', AddFeatureFactory);
}());
