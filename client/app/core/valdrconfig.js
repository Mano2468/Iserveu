/*
    The below anonymous  function prevents global namespace collision
    there we have defined a single config  and finally passed it to
    the angular module contoller
*/
(function () {
    'use strict';
    // validator function for form validation in EKO APP
    var Validators = function (valdrProvider) {
        // ###### For Transfer Form validation#######
        // constaints validation object for EKO APP
        var transferValdr = {
          'clientCredential': {
            'clientname': {
              'pattern': {
                  'value': /^[a-zA-Z ]{2,30}$/,
                  'message': 'Only alphabets and spaces between 2 to 30 characters'
              },
              'required': {
                  'message': 'user Name is required.'
              }
            },
            'clientpassword': {
              'pattern': {
                  'value': /^.{8,32}$/,
                  'message': 'password must be  between 8 to 32 characters'
              },
              'required': {
                  'message': 'user Name is required.'
              }
            }
          },
            'fundtransfer': {
                'transferamount': {
                    'pattern': {
                        'value': /^[1-9]\d*(\.\d+)?$/,
                        'message': 'Enter amount in digits'
                    },
                    'required': {
                        'message': 'amount is required.'
                    }
                },
//                 'login_key': {
//                     'required': {
//                         'message': 'login key is required.'
//                     },
//                     'pattern': {
//                         'value': /^[0-9]*$/,
//                         'message': 'enter only digits 0 to 9'
//                     }
// //                    ,
// //                    'size': {
// //                        'min': 4,
// //                        'max': 4,
// //                        'message': 'Code length must be 4 characters.'
// //                    }
//                 },
                'txmode': {
                    'required': {
                        'message': 'Transfer mode is required.'
                    }
                }
            },
            'signin': {
                'customerphno': {
                    'required': {
                        'message': 'Phone number is required.'
                    },
                    'pattern': {
                        'value': /^[0]?[789]\d{9}$/,
                        'message': 'Enter valid 10 digit phone number'
                    }
                }
            },
            'signup': {
                'customername': {
                    'pattern': {
                        'value': /^[a-zA-Z ]{2,30}$/,
                        'message': 'Only alphabets and spaces between 2 to 30 characters'
                    },
                    'required': {
                        'message': 'Name is required.'
                    }
                }
            },
            'verify': {
                'otpPass': {
                    'required': {
                        'message': 'OTP is required.'
                    },
                    'pattern': {
                        'value': /^[0-9]*$/,
                        'message': 'enter only digits 0 to 9'
                    },
                    'size': {
                        'min': 3,
                        'max': 10,
                        'message': 'OTP must be 3 to 10 characters.'
                    }
                }
            },
            'beneAddVerify': {
                'bankaccountno': {
                    'required': {
                        'message': 'Account number is required.'
                    },
                    'pattern': {
                        'value': /^[0-9]*$/,
                        'message': 'enter only digits 0 to 9'
                    }
                },
                'benename': {
                    'pattern': {
                        'value': /^[a-zA-Z0-9. ]{2,50}$/,
                        'message': 'Only alphanueric, spaces  and dot between 2 to 50 characters'
                    },
                    'required': {
                        'message': 'Name is required.'
                    }
                },
                'ifsc_code': {
                    'pattern': {
                        'value': /^[^\s]{4}\d{7}$/,
                        'message': 'Invalid IFSC code'
                    }
                },
                'benephno': {
                    'required': {
                        'message': 'Beneficiary Phone number is required.'
                    },
                    'pattern': {
                        'value': /^[0]?[789]\d{9}$/,
                        'message': 'Enter valid 10 digit phone number'
                    }
                }
            }
        };

        // inject the transferValdr object into valdrProvider
        valdrProvider.addConstraints(transferValdr);
    };
    // useful for fixing uglifier or minifier issue of breaking angular
    Validators.$inject = ['valdrProvider'];
    // inject the validator function into the angular config module
    angular.module('app').config(Validators);
}());
