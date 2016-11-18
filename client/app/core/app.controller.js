//(function() {
//    'use strict';
//
//    angular.module('app')
//        .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$document', 'appConfig', '$http', 'API', AppCtrl]) // overall control
//
//    function AppCtrl($scope, $rootScope, $state, $document, appConfig, $http, API) {
////        $scope.Authenticated = function() {
////            if ($rootScope.Auth) {
////                return true;
////            }
////            return false;
////        }
//
//        $scope.Submit = function() {
//            var parameters = {};
//            $http({
//                url: API + 'user/dashboard.json',
//                method: "GET",
//                crossDomain: true,
//                skipAuthorization: false,
//                params: parameters,
//                contentType: "application/json;",
//
//            })
//
//            .then(
//                function(successresponse) {
//                    console.log(successresponse.data);
//                },
//                function(error) {
//                    console.log(error);
//                });
//        };
//
//        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
//        $scope.main = appConfig.main;
//        $scope.color = appConfig.color;
//
//        $scope.$watch('main', function(newVal, oldVal) {
//            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
//            //     $rootScope.$broadcast('layout:changed');
//            // }
//
//            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
//                $rootScope.$broadcast('nav:reset');
//            }
//            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
//                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
//                    $scope.main.fixedHeader = true;
//                    $scope.main.fixedSidebar = true;
//                }
//                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
//                    $scope.main.fixedHeader = false;
//                    $scope.main.fixedSidebar = false;
//                }
//            }
//            if (newVal.fixedSidebar === true) {
//                $scope.main.fixedHeader = true;
//            }
//            if (newVal.fixedHeader === false) {
//                $scope.main.fixedSidebar = false;
//            }
//        }, true);
//
//
//        $rootScope.$on("$stateChangeSuccess", function(event, currentRoute, previousRoute) {
//            $document.scrollTo(0, 0);
//        });
//    }
//
//})();
//



(function() {
    'use strict';

    angular.module('app').controller(
            'AppCtrl', ['$scope', '$http', '$rootScope', '$state', '$document', 'appConfig',
                'AppService', '$location', 'API', 'store', 'jwtHelper', '$window', AppCtrl
            ]) // overall control

    function AppCtrl($scope, $http, $rootScope, $state, $document, appConfig,
        AppService, $location, API, store, jwtHelper, $window) {

        // $scope.$on("Load_Header_Sidebar",
        // 				function(event, data) {
        // 					appConfig.initDash(AppService, $scope, $rootScope,API,store);
        //
        // 				});

        $scope.main = appConfig.main;
        AppService.SetDefaultTheme($scope.main);
        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.color = appConfig.color;
        $scope
            .$on(
                "promo_message",
                function(event, data) {
                    $scope.BannerMessage = AppService
                        .GetUserInfoStore().userInfo.promotionalMessage;

                });
        var BrandSetter = function(custombrand) {
            $scope.main.skin = custombrand.skin;
            $scope.main.brand = custombrand.brand;
            $rootScope.BrandName = custombrand.brand;
            $scope.main.menu = custombrand.menu;
            $scope.main.fixedHeader = custombrand.fixedHeader;
            $scope.main.fixedSidebar = custombrand.fixedSidebar;
            $scope.main.isMenuCollapsed = custombrand.isMenuCollapsed;
            $scope.main.layout = custombrand.layout;
            $scope.main.name = custombrand.name;
            $scope.main.pageTransition.class = custombrand.pageTransition.class;
            $scope.main.pageTransition.name = custombrand.pageTransition.name;

        };
        $scope.$on("Custom_Brand",
            function(event, data) {
                var Branddat = JSON.parse(String(AppService
                    .GetUserInfoStore().userInfo.userBrand));
                AppService.SetDefaultTheme(Branddat);
                BrandSetter(Branddat);
            });

        // when initialized we will call a restangular service to load side bar
        // data in the vie
        $scope.UpdateBalance = function() {
            AppService.GetBalance(API).then(function(successresponse) {
                $rootScope.balance = successresponse.data;
            }, function(errorresponse) {
                console.log(errorresponse);
            });
        };

        $scope.LogOut = function() {
            store.remove('jwt');
            store.remove('userdata');
            $window.location.reload(true);
        };

        var brand_changeFlag = false;
        $scope.$on('EditBrand', function(event, data) {
            brand_changeFlag = true;
        });

        $scope.CheckAdmin = function(){
          if($rootScope.usertype !== "ROLE_SUPER_ADMIN"){
            return true;
          }
          return false;
        };


        $scope.$watch('main',
            function(newVal, oldVal) {
                if (newVal.menu !== oldVal.menu || newVal.layout !==
                    oldVal.layout) {
                    $rootScope.$broadcast('layout:changed');
                }

                if (newVal.menu === 'horizontal' &&
                    oldVal.menu === 'vertical') {
                    $rootScope.$broadcast('nav:reset');
                }
                if (newVal.fixedHeader === false &&
                    newVal.fixedSidebar === true) {
                    if (oldVal.fixedHeader === false &&
                        oldVal.fixedSidebar === false) {
                        $scope.main.fixedHeader = true;
                        $scope.main.fixedSidebar = true;
                    }
                    if (oldVal.fixedHeader === true &&
                        oldVal.fixedSidebar === true) {
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

        $rootScope.$on("$stateChangeSuccess", function(event, currentRoute,
            previousRoute) {
            if ((!(currentRoute.url == "/edituser")) && brand_changeFlag) {
                BrandSetter(AppService.GetDefaultTheme());
                brand_changeFlag = false;
            }
            $document.scrollTo(0, 0);
        });


        $rootScope.$on('$stateChangeStart',
            function(event, currentRoute, previousRoute) {
              //  var loginRequired = currentRoute.loginRequired || false;
                if (currentRoute.url == "/login" || currentRoute.url == "/") {
                    var jwt = store.get('jwt');
                    var userdata = store.get('userdata');
                    if (jwt && userdata) {
                        $location.url("/dashboard");
                    }
                } else {
                    var Current_token = store.get('jwt');
                    if (Current_token && !jwtHelper.isTokenExpired(Current_token)) {
                        appConfig.initDash(AppService, $scope, $rootScope, API, store, $location);
                    } else {
                        if (Current_token) {
                            $scope.LogOut();
                        } else {
                            $location.url("/");
                        }
                    }
                }
            });


        $rootScope.$on("updateBalanceTrx", function(event, args) {
            $scope.UpdateBalance();
        });


    }

})();
