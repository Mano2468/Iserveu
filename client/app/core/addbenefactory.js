(function() {
    'use strict';
    var AddBenefactory = function($http, $location,API) {
        var Benefactory = {};
        var CardNo;
        var securitykey;
        var Mnumber;
        Benefactory.BeneData = function(data) {
            CardNo = data;
        };
        Benefactory.getBeneData = function() {
            return CardNo;
        };
        Benefactory.BeneKey = function(key) {
            securitykey = key;
        };
        Benefactory.getBeneKey = function() {
            return securitykey;
        };
        Benefactory.MobileNo = function(mno) {
            Mnumber = mno;
        };
        Benefactory.getmobileno = function() {
            return Mnumber;
        };
        Benefactory.postbene = function(Type, Choose, BeneName, Benemobile,
            Bname, Accno, State, City, Branch, Ifsc) {
            var BeneObj = JSON.stringify({
                'cardNo': CardNo,
                'beneName': BeneName,
                'beneMobile': Benemobile,
                'bankName': Bname,
                'branchName': Branch,
                'city': City,
                'state': State,
                'accountNo': Accno,
                'ifscCode': Ifsc
            });
            if (!(CardNo == null)) {
                return $http({
                    method: 'POST',
                    url: API+'cashaddbeneficiary.json',
                    contentType: 'application/json',
                    data: BeneObj,
                });
            } else {
                $location.path("moneytransaction");
            }
        };
        return Benefactory;
    };

    AddBenefactory.$inject = ["$http", "$location","API"];
    angular.module("app").factory('AddBenefactory', AddBenefactory);
}());
