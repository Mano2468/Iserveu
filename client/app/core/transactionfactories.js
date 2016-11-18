(function() {
	'use strict';
	// This function handles all the transation process requests for both admin
	// and user
	var TransactionDetails = function( $http,API) {
		var transactionfactory = {};
		console.log("i am submitting");
		// handle post request
		transactionfactory.PostTransaction = function(transaction_Type,
				from_Date, to_Date, role) {
			var transactionobj = JSON.stringify({
				'transactionType' : transaction_Type,
				'fromDate' : from_Date,
				'toDate' : to_Date
			});
			console.log(transactionobj);

			var WalletTransactionsinfo ;
			switch (transaction_Type) {
			case "WALLET":
				// WalletTransactionsinfo = JSON.stringify(transactionobj);
					WalletTransactionsinfo = transactionobj;
				var url_str = API+'walletdetails.json';
				break;
			default:
				WalletTransactionsinfo = transactionobj;
				var url_str = API+'transactiondetails.json';
				break;
			}
			return $http({
				method : 'POST',
				url : url_str,
				contentType : 'application/json',
				data : WalletTransactionsinfo,
			});
		};

		transactionfactory.Postpdf = function(transaction_Type, from_Date,
				to_Date, role) {

			switch (transaction_Type) {
			case "WALLET":
				var url_str = API+'export-pdf/walletdetails.html?transactionType='
					+ transaction_Type
					+ "&fromDate="
					+ from_Date
					+ "&toDate=" + to_Date ;
			 window.location = url_str;
				break;
			default:
				var url_str = API+'export-pdf/transactiondetails.html?transactionType='
						+ transaction_Type
						+ "&fromDate="
						+ from_Date
						+ "&toDate=" + to_Date ;
				 window.location = url_str;
				break;
			}

		};


		transactionfactory.Postexcel = function(transaction_Type, from_Date,
				to_Date, role) {


			switch (transaction_Type) {
			case "WALLET":
				var url_str = API+'export-xlsx/walletdetails.html?transactionType='
					+ transaction_Type
					+ "&fromDate="
					+ from_Date
					+ "&toDate=" + to_Date ;
			 window.location = url_str;
				break;
			default:
				var url_str = API+'export-xlsx/transactiondetails.html?transactionType='
						+ transaction_Type
						+ "&fromDate="
						+ from_Date
						+ "&toDate=" + to_Date ;
				 window.location = url_str;
				break;
			}

		};

		return transactionfactory;
	};

	TransactionDetails.$inject = [ '$http','API' ];
	angular.module("app").factory('TransactionDetails', TransactionDetails);
}());
