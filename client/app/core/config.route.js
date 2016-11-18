(function() {
    'use strict';

    angular.module('app')
        .config(['jwtOptionsProvider', '$httpProvider',
            function(jwtOptionsProvider, $httpProvider) {
                jwtOptionsProvider.config({
                    whiteListedDomains: ['iserveubluemix.mybluemix.net', 'mano2468.github.io'],
                    // iserveubluemix.mybluemix.net
                    unauthenticatedRedirectPath: '/login',
                    authHeader: 'Authorization',
                    authPrefix: '',
                    tokenGetter: ['store', 'jwtHelper', '$http', 'API', function(store, jwtHelper, $http, API) {
                        var jwt = store.get('jwt');
                        // return jwt;
                        if (jwtHelper.isTokenExpired(jwt)) {
                            return $http({
                                url: API + 'refresh.json',
                                skipAuthorization: true,
                                method: 'GET'
                            }).then(function(response) {
                                console.log(response);
                                store.set('jwt', response.data.token);
                                var refreshToken = response.data.token;
                                return refreshToken;
                            });
                        } else {
                            return jwt;
                        }

                    }]
                });

                $httpProvider.interceptors.push('jwtInterceptor');

            }
        ]);

})();
