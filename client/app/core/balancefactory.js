(function() {
	'use strict';
	// This function handles all requests for bene and its response data storage
	var BalanceRequestService = function($http,API) {
		var balanceservice = {};
		balanceservice.balanceCheck = function() {

			return $http.get(API+'fetchallinterwalletrequests.json');
		};

		balanceservice.paymentRequestCheck = function() {

			return $http.get(API+'fetchallpaymentrequests.json');
		};

		return balanceservice;
	};

	BalanceRequestService.$inject = [ "$http","API" ];
	angular.module("app").factory('BalanceRequestService',
			BalanceRequestService);
}());
