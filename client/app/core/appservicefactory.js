/*
Service is used by the app controller for hit the dash request to backend on the indexpage load and more other bussiness login
 */
(function() {
    'use strict';
    var AppService = function($http) {
        var appfactory = {};

        appfactory.GetDashboard = function(API) {
            var parameters = {};
            return $http({
                url: API + 'user/dashboard.json',
                method: "GET",
                crossDomain: true,
                skipAuthorization: false,
                params: parameters,
                contentType: "application/json;",

            });

        };

        appfactory.GetBalance = function(api) {
            var parameters = {};
            return $http.get(api + 'user/getuserbalance.json', {
                params: parameters
            });

        };
        var default_theme = {};

        appfactory.SetDefaultTheme = function(brand_theme) {

            default_theme = angular.copy(brand_theme);

        };

        appfactory.GetDefaultTheme = function() {
            return default_theme;
        };

        var user_completeData = {};
        appfactory.SetUserInfoStore = function(usr_data) {
            user_completeData = angular.copy(usr_data);
        };

        appfactory.GetUserInfoStore = function() {
            return user_completeData;
        };
        return appfactory;
    };

    AppService.$inject = ['$http'];
    angular.module('app').factory('AppService', AppService);
})();
