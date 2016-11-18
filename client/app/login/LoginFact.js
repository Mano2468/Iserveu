  (function() {
    'use strict';

    var loginfactory = function($http,API,store,jwtHelper) {
      var loginfact = {};
     loginfact.FLogin = function(username,password) {
       var loginObj = JSON.stringify({
         username: username,
         password: password
       })
          return $http({ url:API + "auth",
                                 method: "POST",
								 skipAuthorization: true,
                                 data: loginObj,
                                 contentType: "application/json",

                             })
        };

//      loginfact.Refreshtoken = function(){
//       var bool = store.get('jwt');
//       return bool;
//      };

      return loginfact;


    };
    loginfactory.$inject = ['$http','API','store','jwtHelper'];
    angular.module("app").factory('loginfactory', loginfactory);
}());
