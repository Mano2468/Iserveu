/*
Factories are used to store all the common functionalities
This function here is used to store and provide bene data locally in the browser side and helps to reduce data load on the back-end apis
used in recipientcontroller and transfer controller
 */

(function() {
    'use strict';
    // This function handles all requests for bene and its response data storage
    var BeneDetails = function($http,API) {
        var quickbenedataobj, paybenedataobj, newbene, ifssetfield;
        // stores all bene factory objects
        var benefactory = {};
        var channelList;
        var selectvalue;
        // sets data for pay in factory
        benefactory.setselect = function(value){
          selectvalue = value;
        }
        benefactory.getselect = function(value){
         return selectvalue;
        }
        benefactory.setchannel = function(channel) {
            channelList = channel;
        }
        benefactory.getchannel = function() {
            return channelList;
        }


        benefactory.ifsset = function(ifsc) {
            ifssetfield = ifsc;
        };
        benefactory.ifscget = function() {
            return ifssetfield;
        }
        benefactory.setPayData = function(dataobj) {
            // codeup
            console.log("set pay data");
            paybenedataobj = dataobj;
        };
        // return's pay bene data
        benefactory.getPayMaxLimitData = function() {
            // TODO if not req remove this function
            console.log("get pay max amount limit data");
            return paybenedataobj.maxamount_allowed;
        };
        // handle post request for adding new recipient + money transfer
        benefactory.PostPay = function(amount, transfermode, loginkey,
            tokendata) {
            console.log("adding bene");
            console.log(paybenedataobj);
            var payobj = {
                "recipientMobileNo": paybenedataobj.Mobilerecipientno,
                "customerMobileNo": paybenedataobj.mobile_consumer,
                "recipientName": paybenedataobj.receipentName,
                "accIfsc": paybenedataobj.Accifsc,
                "amount": amount,
                "bankName": paybenedataobj.BankName,
                "loginkey": loginkey,
                "channel": transfermode
            };
            console.log(payobj);
            return  $http({
                method : 'POST',
                url : API + 'pay.json',
                contentType : 'application/json',
                data : payobj
              })
            //return Restangular.all('pay.json').post(payobj);
        };
        // handle post request for verify the bene
        benefactory.PostverifyBene = function(customerphno, accno, bankcode,
            tokendata) {
            console.log("verifying bene");
            var verifybeneobj = {
                'customerId': customerphno,
                'accountNumber': accno,
                'ifscNumber': bankcode
            };
            var data_encoded = $.param(verifybeneobj);
            // new token for request to server on header
            // Restangular.setDefaultHeaders({
            //     token: tokendata
            // });
            return  $http({
                method : 'POST',
                url : API + 'verifyrecipient.json',
                contentType : 'application/json',
                data : verifybeneobj
              })
            // return Restangular.all('verifyrecipient.json').post(
            //     verifybeneobj);
        };
        // used to get the current bene data in one place for usage by transfer
        // form
        benefactory.setBeneDataQuickpay = function(recipientId, bank, account,
            recipient_mobile, recipient_name, maxamount, customerphno) {
            quickbenedataobj = {
                'recipient_id': recipientId,
                'amountlimit': maxamount,
                'account': account,
                'bank': bank,
                'recipient_mobile': recipient_mobile,
                'recipient_name': recipient_name,
                'customer_phno': customerphno
            };
        };
        benefactory.getBeneDataQuickpay = function(){
            return quickbenedataobj;
      };
        // used by the transfer form controller to fetch bene data for quickpay
        benefactory.getQuickPayMaxLimitData = function() {
            return quickbenedataobj.amountlimit;
        };
        // to make a quickpay post request to api
        benefactory.PostQuickPay = function(amountTransfer, transfermode,
            loginkey, tokendata) {
            var data = {

                "recipientId": "" + quickbenedataobj.recipient_id,
                "amount": amountTransfer,
                "customerId": quickbenedataobj.customer_phno,
                "recipientName": quickbenedataobj.recipient_name,
                "account": quickbenedataobj.account,
                "channel": transfermode,
                "recipientMobileNo": quickbenedataobj.recipient_mobile,
                "bankName": quickbenedataobj.bank,
                "loginkey": loginkey
            };
            console.log(data);
            var data_encoded = $.param(data);
            return  $http({
                method : 'POST',
                url : API + 'quickpay.json',
                contentType : 'application/json',
                data : data
              })
            // return Restangular.all('quickpay.json').post(data);
        };

        // called for deleting a beneficiary from the beneficiary/ recipient
        // list
        benefactory.PostDeleteBene = function(data) {
            var deletedata = {
                'customerMobileNo': data.mobile_number,
                'recipientId': data.recipient_id
            }
            var data_encoded = $.param(deletedata);
            // new token for request to server on header
            // Restangular.setDefaultHeaders({
            //     token: data.token
            // });
            return  $http({
                method : 'POST',
                url : API + 'deleterecipient.json',
                contentType : 'application/json',
                data : deletedata
              })
            // return Restangular.all('deleterecipient.json').post(
            //     deletedata);
        };
        // get the new bene response data from the transfer controller post
        // response data
        benefactory.setNewBene = function(newbeneobj) {
            newbeneobj.recipient_name = paybenedataobj.receipentName;
            newbene = newbeneobj;
        };
        // returns new bene data to recipient controller for display in the bene
        // list
        benefactory.getNewBene = function() {
            return newbene;
        };

        // helpful to prevent uglifier to break angular js codes
        benefactory.setNewBene.$inject = ['newbeneobj'];
        benefactory.PostDeleteBene.$inject = ['data'];
        benefactory.setPayData.$inject = ['dataobj'];
        benefactory.PostPay.$inject = ['recipientphno', 'transfermode',
            'loginkey', 'benename', 'accountno', 'bankcode', 'tokendata'
        ];
        benefactory.PostverifyBene.$inject = ['customerphno', 'accno',
            'bankcode', 'tokendata'
        ];
        benefactory.setBeneDataQuickpay.$inject = ['recipientId', 'maxamount',
            'customerphno'
        ];
        benefactory.PostQuickPay.$inject = ['amountTransfer', 'transfermode',
            'loginkey', 'tokendata'
        ];

        return benefactory;
    };

    BeneDetails.$inject = ['$http','API'];
    angular.module('app').factory('BeneDetails', BeneDetails);
}());
