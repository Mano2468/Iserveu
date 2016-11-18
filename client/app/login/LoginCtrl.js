(function() {
    'use strict';
    var LoginCtrl = function($scope, jwtHelper, $http, $location, $rootScope, loginfactory,$state,store) {
        $scope.LoginModel = {
            username: '',
            password: ''
        };
        $scope.login = function(LoginModel) {
            //$location.path("/dashboard");
            loginfactory.FLogin(LoginModel.username, LoginModel.password)
                .then(
                    function(successResponse) {
                        console.log('$location',$location.$$absUrl);
                        $rootScope.token = successResponse.data.token;
//                        $rootScope.Auth = true;
                        store.set('jwt', $rootScope.token);
                        //$rootScope.Authenticated = true;
                        // var tokenPayload = jwtHelper.decodeToken($scope.token);
                        var date = jwtHelper.getTokenExpirationDate($rootScope.token);
                        // var bool = jwtHelper.isTokenExpired($scope.token);
                        // console.log(tokenPayload);
                        console.log(date);
                        console.log($rootScope.token);
                        // $rootScope.$broadcast('Load_Header_Sidebar');
                        $state.go('dashboard');
                    },
                    function(errorResponse) {
                        console.log(errorResponse);
                    }
                );

        };


    };
    LoginCtrl.$inject = ['$scope', 'jwtHelper', '$http', '$location', '$rootScope', 'loginfactory','$state','store'];
    angular.module("app").controller('LoginCtrl', LoginCtrl).constant('API', 'https://iserveubluemix.mybluemix.net/');
    // http://192.168.15.105:8080/
    // http://192.168.15.254:8080/
    //http://localhost:8080/
    //http://iserveubluemix.mybluemix.net/
}());
