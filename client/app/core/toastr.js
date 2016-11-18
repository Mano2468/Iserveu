(function() {
	'use strict';
	// This function handles all requests for bene and its response data storage
	var ToastFactory = function($mdToast) {
		var toastservice = {};
		var last = {
			bottom : false,
			top : true,
			left : false,
			right : true
		};
		toastservice.toastPosition = angular.extend({}, last);
		toastservice.getToastPosition = function() {
			sanitizePosition();
			return Object.keys(toastservice.toastPosition).filter(function(pos) {
				return toastservice.toastPosition[pos];
			}).join(' ');
		};
		function sanitizePosition() {
			var current = toastservice.toastPosition;
			if (current.bottom && last.top)
				current.top = false;
			if (current.top && last.bottom)
				current.bottom = false;
			if (current.right && last.left)
				current.left = false;
			if (current.left && last.right)
				current.right = false;
			last = angular.extend({}, current);
		}
		;
		toastservice.showToast = function(message) {
			return $mdToast.show($mdToast.simple().textContent(message).position(
					toastservice.getToastPosition()).hideDelay(3000));
		};
		return toastservice;
	};

	ToastFactory.$inject = ["$mdToast"];
	angular.module('app').factory('ToastFactory', ToastFactory);
}());