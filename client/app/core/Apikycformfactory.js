(function() {
	'use strict';
	var ApiNonKycFormfactory = function($http,API) {
		var Nonkycfactory = {};
		var DateToString = function(date) {
			   // return moment(date).format('YYYY-MM-DD');
			   if (date != null) {
			    var month = '' + (date.getMonth() + 1);
			    var day = '' + date.getDate();
			    var year = date.getFullYear();

			    if (month.length < 2)
			     month = '0' + month;
			    if (day.length < 2)
			     day = '0' + day;

			    return [day, month,  year ].join('/');
			   } else {
			    return "";
			   }
			  };


		Nonkycfactory.postNonKycForm = function(userType,firstName,middleName,lastName,Mobileno,Address,State,City,Pin) {
			var NonKycObj = JSON.stringify({
				'userType' : userType,
				'userName' : firstName,
				'userMiddleName' : middleName,
				'userLastname' : lastName,
				'userMobileNo' : Mobileno,
				'userAddress' : Address,
				'userState' : State,
				'userCity' :City,
				'pinCode' :Pin
				// 'userDob' : DateToString(Date),
				// 'userMailId' :Email
			});


			return $http({
            method : 'POST',
            url : API+'dnewregistration.json',
            contentType : 'application/json',
            data : NonKycObj,
               });

		};
//		Nonkycfactory.postOtp = function(otp,txnid){
//			var OtpObj = JSON.stringify({
//              'otp': otp,
//              'transactionId':txnid
//          });
//
//      $http({
//      method : 'POST',
//      url : 'cashsenderregirster.json',
//      contentType : 'application/json',
//      data : OtpObj,
//         })
//
//		};
		var rdata;

		Nonkycfactory.setData = function(data){
	         rdata = data;
	  };

	  Nonkycfactory.getData =function(){
	          return rdata;
	  };

		return Nonkycfactory;
	};

	ApiNonKycFormfactory.$inject = [ "$http","API" ];
	angular.module("app").factory('ApiNonKycFormfactory', ApiNonKycFormfactory);
}());
