(function() {
	var RetailSideBarCtrl = function($scope, $rootScope, AppService) {
		var FeatureId = {};
		var FeatureExract = function() {
			if (AppService.GetUserInfoStore().userInfo.userFeature.length == 0)
				return;
			var featuredat = AppService.GetUserInfoStore().userInfo.userFeature;
			for ( var index in featuredat) {
				FeatureId[featuredat[index].id] = 1;
			}
		};
		FeatureExract();
		$scope.Featurecheck = function(iddat) {
			if (FeatureId[iddat] == null)
				return false;
			return true;
		}
		$scope.isAdmin = function() {
			if ($rootScope.usertype === "ROLE_ADMIN")
				return true;
			else
				return false;
		}
	};
	RetailSideBarCtrl.$inject = [ '$scope', '$rootScope', 'AppService' ];
	angular.module('app').controller('RetailSideBarCtrl', RetailSideBarCtrl);
}());
