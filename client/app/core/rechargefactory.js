(function() {
    'use strict';
    // This function handles all requests for bene and its response data storage
    var RechargeFact = function($http, API) {
        var RechargeDetails = {};
        console.log("recharge factory");
        // handle post request
        RechargeDetails.PostMobileRecharge = function(type, phnumber, operator,
            amount, accountno, stdcode, circle, auth) {
            console.log("Recharge Factory");
            var mobilerecharge = JSON.stringify({
                'mobileNumber': phnumber,
                'operatorCode': operator,
                'amount': amount,
                'stdCode': stdcode,
                'accountNo': accountno,
                'rechargeType': type,
                'circleCode': circle,
                'auth': auth

            });
            console.log(mobilerecharge);

            return $http({
                method: 'POST',
                url: API + 'getallrechargehere.json',
                contentType: 'application/json',
                data: mobilerecharge
            })

        };

        RechargeDetails.PostSpecialRecharge = function(type, operator, phnumber,
            amount, accountno, stdcode, circle, auth) {
            console.log("Recharge Factory");
            var specialrecharge = JSON.stringify({
                'rechargeType': type,
                'mobileNumber': phnumber,
                'operatorCode': operator,
                'amount': amount,
                'stdCode': stdcode,
                'accountNo': accountno,
                'circleCode': circle,
                'auth': auth

            });
            console.log(specialrecharge);
        
						return $http({
								method: 'POST',
								url: API + 'getallrechargehere.json',
								contentType: 'application/json',
								data: specialrecharge
						})
        };
        RechargeDetails.PostDthRecharge = function(operator, idnumber, amount, accountno, stdcode, type, circle, auth) {
            console.log("Recharge Factory");
            var dthrecharge = JSON.stringify({
                'operatorCode': operator,
                'mobileNumber': idnumber,
                'amount': amount,
                'stdCode': stdcode,
                'accountNo': accountno,
                'rechargeType': type,
                'circleCode': circle,
                'auth': auth

            });
            console.log(dthrecharge);

						return $http({
								method: 'POST',
								url: API + 'getallrechargehere.json',
								contentType: 'application/json',
								data: dthrecharge
						})
        };

        RechargeDetails.PostDataCardRecharge = function(datacardno, operator,
            amount, accountno, stdcode, type, circle, auth) {
            console.log("Recharge Factory");
            var datacardrecharge = JSON.stringify({
                'mobileNumber': datacardno,
                'operatorCode': operator,
                'amount': amount,
                'stdCode': stdcode,
                'accountNo': accountno,
                'rechargeType': type,
                'circleCode': circle,
                'auth': auth


            });
            console.log(datacardrecharge);

						return $http({
								method: 'POST',
								url: API + 'getallrechargehere.json',
								contentType: 'application/json',
								data: datacardrecharge
						})
        };

        RechargeDetails.PostPaidRecharge = function(phnumber, operator, amount, type, accountno, stdcode, circle, auth) {
            var postpaidrecharge = JSON.stringify({
                'mobileNumber': phnumber,
                'operatorCode': operator,
                'amount': amount,
                'stdCode': stdcode,
                'accountNo': accountno,
                'rechargeType': type,
                'circleCode': circle,
                'auth': auth

            });
            console.log(postpaidrecharge);

						return $http({
								method: 'POST',
								url: API + 'getallrechargehere.json',
								contentType: 'application/json',
								data: postpaidrecharge
						})
        };

        RechargeDetails.UtilityBillPay = function(phnumber, operator, amount, type, accountno, stdcode, circle, auth, bauth) {
            if (auth == '') {
                auth = bauth;
            }
            var UtilityRecharge = JSON.stringify({
                'mobileNumber': phnumber,
                'operatorCode': operator,
                'amount': amount,
                'stdCode': stdcode,
                'accountNo': accountno,
                'rechargeType': type,
                'circleCode': circle,
                'auth': auth

            });
            console.log(UtilityRecharge);

						return $http({
								method: 'POST',
								url: API + 'getallrechargehere.json',
								contentType: 'application/json',
								data: UtilityRecharge
						})
        };

        return RechargeDetails;
    };

    RechargeFact.$inject = ['$http', 'API'];
    angular.module("app").factory('RechargeFact', RechargeFact);
}());
