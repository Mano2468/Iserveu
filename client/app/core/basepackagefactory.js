(function () {
  'use strict';
  var BasePackageFact = function($http,API) {
    var BaseFactory = {};

    BaseFactory.GetBasePackage = function() {
        console.log("get Provider Base Package");
        return $http.get(API+'admin/getBasePackage.json');
    };
    //updater value
    BaseFactory.UpdateBasePackage = function (basepackdata) {
      var basepackagedetails= JSON.stringify(basepackdata);
      var basepackageparameter = {};
      basepackageparameter.basePackageList = basepackagedetails;
      return $http({
			method : 'POST',
			url : API+'admin/setBasePackage.json',
			contentType : 'application/json',
			data : basepackagedetails,
		});
//      return $http.get('admin/setBasePackage.json', {params: basepackageparameter});
    };
    return BaseFactory;
  };
  BasePackageFact.$inject = ['$http','API'];
  angular.module('app').factory('BasePackageFact', BasePackageFact);
}());
