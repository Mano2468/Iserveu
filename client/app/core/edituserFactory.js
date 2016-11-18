(function (){
	'use strict';
	var EditUserDataFact = function () {
		var userDatFact = {};
		var usertype_dat, userid_dat = null;
		var parentUserName;
		userDatFact.SetUserId = function (iddat) {
			userid_dat = iddat;
		};

		userDatFact.SetUserType = function (user_type) {
			usertype_dat = user_type;
		};

		userDatFact.GetUserId = function () {
			return userid_dat;
		};

		userDatFact.GetUserType = function (user_type) {
			return usertype_dat;
		}
		userDatFact.SetParentUserName = function(parentUser_name){
            parentUserName = parentUser_name;
        }
        userDatFact.GetParentUserName = function(){
         return parentUserName;
        }

		return userDatFact; 
	};
	angular.module('app').factory('EditUserDataFact', EditUserDataFact);
}());