(function() {
        'use strict';
        // This function handles all requests for bene and its response data storage
        var AddBalancefactory = function($http,API) {
            var addbalance = {};
            addbalance.Postaddbalance = function(amount,comments) {
              console.log("inside balance factory");
                var addbalanceobj = JSON.stringify({
                    'amount': amount,
                    'comment':comments
                });
                console.log(addbalanceobj);
                return  $http({
                    method : 'POST',
                    url : API+'admin/addbalance.json',
                    contentType : 'application/json',
                    data : addbalanceobj,
                  });

                };

                return addbalance;
            };
            AddBalancefactory.$inject = ["$http","API"];
            angular.module("app").factory('AddBalancefactory', AddBalancefactory);
        }());
