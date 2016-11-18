(function () {
  'use strict';
  var TabledataFilterFact = function () {
    var FilterFactory = {};
    console.log("table filter activated");
    function escapeRegExp(string){
      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    FilterFactory.AdvancedFilter = function (inputDataArray, filterKeyArray) {
      var filterkeylength = filterKeyArray.length;
      // if no data for filter
      if (filterkeylength === 0) {
        return inputDataArray;
      }
      // else do
      var final_dataArray = [];
      for(var index in inputDataArray) {
        var dataobj= inputDataArray[index];
        // var dataobj = JSON.stringify(inputDataArray[index]);
        var matchdict = {};
        var matchcount = 0;
          for (var idx in filterKeyArray) {
            for (var key in dataobj) {
              var regex = new RegExp('\\b' + escapeRegExp(filterKeyArray[idx]), 'i');
              var value = String(dataobj[key]);
              if (regex.test(value)){
                matchdict[filterKeyArray[idx]] = 1;
                matchcount += 1;
                break;
              }
          }
        }
        if (matchcount === filterkeylength) {
          final_dataArray.push(dataobj);
        }
      }
      // finall return the filtered list
      return final_dataArray;
    };

    // FilterFactory.AdvancedFilter.$inject = ['inputDataArray', 'filterKeyArray'];
    return FilterFactory;
  };
  angular.module("app").factory('TabledataFilterFact', TabledataFilterFact);
}());
