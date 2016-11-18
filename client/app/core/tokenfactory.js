/*
Factories are used to store all the common functionalities
This function here is used to store and provide bene data locally in the browser side and helps to reduce data load on the back-end apis
used in recipientcontroller and transfer controller and sender controller also
*/

(function() {
    'use strict';
    // This function handles all requests for bene and its response data storage
    var TokenManger = function() {
        var CURRENT_TOKEN = "";
        var tokenfactory = {};

        tokenfactory.setToken = function (tokenvalue) {
            CURRENT_TOKEN = tokenvalue;
        };

        tokenfactory.getToken = function () {
            return CURRENT_TOKEN;
        };

        tokenfactory.setToken.$inject = ['tokenvalue'];

        return tokenfactory;
    };

    angular.module('app').factory('TokenManger', TokenManger);
}());
