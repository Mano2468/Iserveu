(function() {
	'use strict';
	// This function handles all requests for bene and its response data storage
	var KracRechargeFact = function($http,API) {
		var RechargeDetails = {};
		console.log("recharge factory");
		// handle post request
		RechargeDetails.PostTopUpRecharge = function(type,phnumber, operator,
				amount) {
			console.log("Recharge Factory");
			var TopUprecharge = JSON.stringify({
				'rechargeType': type,
				'customerNumber' : phnumber,
				'providerName' : operator,
				'amount' : amount

			});
			console.log(TopUprecharge);
			return $http({
                   method : 'POST',
                   url : API+'getalltyperecharge.json',
                   contentType : 'application/json',
                   data : TopUprecharge,
                      });
		};

		RechargeDetails.PostSpecialRecharge = function(type, operator,phnumber,
				amount) {
			console.log("Recharge Factory");
			var specialrecharge = JSON.stringify({
				'rechargeType': type,
				'customerNumber' : phnumber,
				'providerName' : operator,
				'amount' : amount

			});
			console.log(specialrecharge);
			return $http({
                   method : 'POST',
                   url : API+'getalltyperecharge.json',
                   contentType : 'application/json',
                   data : specialrecharge,
                      });
		};

		RechargeDetails.PostDthRecharge = function(type,customerid, operator,
				amount) {
			console.log("Recharge Factory");
			var dthecharge = JSON.stringify({
				'rechargeType': type,
				'customerNumber' : customerid,
				'providerName' : operator,
				'amount' : amount

			});
			return $http({
                   method : 'POST',
                   url : API+'getalltyperecharge.json',
                   contentType : 'application/json',
                   data : dthecharge,
                      });
		};

		return RechargeDetails;
	};

	KracRechargeFact.$inject = [ '$http','API' ];
	angular.module("app").factory('KracRechargeFact', KracRechargeFact);
}());
