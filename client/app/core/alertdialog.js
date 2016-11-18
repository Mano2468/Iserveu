(function() {
	'use strict';
	var AlertDialogFactory = function($mdDialog) {
		var dialog = {};
		dialog.showAlert = function(message, scope) {
			// Appending dialog to document.body to cover sidenav in docs app
			// Modal dialogs should fully cover application
			// to prevent interaction outside of dialog
			return $mdDialog.show($mdDialog.alert().parent(
					angular.element(document.querySelector('#content')))
					.clickOutsideToClose(true).title('Info!').textContent(
							message).ariaLabel('Info Dialog').ok('Ok')
					.targetEvent(scope));

		};

		dialog.showConfirm = function(message, scope) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm().title('Info!').content(message)
					.ariaLabel('Info Dialog').targetEvent(scope).ok('ok')
					.cancel('cancel');
			return $mdDialog.show(confirm);
		};
		
		dialog.PdfConfirm = function(message, scope) {
			   // Appending dialog to document.body to cover sidenav in docs app
			   var confirm = $mdDialog.confirm().title('Info!').content(message)
			     .ariaLabel('Info Dialog').targetEvent(scope).cancel('cancel').ok('printpdf')
			     ;
			   return $mdDialog.show(confirm);
			  };

		return dialog;
	};

	AlertDialogFactory.$inject = [ '$mdDialog' ];
	angular.module("app").factory('AlertDialogFactory', AlertDialogFactory);
}());