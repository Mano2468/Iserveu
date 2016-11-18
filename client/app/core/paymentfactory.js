(function() {
	'use strict';
	// This function handles all requests for bene and its response data storage
	var PaymentDetails = function($http,API) {
		var paymentfactory = {};
		// for the normal user
		paymentfactory.PostPayment = function(sender_Name, sender_BankName,
				sender_AccountNO, deposite_date, amount, transfer_Type,
				bank_RefId, remarks) {
			console.log("payment submit");
			var paymentobj = JSON.stringify({
				'senderName' : sender_Name,
				'senderBankName' : sender_BankName,
				'senderAccountNo' : sender_AccountNO,
				'depositDate' : deposite_date,
				'amount' : amount,
				'transferType' : transfer_Type,
				'bankRefId' : bank_RefId,
				'remarks' : remarks
			});
			console.log(paymentobj);
			var payparameter = {};
			payparameter.balancerequest = paymentobj;
			return $http.get(API+'user/balancerequest.json', {
				params : payparameter
			});
		};

		// for the show users in admin
		paymentfactory.PostModalPayment = function(userid, sender_Name,
				sender_BankName, sender_AccountNO, deposite_date, amount,
				transfer_Type, bank_RefId, remarks) {
			console.log("payment submit");
			var paymentobj = JSON.stringify({
				'userId' : userid,
				'senderName' : sender_Name,
				'senderBankName' : sender_BankName,
				'senderAccountNo' : sender_AccountNO,
				'depositDate' : deposite_date,
				'amount' : amount,
				'transferType' : transfer_Type,
				'bankRefId' : bank_RefId,
				'remarks' : remarks
			});
			console.log(paymentobj);
			return $http({
				method : 'POST',
				url : API+'payuser.json',
				contentType : 'application/json',
				data : paymentobj,
			});
		};

		return paymentfactory;
	};
	PaymentDetails.$inject = [ "$http","API" ];
	angular.module("app").factory('PaymentDetails', PaymentDetails);
}());
