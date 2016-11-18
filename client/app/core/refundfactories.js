(function() {
	'use strict';
	// This function handles all the transation process requests for both admin
	// and user
	var RefundDetails = function( $http,API) {
		var transactionfactory = {};
		// handle post request
		transactionfactory.PostTransaction = function(transaction_Type,
				from_Date, to_Date) {
			var transactionobj = JSON.stringify({
				'transactionType' : transaction_Type,
				'fromDate' : from_Date,
				'toDate' : to_Date
			});
			var parameters = {};
				parameters.walletinfo = transactionobj
				var url_str = API+'refunddetails.json';

			return $http.get(url_str, {
				params : parameters
			});
		};
		return transactionfactory;

	};

	RefundDetails.$inject = ['$http','API'];
	angular.module("app").factory('RefundDetails', RefundDetails);
}());
