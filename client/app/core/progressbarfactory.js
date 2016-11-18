/*
Factories are used to store all the common functionalities
This function here is used to create a instance of  ngprogress bar and helps in  reuse of the same code
NOTE used in all three conrollers
*/
(function() {
  'use strict';
  // create a function to instanciate the process of using the ngprogress factory function for our own ease of reuse
  var ProgressIndicator = function(ngProgressFactory) {
    // create a single instance of the progress bar
    var progress_bar = ngProgressFactory.createInstance();
    // var to deal with the  progress bar factory usage
    var progressfactory = {};
    //handles the progressbar functionalities
    progressfactory.startProgress = function() {
      progress_bar.setHeight('4px');
      progress_bar.setColor('#bedf10');
      progress_bar.set(90);
      progress_bar.start();
    };
    progressfactory.completeProgress = function() {
      progress_bar.setColor('#008f99');
      progress_bar.complete();
    };
    progressfactory.resetProgress = function () {
      progress_bar.setColor('#d4482f');
      progress_bar.reset();
    };

    return progressfactory;
  };

  ProgressIndicator.$inject = ['ngProgressFactory'];
  angular.module('app').factory('ProgressIndicator', ProgressIndicator);
}());
