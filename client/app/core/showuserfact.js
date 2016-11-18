(function() {
        'use strict';
        // This function handles all requests for bene and its response data storage
        var ShowUserDetails = function($http,API) {
            var userservice = {};
            userservice.PostshowUser = function() {

              console.log(" inside user fact ");

               return $http.get(API+'admin/showusers.json');
                };
                return userservice;
            };

            ShowUserDetails.$inject = ['$http','API'];
            angular.module("app").factory('ShowUserDetails', ShowUserDetails);
        }());
