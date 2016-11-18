/*
Factories are used to store all the common functionalities
This function here is used to store and provide customer details data locally in the browser side and helps to reduce data load on the back-end apis
used in sender controller and RecipientController
*/

(function() {
    'use strict';
    // This function handles the sender requests to Api and stores response customer data
    var SenderDetails = function($http,API) {
        // gets all the data including headers and request status for connection
        // Restangular.setFullResponse(true);
        // var to deal with the customer(sender) data factory
        var senderfactory = {};
        // data object to store customer details fetched
        var dataobj;
        // data object to store new customer verification data (OTP)
        var verifyobj;
        var customerMobileNo;
        var benelist;

        // gets response object for customer when phone number is valid in UI and stores it in dataobj variable
        senderfactory.GetUserData = function(customerPhoneno, tokenvalue) {
          console.log(tokenvalue);
          customerMobileNo = customerPhoneno;
            // set header for token
//            Restangular.setDefaultHeaders({token: tokenvalue});
            // calling the promise async way to get the response data
          return  $http({
                method: 'GET',
                url: API+'getcustomerdetails/'+ customerPhoneno + '.json',
                contentType: 'application/json'
            })
            // return Restangular.one('getcustomerdetails/'+ customerPhoneno + '.json').get();
        };

        senderfactory.SendUseMobileNo = function(){
            return customerMobileNo;
           }

        // sender fetched dataobj from controller and set new token object
        senderfactory.extractdataObj = function (responseobj) {
            dataobj = responseobj;
        };

        // status data returner
        senderfactory.checkStatus = function () {
            return dataobj.status;
        };

        // Posts the new user data and gets the response for otp verification
        senderfactory.PostNewUserData = function (enrollDataObj, tokenvalue) {
            var datapost0bj = {"name" :  enrollDataObj.sendername, "customerMobileNo": enrollDataObj.phoneno};
            // the below function convert the data in the //?name=sdjkd & mobile_number=32489743293
            var date_encoded = $.param(datapost0bj);
            // set header for token
//            Restangular.setDefaultHeaders({token: tokenvalue});
            //{'Content-Type': 'application/json'}
          return  $http({
      				method : 'POST',
      				url : API+'customer.json',
      				contentType : 'application/json',
      				data : datapost0bj
      			})
            // return Restangular.all('customer.json').post(datapost0bj);
        };

        // set the verification response data object and stores it
        senderfactory.extractVerifyData = function (verifyresponse) {
                verifyobj = verifyresponse;
        };

        // post OTP verification data to the server once customer enters the otp and click on verify button
        senderfactory.PostVerificationData = function (mobilenumber, otp, tokenvalue) {
            var verifypostObj = {"customerMobileNo": mobilenumber, "otp": otp};

            // set header for token
//            Restangular.setDefaultHeaders({token: tokenvalue});
            // gives the credentials for further access to bene form and verifies the customer
            return  $http({
                method : 'POST',
                url : API+'verifycustomer.json',
                contentType : 'application/json',
                data : verifypostObj
              })
            //return Restangular.all('verifycustomer.json').post(verifypostObj);
        };
        // sends the finaly fetched customer data from backend Api to recipientcontroller
        senderfactory.getCustomerApiData = function () {
            return dataobj;
        };

        senderfactory.PostResendotp = function (mobilenumber, tokenvalue) {
          var Obj = {'customerMobileNo': mobilenumber};
//          var date_encoded = $.param(Obj);
          // set header for token
//          Restangular.setDefaultHeaders({token: tokenvalue});
          // gives the credentials for otp verification
          return  $http({
              method : 'POST',
              url : API+'resendOTP.json',
              contentType : 'application/json',
              data : Obj
            })
          //return Restangular.all('resendOTP.json').post(Obj);
        }
        senderfactory.updatebene = function(data){
            dataobj.data.recipient_list = data.data.recipient_list;
        }

        // senderfactory.GetUserData.$inject = ['customerPhoneno', 'tokenvalue'];
        // senderfactory.extractdataObj.$inject = ['responseobj'];
        // senderfactory.extractVerifyData.$inject = ['verifyresponse'];
        // senderfactory.PostNewUserData.$inject = ['enrollDataObj', 'tokenvalue'];
        // senderfactory.PostVerificationData.$inject = ['mobilenumber', 'otp', 'tokenvalue'];
        // return the factory object
        return senderfactory;
    };

    SenderDetails.$inject = ['$http','API'];
    angular.module('app').factory('SenderDetails', SenderDetails);
}());
