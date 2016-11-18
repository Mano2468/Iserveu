(function() {
    'use strict';

    angular.module('app.core')
        .config(['$mdThemingProvider', '$stateProvider', '$urlRouterProvider', '$provide', mdConfig]);


    function mdConfig($mdThemingProvider, $stateProvider, $urlRouterProvider, $provide) {

        $provide.factory('appConfig', function() {

            $urlRouterProvider.otherwise('/login');
            $stateProvider.state('login', {
                    url: '/login',
                    templateUrl: 'app/login/login.html'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'app/dashboard/dashboard.html'
                        // ,loginRequired: true
                });

            var pageTransitionOpts = [{
                name: "Fade up",
                "class": "animate-fade-up"
            }, {
                name: "Scale up",
                "class": "ainmate-scale-up"
            }, {
                name: "Slide in from right",
                "class": "ainmate-slide-in-right"
            }, {
                name: "Flip Y",
                "class": "animate-flip-y"
            }];

            var main = {
                brand: "", // Get My Travel
                name: "Lisa",
                layout: "wide", // "boxed", "wide"
                menu: "vertical", // "horizontal", "vertical"
                isMenuCollapsed: false, // true, false
                fixedHeader: true, // true, false
                fixedSidebar: true, // true, false
                pageTransition: pageTransitionOpts[0], // 0, 1, 2, 3... and build
                // your own
                skin: "34" // 11,12,13,14,15,16; 21,22,23,24,25,26;
                    // 31,32,33,34,35,36
            };
            var color = {
                primary: "#00BCD4",
                success: "#8BC34A",
                info: "#00BCD4",
                infoAlt: "#7E57C2",
                warning: "#FFCA28",
                danger: "#F44336",
                text: "#3D4051",
                gray: "#EDF0F1"
            };

            var RouteFun = function(routearray) {
                var Route = routearray;
                var setRoutes;
                var setRoutes = function(route) {
                    var config, url;
                    url = '/' + route;
                    config = {
                        url: url,
                        templateUrl: 'app/page/' + route + '.html',
                    };
                    $stateProvider.state(route, config);
                    return $stateProvider;
                };

                Route.forEach(function(route) {
                    return setRoutes(route);
                });
            }

            var userInit = function(data, AppService, $scope, $rootScope) {
                AppService
                    .SetUserInfoStore(data);
                if (!data.userInfo.promotionalMessage == "") {
                    $rootScope.$broadcast('promo_message');
                }
                if (!data.userInfo.userBrand == "") {
                    $rootScope.$broadcast('Custom_Brand');
                }
                if (data.userType === 'ROLE_USER') {
                    $scope.sideBarLoader = 'app/layout/sidebarUser.html';
                    var ROLEUSER = ['transaction', 'payment',
                        'paymentrequestreports', 'refundstatus', 'profile', 'dashboard', '/'
                    ];
                    RouteFun(ROLEUSER);
                } else if (data.userInfo.userType === 'ROLE_RETAILER') {
                    $scope.sideBarLoader = 'app/layout/sidebarRetailer.html';
                    var ROLERETAILER = ['profile',
                        'transaction', 'refundstatus', 'moneytransfersignin',
                        'payment', 'paymentrequestreports', 'settingpage',
                        'nonkycregisterform', 'otp', 'addbene', 'recharge', '/',
                        'benedetails', 'forgotpin', 'topup', 'CPMoneytransfer',
                        'appfundtransfer', 'agenttransdetails', 'cpmttransaction', 'moneytransaction', 'agenttransaction'
                    ];
                    RouteFun(ROLERETAILER);
                } else if (data.userInfo.userType === 'ROLE_SUPER_ADMIN') {
                    $scope.sideBarLoader = 'app/layout/sidebarSAdmin.html';
                    var ROLESUPERADMIN = ['createuser', 'showuser', 'edituser',
                        'addfeature', 'showfeatures', 'WalletReport', 'userhierarchy', 'profile', '/'
                    ];
                    RouteFun(ROLESUPERADMIN);

                } else if (data.userInfo.userType === 'ROLE_ADMIN') {
                    $scope.sideBarLoader = 'app/layout/sidebarAdmin.html';
                    var ROLEADMIN = ['transaction', 'refundrequests', 'createuser',
                        'showuser', 'edituser', 'addbalance',
                        'balanceapprovalrequest', 'balancerequestreports',
                        'settingpage', 'refundstatus', 'WalletReport', 'profile', '/', 'detailsfundtransfer'
                    ];
                    RouteFun(ROLEADMIN);
                } else if (data.userInfo.userType === 'ROLE_MASTER_DISTRIBUTOR' ||
                    data.userInfo.userType === 'ROLE_DISTRIBUTOR') {
                    $scope.sideBarLoader = 'app/layout/sidebarMD.html';
                    var MASTERDISTRIBUTORandDISTRIBUTOR = ['transaction', 'createuser',
                        'showuser', 'edituser', 'payment',
                        'paymentrequestreports', 'balanceapprovalrequest',
                        'balancerequestreports', 'settingpage', 'WalletReport', 'profile', '/',
                    ];
                    RouteFun(MASTERDISTRIBUTORandDISTRIBUTOR);
                }
                $rootScope.user = data.userInfo.userName;
                $rootScope.balance = data.userInfo.userBalance;
                $rootScope.usertype = data.userInfo.userType;
                $rootScope.userfeature = data.userInfo.userFeature;
            }
            var initDash = function(AppService, $scope, $rootScope, API, store, $location) {
                if (store.get('jwt') && !store.get('userdata')) {
                    AppService
                        .GetDashboard(API)
                        .then(
                            function(successresponse) {
                                console.log(successresponse);
                                store.set('userdata', successresponse.data);
                                userInit(successresponse.data, AppService, $scope, $rootScope);
                            },
                            function(errorresponse) {
                                $location.url("/");
                                store.remove('jwt');
                                console.log(errorresponse);
                            });
                } else {
                    if (!$scope.sideBarLoader)
                        userInit(store.get('userdata'), AppService, $scope, $rootScope);
                }


            };
            return {
                pageTransitionOpts: pageTransitionOpts,
                main: main,
                color: color,
                initDash: initDash,
            }

        });
        var cyanAlt = $mdThemingProvider.extendPalette('cyan', {
            'contrastLightColors': '500 600 700 800 900',
            'contrastStrongLightColors': '500 600 700 800 900'
        })
        var lightGreenAlt = $mdThemingProvider.extendPalette('light-green', {
            'contrastLightColors': '500 600 700 800 900',
            'contrastStrongLightColors': '500 600 700 800 900'
        })

        $mdThemingProvider.definePalette('cyanAlt', cyanAlt).definePalette(
            'lightGreenAlt', lightGreenAlt);

        $mdThemingProvider.theme('default').primaryPalette('teal', {
            'default': '500'
        }).accentPalette('cyanAlt', {
            'default': '500'
        }).warnPalette('red', {
            'default': '500'
        }).backgroundPalette('grey');

    }



})();
