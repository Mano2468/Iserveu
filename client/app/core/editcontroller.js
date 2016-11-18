(function() {
	'use strict';

	var Editcontroller = function($scope, appConfig, $http, EditUserDataFact,
			$rootScope,AlertDialogFactory,AppService, $location,API) {

		var BrandSetter = function(custombrand) {
			$scope.main.skin = custombrand.skin;
			$scope.main.brand = custombrand.brand;
			$scope.main.menu = custombrand.menu;
			$scope.main.fixedHeader = custombrand.fixedHeader;
			$scope.main.fixedSidebar = custombrand.fixedSidebar;
			$scope.main.isMenuCollapsed = custombrand.isMenuCollapsed;
			$scope.main.layout = custombrand.layout;
			$scope.main.name = custombrand.name;

			$scope.main.pageTransition.class = custombrand.pageTransition.class;
			$scope.main.pageTransition.name = custombrand.pageTransition.name;

		};

		$scope.newUserProfile = {};
		$scope.Customer = {};
		$scope.pageTransitionOpts = appConfig.pageTransitionOpts;
		$scope.main = appConfig.main;
		BrandSetter(AppService.GetDefaultTheme());
		console.log($scope.main);
		$scope.Customer.brandName = $scope.main.brand;
		$scope.color = appConfig.color;
		var currentuser_id = EditUserDataFact.GetUserId();
		$scope.usertypeDat = EditUserDataFact.GetUserType();
		$scope.ParentName = EditUserDataFact.GetParentUserName();
		$scope.FeatureFlag = false;
		console.log(currentuser_id);
		$scope.datafetchflag = true;
		var getProfile = function() {
			// var useridobj = JSON.stringify({
			// 'id': currentuser_id
			// });
			var profileparms = {};
			profileparms.id = currentuser_id;
			$http
					.get(API+'user/getuserprofile.json', {
						params : profileparms
					})
					.then(
							function(successresponse) {
								console
										.log("success fetching user profile data");
								console.log(successresponse);
								$scope.datafetchflag = false;
								// console.log(successresponse.status);
								$scope.newUserProfile.firstName = successresponse.data.firstName;
								$scope.newUserProfile.lastName = successresponse.data.lastName;
								$scope.newUserProfile.mobileNumber = successresponse.data.mobileNumber;
								$scope.newUserProfile.email = successresponse.data.email;
								$scope.newUserProfile.city = successresponse.data.city;
								$scope.newUserProfile.state = successresponse.data.state;
								$scope.newUserProfile.address = successresponse.data.address;
							}, function(errormessage) {
								console.log(errormessage);
							});
		};

		var UpdateProfile = function() {
			$scope.datafetchflag = true;
			var Profileobj = JSON.stringify({
				'id' : currentuser_id,
				'firstName' : $scope.newUserProfile.firstName,
				'lastName' : $scope.newUserProfile.lastName,
				'mobileNumber' : $scope.newUserProfile.mobileNumber,
				'email' : $scope.newUserProfile.email,
				'city' : $scope.newUserProfile.city,
				'state' : $scope.newUserProfile.state,
				'address' : $scope.newUserProfile.address

			});
			console.log(Profileobj);
			$http({
				method : 'POST',
				url : API+'user/updateprofile.json',
				contentType : 'application/json',
				data : Profileobj,
			}).then(function(successresponse) {
				console.log("success posting");
				console.log(successresponse);
				$scope.datafetchflag = false;

			}, function(errormessage) {
				console.log(errormessage);
				$scope.datafetchflag = false;
			});
		};

		$scope.Profile = function() {
			UpdateProfile();
		};

		$scope.$watch('main',
				function(newVal, oldVal) {
					if (newVal.menu !== oldVal.menu
							|| newVal.layout !== oldVal.layout) {
						$rootScope.$broadcast('layout:changed');
					}
					console.log(oldVal);
					console.log(newVal);
					if (newVal.menu === "horizontal"
							|| oldVal.menu === "vertical") {
						$rootScope.$broadcast('nav:reset');
					}
					if (newVal.fixedHeader === false
							&& newVal.fixedSidebar === true) {
						if (oldVal.fixedHeader === false
								&& oldVal.fixedSidebar === false) {
							$scope.main.fixedHeader = true;
							$scope.main.fixedSidebar = true;
						}
						if (oldVal.fixedHeader === true
								&& oldVal.fixedSidebar === true) {
							$scope.main.fixedHeader = false;
							$scope.main.fixedSidebar = false;
						}
					}
					if (newVal.fixedSidebar === true) {
						$scope.main.fixedHeader = true;
					}
					if (newVal.fixedHeader === false) {
						$scope.main.fixedSidebar = false;
					}
				}, true);




		var getUserBrand = function() {
			if (!($scope.usertypeDat == 'Admin ' || $scope.usertypeDat == 'Master Distributor ')) return;
			$scope.datafetchflag = true;
			var profileparms = {};
			profileparms.id = currentuser_id;
			$http.get(API+'user/getbrand.json', {
				params : profileparms
			}).then(
					function(successresponse) {
						console.log("success fetching user brand data");
						console.log(successresponse);
						if (successresponse.data == null)
							return;
						if (successresponse.data.adminJson.length == null)
							return;
						var tempbrand = JSON
								.parse(String(successresponse.data.adminJson));
						BrandSetter(tempbrand);
						$rootScope.$broadcast('EditBrand');
						$scope.Customer.brandName = $scope.main.brand;
						$scope.datafetchflag = false;

					}, function(errormessage) {
						console.log(errormessage);
						$scope.datafetchflag = false;
					});
		};

		var SetTheme = function() {
			$scope.datafetchflag = true;
			var Profileobj = JSON.stringify({
				'id' : currentuser_id,
				'mainData' : JSON.stringify($scope.main)
			});
			console.log(Profileobj);
			BrandSetter(AppService.GetDefaultTheme());
			$http({
				method : 'POST',
				url : API+'user/updatebrand.json',
				contentType : 'application/json',
				data : Profileobj,
			}).then(function(successresponse) {
				console.log("success posting edit theme and brand");
				console.log(successresponse);
				$scope.datafetchflag = false;
				AlertDialogFactory.showAlert(successresponse.data.statusDesc, $scope);
			}, function(errormessage) {
				console.log(errormessage);
				$scope.datafetchflag = false;
			});
		};
		$scope.Brand = function() {
			if ($scope.Customer.brandName == null)
				return;
			if ($scope.Customer.brandName.length > 30)
				return;
			$scope.main.brand = $scope.Customer.brandName;
			SetTheme();
			$scope.main = prevstate;

		};

		var FeatureAssignmentcheck = function(featureid) {
			if(assignedfeaturesdict[featureid]== null)return false;
			if (assignedfeaturesdict[featureid].active == true) {
				return true;
			}
			return false;
		};

		$scope.availablefeaturetempdict = {};
		$scope.availStatus = {};
		var assignedfeaturesdict = {};

		var FeatureExtractor = function(data_list, status) {
			var tempdict = {};
			for ( var dat in data_list) {
				var feature = data_list[dat];
				if (status){
					$scope.availStatus[feature.featureId] = (FeatureAssignmentcheck(feature.featureId));
					if(feature.active) {
						tempdict[feature.featureId] = feature;
					} else {
						continue;
					}
				}
				else {
					tempdict[feature.featureId] = feature;
				}
			}
			return tempdict;
		};

		var getUserFeatures = function() {

			var profileparms = {};
			profileparms.id = currentuser_id;
			$http.get(API+'user/getfeatures.json', {
				params : profileparms
			}).then(
					function(successresponse) {
						console.log("success fetching user profile data");
						console.log(successresponse);
						$scope.FeaturesData = successresponse.data;
						var state = false;
						assignedfeaturesdict = FeatureExtractor(
								$scope.FeaturesData.assignedFeatures, state);
						console.log(assignedfeaturesdict);
						state = true;
						$scope.availablefeaturetempdict = FeatureExtractor(
								$scope.FeaturesData.availableFeatures, state);
						console.log($scope.availablefeaturetempdict);
					}, function(errormessage) {
						console.log(errormessage);
					});
		};

		$scope.FeatureSelect = function(featureselect) {
			$scope.featureupdateflag = false;
			if ($scope.availStatus[featureselect.featureId]) {
				featureselect.active = false;
			}
			else {
				featureselect.active = true;
			}
			// $scope.availablefeaturetempdict[featureselect.featureId] = featureselect;
			assignedfeaturesdict[featureselect.featureId] = featureselect;
		};
		$scope.featureupdateflag = true;

		var FeatureListGen = function () {
			var templist = [];
			for(var featObj in assignedfeaturesdict) {
				var tempdict = {};
				tempdict.active = assignedfeaturesdict[featObj].active;
				tempdict.featureName = assignedfeaturesdict[featObj].featureName;
				tempdict.id = String(assignedfeaturesdict[featObj].featureId);
				templist.push(tempdict);
			}
			return templist;
		};
		$scope.FeaturesUpdate = function() {
			$scope.datafetchflag = true;
			$scope.featureupdateflag = true;
			var temp_feature_list = FeatureListGen();
			var featUpdateObj = JSON.stringify({
				'id' : currentuser_id,
				'featureData' : temp_feature_list
			});
			console.log(featUpdateObj);
			$http({
				method : 'POST',
				url : API+'user/updatefeatures.json',
				contentType : 'application/json',
				data : featUpdateObj,
			}).then(function(successresponse) {
				console.log("success posting Feature updated access data");
				console.log(successresponse);
				$scope.datafetchflag = false;
				AlertDialogFactory.showAlert(successresponse.data.statusDesc, $scope);
			}, function(errormessage) {
				console.log(errormessage);
				$scope.featureupdateflag = false;
				$scope.datafetchflag = false;
			});
		};

		var featureCheck = function(){
	          if ($rootScope.user == $scope.ParentName || $rootScope.usertype == "ROLE_SUPER_ADMIN")
	          {$scope.FeatureFlag = true;}
	          else{$scope.FeatureFlag = false;}
	       }

		// init all get requests on load of controller and page
		if (!(currentuser_id==null || currentuser_id == "")) {
			getUserBrand();
			getUserFeatures();
			getProfile();
			featureCheck();
		} else {
			// $location.path('page/404');
		}

//		var myEvent = window.attachEvent || window.addEventListener;
//        var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compatable
//
//        myEvent(chkevent, function(e) { // For >=IE7, Chrome, Firefox
//            var confirmationMessage = 'Warning you are about to redirect.';  // a space
//            (e || window.event).returnValue = confirmationMessage;
//            return confirmationMessage;
//        });
$('.list-group-item .selecto').click(function(e) {
		e.stopPropagation(); //This will prevent the event from bubbling up and close the dropdown when you type/click on text boxes.
});

	};

	Editcontroller.$inject = [ '$scope', 'appConfig', '$http',
			'EditUserDataFact', '$rootScope' ,'AlertDialogFactory', 'AppService', '$location','API'];
	angular.module('app').controller('Editcontroller', Editcontroller);
}());
