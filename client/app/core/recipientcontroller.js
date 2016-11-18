/*
    The below anonymous  function prevents global namespace collision
    there we have defined a single contoller  and finally passed it to
    the angular module contoller
 */
(function() {
    'use strict';
    // controller controlling the recipent form
    var RecipientController = function($scope, $uibModal, DummyBanklist,
        SenderDetails, BeneDetails, TokenManger, $rootScope,
        $filter, AlertDialogFactory, $http, API) {
        // flags to show and hide data in UI
        $scope.addflag = false;
        $scope.activateform = false;
        $scope.IfscRequiredFlag = false;
        // recipient form data holder object
        $scope.beneFormModel = {};
        $scope.selectedBeneObj = {};
        // stores the data obtained from the response got by sendercontroller
        $scope.customerdata = {};
        $scope.BeneMobileNo = {};
        $scope.channels = {
            "all": [{
                "name": "NEFT",
                "value": "1",
                "selected": false
            }, {
                "name": "IMPS",
                "value": "2",
                "selected": true
            }],
            "onlyNeft": [{
                "name": "NEFT",
                "value": "1",
                "selected": true
            }, {
                "name": "Choose Type",
                "value": "0",
                "selected": true
            }],
            "onlyImps": [{
                "name": "IMPS",
                "value": "2",
                "selected": true
            }]
        };
        $scope.verifyFlag = false;
        $scope.addbeneFlag = true;

        // stores max amount limit for a customer
        var maxlimit;

        // enabling the functionality on add new tab form active
        $scope.addTabClick = function() {
            if ($scope.activateform) {
                $scope.BeneMobileNo = SenderDetails.SendUseMobileNo();
                $scope.addflag = true;
                $scope.recipientlistFlag = false;
                $scope.recipientshowflag = false;
            }
        };

        // enable the functionality on the recipient tab form active
        $scope.recipientClick = function() {
            if ($scope.activateform) {
                $scope.addflag = false;
                $scope.recipientlistFlag = false;
                $scope.recipientshowflag = true;
            }
        };

        // progressbar
        $scope.progressbarflag2 = false;
        $scope.panel2 = function(flag) {
            $scope.progressbarflag2 = flag;
        }

        // allow to load data and show the recipient list data
        $scope.recipientlistFlag = false;
        $scope.rlistToggle = function() {
            if ($scope.activateform) {
                $scope.recipientlistFlag = !$scope.recipientlistFlag;
            }
        };
        // var to store the current selected recipient name data
        $scope.selectedUserName = 'Select Beneficiary ...';
        // var to store bank list data object
        $scope.bankcodelist = [];
        // BANKNAME and code data loader function
        function loadbankcode() {
            $scope.bankcodelist = DummyBanklist.getBanklist();
            // applying the filter for making the BANKNAME data title case
            for (var incr = 0; incr < $scope.bankcodelist.length; incr++) {
                $scope.bankcodelist[incr]["BANKNAME"] = $filter('uppercase')(
                    $scope.bankcodelist[incr]["BANKNAME"]);
            }
        }
        loadbankcode();

        // obtains the data from the factory function
        // to fetch (sendercontroller response data ---> Customers data for
        // recipientcontroller)
        // shared data between controlers
        function loadBeneList() {
            $scope.customerdata = SenderDetails.getCustomerApiData();

            maxlimit = $scope.customerdata['data'].limit;
            maxlimit = maxlimit[1];
        };
        // deactivate the form when some one changes the customer phone number
        // in the process of transaction
        $scope.$on('no_access', function(event, data) {
            console.log(data);
            // reset the form
            $scope.activateform = false;
            $scope.recipientlistFlag = false;
            $scope.recipientshowflag = false;
            $scope.addflag = false;
            $scope.beneFormModel = {};
            $scope.selectedBeneObj = {};
            $scope.customerdata = {};
            $scope.IfscRequiredFlag = false;
            $scope.selectedUserName = 'Select Beneficiary ...';
        });

        // get broadcast data for form activation
        var cleandatabroadcast = $scope.$on('data_available_now', function(
            event, data) {
            console.log(data);
            $scope.activateform = true;
            $scope.recipientlistFlag = false;
            // automatically load show list
            $scope.recipientshowflag = true;
            $scope.addflag = false;
            // used to kill the broadcast listner
            // cleandatabroadcast ();

            // here we will load the customer data into the recipient controller
            loadBeneList();
        });

        // get the selected bene object which contains all the details
        $scope.beneSelected = function(bene) {
            $scope.panel2(true);
            // needs to be removed if needed
            // $scope.selectedBeneObj = bene;$scope.customerdata
            $scope.selectedUserName = bene.recipient_name;
            // set the bene data to factory
            BeneDetails.setBeneDataQuickpay(bene.recipient_id, bene.bank,
                bene.account, bene.recipient_mobile, bene.recipient_name,
                maxlimit.remaining, $scope.customerdata.data.mobile);
            // var banksel= $scope.bankcodelist.filter($scope.checkbank(bank,bene.bank));
            // toastr.info('QuickPay Activated: '
            // + $filter("titleCase")($scope.selectedUserName), {
            // closeButton : true,
            // iconClass : 'brand-color'
            // });
            $scope.searchrecipient = "";
            $scope.bankcode = {
                "BANKCODE": (bene.ifsc.slice(0, 4))
            }
            $http
                .get(API + 'getbankdetail/' + $scope.bankcode.BANKCODE + '.json')
                .then(
                    function(success) {
                        $scope.panel2(false);
                        console.log(success);
                        switch (success.data.data.available_channels) {

                            case 0:
                                BeneDetails.setchannel($scope.channels.all);
                                BeneDetails.setselect("2");
                                $rootScope.$broadcast('message');
                                $rootScope.$broadcast('QuickFundtransfer', 'Quickpay activated');
                                break;
                            case 1:
                                BeneDetails.setchannel($scope.channels.onlyNeft);
                                BeneDetails.setselect("0");
                                $rootScope.$broadcast('IMPS DOWN');
                                $rootScope.$broadcast('QuickFundtransfer', 'Quickpay activated');
                                break;
                            case 2:
                                BeneDetails.setchannel($scope.channels.onlyImps);
                                BeneDetails.setselect("2");
                                $rootScope.$broadcast('message');
                                $rootScope.$broadcast('QuickFundtransfer', 'Quickpay activated');
                                break;
                        }

                    },
                    function(error) {
                        $scope.panel2(false);
                        console.log(error);
                    });

            // // used to reset the search field
            // $scope.searchReset = function () {
            // $scope.searchrecipient = "";
            // };
            // broadcast that a existing bene is selected


        };

        // used to show messages and do operation according to status value on
        // reponse message
        var VerifyStatusChecker = function(statusdata) {
            switch (statusdata) {
                case 0:

                    AlertDialogFactory.showAlert(
                        "Beneficiary Verification Completed", $scope);
                    break;
                case 41:

                    AlertDialogFactory.showAlert("Beneficiary already verified",
                        $scope);
                    break;
                case -45:

                    AlertDialogFactory.showAlert("Wrong IFSC Code try again ...",
                        $scope);

                    break;
                case -44:

                    AlertDialogFactory.showAlert(
                        "Wrong Account Number try again ...", $scope);

                    break;
                case -43:

                    AlertDialogFactory.showAlert("Wrong customer Id try again ...",
                        $scope);

                    break;
                default:
                    AlertDialogFactory
                        .showAlert(
                            "Unknown error in Beneficiary verification process try again ...",
                            $scope);

            }
        };

        // used to verify on click on bene verify button
        $scope.PostBene = function(validity) {
            $scope.panel2(true);
            if (validity) {
                var bank_ifsc = $scope.bankObj["BANKCODE"];
                if (!($scope.beneFormModel.ifsc == null)) {
                    if (!($scope.beneFormModel.ifsc.length == 0)) {
                        bank_ifsc = $scope.beneFormModel.ifsc;
                    }
                }
                // do verify recipent post
                console.log("inside verify bene");
                BeneDetails
                    .PostverifyBene($scope.customerdata.data.mobile,
                        $scope.beneFormModel.accoutno, bank_ifsc,
                        TokenManger.getToken())
                    .then(
                        function(successresponse) {

                            $scope.panel2(false);
                            console.log("success in bene");
                            AlertDialogFactory.showAlert(
                                successresponse.message, $scope);
                            console.log(successresponse);
                            $scope.NewBeneName = successresponse.data.recipient_name;
                            $rootScope.$broadcast("changeBeneName");
                            console.log(successresponse.status);
                            // VerifyStatusChecker(successresponse.status);
                            TokenManger.setToken(successresponse.token);
                        },
                        function(errormessage) {
                            $scope.panel2(false);
                            AlertDialogFactory.showAlert(
                                "Beneficiary Verification Failed",
                                $scope);

                            console.log("error in adding bene");
                            console.log(errormessage);
                        });
            }

        };

        $scope.AddBene = function(validity) {
            $scope.panel2(true);
            if (validity && !$scope.IfscRequiredFlag) {
                if (validity) {
                    var bank_ifsc = $scope.bankObj["BANKCODE"];
                    if (!($scope.beneFormModel.ifsc == null)) {
                        if (!($scope.beneFormModel.ifsc.length == 0)) {
                            bank_ifsc = $scope.beneFormModel.ifsc;
                        }
                    }
                }
                var AddBeneobj = JSON.stringify({
                    'customerMobileNo': $scope.customerdata.data.mobile,
                    'recipientMobileNo': $scope.customerdata.data.mobile,
                    'recipientName': $scope.beneFormModel.benename,
                    'accIfsc': $scope.beneFormModel.accoutno + '_' + bank_ifsc,
                });
                console.log(AddBeneobj);
                $http({
                    method: 'POST',
                    url: API + 'addBeneficiary.json',
                    contentType: 'application/json',
                    data: AddBeneobj,
                }).then(
                    function(successresponse) {
                        console.log(successresponse);
                        $scope.panel2(false);
                        AlertDialogFactory.showAlert(
                            successresponse.data.message, $scope);
                        if (successresponse.data.status == "0") {
                            $rootScope.$broadcast("ResetRecipientForm",
                                "Addfield: Deactivated");
                        }
                    },
                    function(errorresponse) {
                        console.log(errorresponse);
                        AlertDialogFactory.showAlert(
                            errorresponse.data.message, $scope);
                        $scope.panel2(false);

                    });
            } else {
                $scope.panel2(false);
            }
        };
        // $scope.checkbank=function(bank,bankname) {

        //     if(bank.BANKNAME===bankname){
        //     	return bank;
        //     }else{
        //     	return;
        //     }
        // }
        $scope.IfscCodeFinder = function(bank) {
            // $scope.bankName = $scope.bankObj["BANKNAME"];
            if(bank){
            $scope.bankName = bank.BANKNAME;
            $scope.panel2(true);
            $http.get(API + 'getbankbranches/' + $scope.bankName + '.json').then(
                function(success) {
                    console.log(success);
                    $scope.panel2(false);
                    if (success.data && success.data.constructor === Array && success.data.length > 0)
                        $scope.branchlist = success.data;

                    var IfscModalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'Ifscmodal.html',
                        controller: 'IfscmodalCtrl',
                        resolve: {
                            BankName: function() {
                                return $scope.bankName;
                            },
                            BranchList: function() {
                                return $scope.branchlist;
                            }
                        }

                    });

                    IfscModalInstance.result.then(function(data) {
                        $scope.beneFormModel.ifsc = data.ifscCode;
                    });
                },
                function(error) {
                    AlertDialogFactory
                        .showAlert(error.data.message, $scope);
                });
          }
          else{
            AlertDialogFactory
                .showAlert("Please Choose Bank First:", $scope);
          }

        };

        $scope.BankDetails = function(bank) {
            $scope.panel2(true);
            $scope.beneFormModel.benename = "";
            $scope.beneFormModel.ifsc = "";
            $scope.beneFormModel.accoutno = "";
            console.log(bank);
            $http
                .get(API + 'getbankdetail/' + bank.BANKCODE + '.json')
                .then(
                    function(success) {
                        $scope.panel2(false);
                        console.log(success);
                        if (success.data.data.ifsc_status == "2" || success.data.data.ifsc_status == "4") {
                            $scope.IfscRequiredFlag = true;
                            BeneDetails.ifsset(!$scope.IfscRequiredFlag);


                        } else {
                            $scope.IfscRequiredFlag = false;
                            BeneDetails.ifsset(!$scope.IfscRequiredFlag);

                        }
                        if (success.data && success.data.data.isVerificationAvailable == "1") {
                            $scope.verifyFlag = true;


                        } else {
                            $scope.verifyFlag = false;

                        }
                        switch (success.data.data.available_channels) {
                            case 0:
                                BeneDetails.setchannel($scope.channels.all);
                                BeneDetails.setselect("2");
                                $rootScope.$broadcast('message');
                                break;
                            case 1:
                                BeneDetails.setchannel($scope.channels.onlyNeft);
                                BeneDetails.setselect("0");
                                $rootScope.$broadcast('IMPS DOWN');
                                break;
                            case 2:
                                BeneDetails.setchannel($scope.channels.onlyImps);
                                BeneDetails.setselect("2");
                                $rootScope.$broadcast('message');
                                break;
                        }

                    },
                    function(error) {
                        $scope.panel2(false);
                        console.log(error);
                    });

        }

        $scope.$on("changeBeneName", function(event, data) {
            console.log(data);
            $scope.beneFormModel.benename = $scope.NewBeneName;
        });

        $scope.$on("ResetRecipientForm", function(event, data) {
            console.log(data);
            $scope.bankObj = "";
            $scope.beneFormModel.benename = "";
            $scope.beneFormModel.ifsc = "";
            $scope.beneFormModel.accoutno = "";
            $scope.IfscRequiredFlag = false;
            $http.get(
                API + 'getreciepents/' + $scope.customerdata.data.mobile + '.json').then(function(success) {
                console.log(success);
                SenderDetails.updatebene(success.data);
                UpdateBeneList();
                $scope.activateform = true;
                $scope.recipientlistFlag = false;
                $scope.recipientshowflag = true;
                $scope.addflag = false;
            }, function(error) {
                console.log(error);
            });

        });

        function UpdateBeneList() {
            $scope.customerdata = SenderDetails.getCustomerApiData();
        };


        $scope.$on("RecipientFormActive", function(event, data) {
            console.log(data);
            $scope.bankObj = "";
            $scope.beneFormModel.benename = "";
            $scope.beneFormModel.ifsc = "";
            $scope.beneFormModel.accoutno = "";
            $scope.IfscRequiredFlag = false;
            $scope.activateform = true;
            $scope.recipientlistFlag = false;
            $scope.recipientshowflag = true;
            $scope.addflag = false;
        });

        $scope.$watch('bankObj' && 'beneFormModel.ifsc', function(currentval, oldval) {
            if ($scope.bankObj == "" || $scope.bankObj == null) {
                $scope.verifyFlag = false;
                $scope.addbeneFlag = false;
            } else {
                $scope.addbeneFlag = true;
            }

            if ($scope.beneFormModel.ifsc !== "") {
                $scope.IfscRequiredFlag = false;
                BeneDetails.ifsset(!$scope.IfscRequiredFlag);
            } else {
                $scope.IfscRequiredFlag = true;
                BeneDetails.ifsset(!$scope.IfscRequiredFlag);
            }

        });


        // watcher function to help with pay process which will be carrid out in
        // transfer controller
        $scope
            .$watchGroup(
                ['RecipientForm.benename.$modelValue',
                    'RecipientForm.$valid',
                    'BanklistForm.bankselector_list.$viewValue',
                    'RecipientForm.ifsc_code.$viewValue', 'RecipientForm.bankaccountno.$viewValue'
                ],
                function(currentvalidity, oldvalidity, scope) {
                    if (currentvalidity[0] && $scope.activateform && currentvalidity[1] && $scope.RecipientForm.benename != "" && $scope.bankObj != "" && $scope.bankObj["BANKCODE"] != undefined) {
                        console.log("recipient form is valid");
                        var bank_ifsc = $scope.bankObj["BANKCODE"];
                        var bank_name = $scope.bankObj["BANKNAME"];
                        if (!($scope.beneFormModel.ifsc == null)) {
                            if (!($scope.beneFormModel.ifsc.length == 0)) {
                                bank_ifsc = $scope.beneFormModel.ifsc;
                            }
                        }
                        // set the pay data in bene rest factory
                        BeneDetails
                            .setPayData({
                                'Mobilerecipientno': $scope.BeneMobileNo,
                                'mobile_consumer': $scope.customerdata.data.mobile,
                                'receipentName': $scope.beneFormModel.benename,
                                'Accifsc': $scope.beneFormModel.accoutno + '_' + bank_ifsc,
                                'BankName': bank_name,
                                'maxamount_allowed': maxlimit.remaining
                            });

                        // broadcast's a message to be used by transfer
                        // controllers
                        $rootScope.$broadcast("paybene_data_available",
                            "pay: activated");
                    } else {
                        // broadcast's a message to be used by transfer
                        // controllers
                        $rootScope.$broadcast(
                            "paybene_data_unavailable",
                            "pay: inactivate");
                    }
                });
        // for deleting the bene from the Bene list
        var indexvalue, bene_obj, customermobile;
        $scope.DeleteBene = function(index, bene) {
            indexvalue = index;
            bene_obj = bene;


            AlertDialogFactory.showConfirm("Do u want to delete Bene", $scope)
                .then(
                    function() {
                        $rootScope.$broadcast("Confirmation_Message",
                            'Yes Delete it');

                    },
                    function() {
                        console.log("delete cancelled");
                    });
        };

        // helps o delete the element and updte the benelist in display
        var beneDeleteHelper = function() {
            $scope.customerdata.data.recipient_list.splice(indexvalue, 1);
            $scope.selectedUserName = 'Select Beneficiary ...';
            $rootScope.$broadcast('QuickFundtransfer_stop',
                'Quickpay deactivated');
            console.log("I am delete Helper");
        }

        // comfirm the delete of the Beneficiary if we have selected yes in the
        // ng dialog for
        // confirmation
        var FinalBeneDelete = function() {
            console.log("I am deleting bene");
            $scope.panel2(true);
            BeneDetails.PostDeleteBene({
                    'mobile_number': $scope.customerdata.data.mobile,
                    'recipient_id': bene_obj.recipient_id,
                    'token': TokenManger.getToken()
                })
                .then(
                    function(successresponse) {
                        TokenManger.setToken(successresponse.token);
                        $scope.panel2(false);
                        switch (successresponse.status) {
                            case 0:
                                AlertDialogFactory.showAlert(
                                    "Beneficiary removed successfully",
                                    $scope);
                                beneDeleteHelper();
                                break;
                            case -33:
                                AlertDialogFactory.showAlert(
                                    "Invalid recipient", $scope);
                                break;
                            default:

                                AlertDialogFactory.showAlert(
                                    "unknown Server Error try again",
                                    $scope);
                        }
                        // indexvale = null;
                        // bene_obj = null;
                    },
                    function(errormessage) {
                        $scope.panel2(false);
                        AlertDialogFactory.showAlert(
                            "unknown Error try again ...", $scope);
                    });
        };
        // get the delete confirmation message from the BeneDeleteController for
        // deleting the bene
        $scope.$on("Confirmation_Message", function(event, data) {
            console.log(data);
            FinalBeneDelete();
        });

        // get the broadcast data for adding new bene when we make a add bene
        // and a pay in combined
        $scope.$on("new_bene_added", function(event, data) {
            console.log(data);

            $http.get(
                API + 'getreciepents/' + $scope.customerdata.data.mobile + '.json').then(function(success) {
                console.log(success);
                SenderDetails.updatebene(success.data);
                UpdateBeneList();

            }, function(error) {
                console.log(error);
            });

        });
    };

    var IfscmodalCtrl = function($scope, $uibModalInstance, BankName,
        BranchList) {
        $scope.BankName = BankName;
        $scope.BranchlistArray = BranchList;
        $scope.BranchName;

        $scope.ok = function() {
            $uibModalInstance.close($scope.BranchName);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");

        };

    };
    // inject prevents the uglifier minifier to break the angular app
    RecipientController.$inject = ['$scope', '$uibModal', 'DummyBanklist',
        'SenderDetails', 'BeneDetails', 'TokenManger', '$rootScope',
        '$filter', 'AlertDialogFactory', '$http', 'API'
    ];
    IfscmodalCtrl.$inject = ['$scope', '$uibModalInstance', 'BankName',
            'BranchList'
        ]
        // add the controllers to angular module
    angular.module('app')
        .controller('RecipientController', RecipientController).controller(
            'IfscmodalCtrl', IfscmodalCtrl);
}());
