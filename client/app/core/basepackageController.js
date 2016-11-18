(function() {
    'use strict';
    var BasePackageController = function($scope, $rootScope, BasePackageFact,
        AlertDialogFactory) {
        console.log('base package ctrl loaded');
        $scope.model = {};
        $scope.numPerPage = 5;
        $scope.numPerPageOpt = [3, 5, 10, 20, 50, 100];
        $scope.updatenotallowed = true;
        // extra object for storing the data of the selected
        $scope.hierarchySelected = null;
        $scope.BasePackageArrayObj = {};
        // used by tthe tble in base provider edit and save process
        $scope.origtemp = {};
        var refresh_flag = false;
        // $scope.BasePackageArrayObj.providerselected = {};
        var DataExtractHelper = function() {
                $scope.BasePackageArrayObj.HierachyArray = [];
                $scope.BasePackageArrayObj.providerBasePackagesArray = [];
                // now we will scan the data for each hierarchy datas
                // for (var i = 0; i < $scope.basePackageHierarchy.length; i++) {
                // 	// used for selecting the heirachy in ng repeat
                //
                // 		$scope.BasePackageArrayObj.HierachyArray
                // 				.push($scope.basePackageHierarchy[i].hierarchyName);
                //
                //
                // 	$scope.BasePackageArrayObj.HierachyArray = $scope.BasePackageArrayObj.HierachyArray.filter( function( item, index, inputArray ) {
                //            return inputArray.indexOf(item) == index;
                //     });
                //
                // 		$scope.BasePackageArrayObj.providerBasePackagesArray
                // 		.push($scope.basePackageHierarchy[i].providerBasePackages);
                //
                //
                // 	$scope.BasePackageArrayObj.providerBasePackagesArray = $scope.BasePackageArrayObj.providerBasePackagesArray.filter( function( item, index, inputArray ) {
                //            return inputArray.indexOf(item) == index;
                //     });
                // }
                for (var i = 0; i < 4; i++) {

                    $scope.BasePackageArrayObj.HierachyArray
                        .push($scope.basePackageHierarchy[i].hierarchyName);
                    $scope.BasePackageArrayObj.providerBasePackagesArray.push($scope.basePackageHierarchy[i].providerBasePackages);
                }
                $scope.hierarchySelected = $scope.BasePackageArrayObj.HierachyArray[0];
            }
            // fetch the table list when controller is called first
        var InitGetRequest = function() {
            BasePackageFact.GetBasePackage().then(function(response) {
                console.log("initial get data for Base package list");
                console.log(response.data);
                // data is extracted from the file
                $scope.basePackageHierarchy = response.data;
                DataExtractHelper();
            }, function(errormessage) {
                console.log(errormessage);
            });
        };
        var init_flag = true

        $scope.$on('updateBasePackage', function(event, data) {
            console.log("i am hit");
            $scope.updatenotallowed = false;
            InitGetRequest();
        });
        // creates a mapping for proper index access
        $scope.Mapdict = {};
        var MapperGen = function() {
            $scope.Mapdict = {};
            for (var index = 0; index < $scope.basepackList.length; index++) {
                $scope.Mapdict[$scope.basepackList[index].id] = index;
            }
        };

        $scope
            .$watch(
                'hierarchySelected',
                function(currentvalue, oldvalue) {
                    if (init_flag) {
                        $scope.getadmin = true;
                        if ($rootScope.usertype === "ROLE_ADMIN") {
                            InitGetRequest();
                            init_flag = !init_flag;
                        }

                    } else {
                        $scope.currentPage = 1;
                        $scope.updatenotallowed = true;

                        for (var i = 0; i < 4, currentvalue !== null; i++) {
                            if (currentvalue === $scope.BasePackageArrayObj.HierachyArray[i]) {
                                $scope.basepackList = $scope.BasePackageArrayObj.providerBasePackagesArray[i];
                                MapperGen();
                                break;
                            }
                        }
                        console.log("show base pack data list");
                    }
                });
        // this flag is for the progress bar
        $scope.datafetchflag = false;

        $scope.updatebasePack = function() {
            console.log("hit update request");
            $scope.datafetchflag = true;
            BasePackageFact.UpdateBasePackage($scope.basepackList).then(
                function(response) {
                    $scope.basePackageHierarchy = response.data;
                    DataExtractHelper();
                    $scope.updatenotallowed = true;
                    $scope.datafetchflag = false;
                    // $scope.getTemplate("true")
                },
                function(errormessage) {
                    alert.info("Error Processing Request");
                    console.log(errormessage);
                    $scope.updatenotallowed = false;
                    $scope.datafetchflag = false;
                });
        };
        // gets the template to ng-include for a table row / item
        $scope.getTemplate = function(selectedPackage) {
            if (selectedPackage == null) {
                return 'display';
            } else if (selectedPackage == "true") {
                return 'display';
            } else if (selectedPackage.id === $scope.model.id) {
                return 'edit';
            } else {
                return 'display';
            }
        };

        $scope.editPackageData = function(basepackdata) {
            $scope.model = angular.copy(basepackdata);
        };
        var InputDatachecker = function(data, originaldata) {
            var original = originaldata;
            if (data.adminShare.length == 0)
                data.adminShare = original.admin;
            if (data.masterShare.length == 0)
                data.masterShare = original.master;
            if (data.distributorShare.length == 0)
                data.distributorShare = original.dist;
            if (data.retailerShare.length == 0)
                data.retailerShare = original.retail;
            return data;
        };

        $scope.saveContact = function(selected_baspack, orig_dat) {
            console.log("Saving contact");
            var select_dat = angular.copy($scope.model);
            // performs check for auto reset of the input fields as we go
            select_dat = InputDatachecker(select_dat, orig_dat);
            $scope.basepackList[$scope.Mapdict[selected_baspack.id]] = select_dat;
            $scope.updatenotallowed = false;
            $scope.reset();
        };

        $scope.reset = function() {
            $scope.model = {};
        };

        $scope.checkValidity = function(serviceTax, retailerShare,
            distributorShare, masterShare, adminShare) {
            $scope.saveFlag = false;
            if (serviceTax == 'true') {
                switch ($scope.hierarchySelected) {
                    case 'AMDR':

                        $scope.saveFlag = (Number(retailerShare) >= (Number(distributorShare)) &&
                            (Number(distributorShare) >= (Number(masterShare))) &&
                            (Number(masterShare) >= (Number(adminShare))) ? true :
                            false);
                        break;

                    case 'AMR':

                        $scope.saveFlag = (Number(retailerShare) >= (Number(masterShare)) &&
                            (Number(masterShare) >= (Number(adminShare))) ? true :
                            false);

                        break;

                    case 'ADR':
                        $scope.saveFlag = (Number(retailerShare) >= (Number(distributorShare)) &&
                            (Number(distributorShare) >= (Number(adminShare))) ? true :
                            false);

                        break;

                    case 'AR':
                        $scope.saveFlag = ((Number(retailerShare) >= (Number(adminShare))) ? true :
                            false);
                        break;

                }

                return $scope.saveFlag;

            } else {

                switch ($scope.hierarchySelected) {
                    case 'AMDR':

                        $scope.saveFlag = ((retailerShare <= distributorShare) &&
                            (distributorShare <= masterShare) &&
                            (masterShare <= adminShare) ? true : false);
                        break;

                    case 'AMR':

                        $scope.saveFlag = ((retailerShare <= masterShare) &&
                            (masterShare <= adminShare) ? true : false);

                        break;

                    case 'ADR':
                        $scope.saveFlag = ((retailerShare <= distributorShare) &&
                            (distributorShare <= adminShare) ? true : false);

                        break;

                    case 'AR':
                        $scope.saveFlag = ((retailerShare <= adminShare) ? true :
                            false);
                        break;

                }

                return $scope.saveFlag;
            }
        };

    };

    BasePackageController.$inject = ['$scope', '$rootScope',
        'BasePackageFact', 'AlertDialogFactory'
    ];
    angular.module('app').controller('BasePackageController',
        BasePackageController);
}());
