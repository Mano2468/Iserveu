(function() {
	'use strict';

	var CpmtransactionController = function($scope,$http, $rootScope,$filter,AlertDialogFactory,
		TabledataFilterFact,$mdDialog,API) {

		$scope.formatName = function(fieldName) {
			fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
			return fieldName;
		};

		// $scope.raiseRefundRequest = function(store) {
		// 	var parameters = {};
		// 	parameters.txnId = store.id;
		// 	$http.get('user/raiserefundrequests.json', {
		// 		params : parameters
		// 	}).then(function(success) {
		// 		AlertDialogFactory.showAlert(success.data.statusDesc, $scope);

		// 	}, function(error) {
		// 		AlertDialogFactory.showAlert(error.data.statusDesc, $scope);

		// 	});
		// };

		$scope.TransactionModel = {};
		var original;
		$scope.searchflag = true;
		$scope.TransactionModel = {
			from_Date : '',
			to_Date : ''
		}

		$scope.cpmdatafetchflag = false;
		$scope.CPMdatafetchFlag = function(flag) {
			$scope.cpmdatafetchflag = flag;
		}


		original = angular.copy($scope.TransactionModel);

		$scope.todaysDate = new Date();
		$scope.minDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth() - 3, $scope.todaysDate.getDate());
		$scope.maxDate = new Date($scope.todaysDate.getFullYear(),
				$scope.todaysDate.getMonth(), $scope.todaysDate.getDate());

		console.log("inside tran");

		$scope.canSubmit = function(f) {
			return f && !angular.equals($scope.TransactionModel, original);
		};

		var DateToString = function(date) {
			// return moment(date).format('YYYY-MM-DD');
			if (date != null) {
				var month = '' + (date.getMonth() + 1);
				var day = '' + date.getDate();
				var year = date.getFullYear();

				if (month.length < 2)
					month = '0' + month;
				if (day.length < 2)
					day = '0' + day;

				return [ year, month, day ].join('-');
			} else {
				return "";
			}
		};


		// stores the transaction totalamount data extracted from the report
		// $scope.totalTransaction = 0;
		// TODO move to factory as common functionality
		// function TransactionTotalExtract() {
		// 	$scope.totalTransaction = 0;
		// 	for ( var store_obj in $scope.filteredStores) {
		// 			if ($scope.filteredStores[store_obj].transactionType == "CREDIT") {
		// 				$scope.totalTransaction += $scope.filteredStores[store_obj].amountTransacted;
		// 			} else {
		// 				$scope.totalTransaction -= $scope.filteredStores[store_obj].amountTransacted;
		// 			}
		// 	}
		// 	$scope.totalTransaction = $scope.totalTransaction.toFixed(2);

		// };

		// $scope.exportData = function() {
		// alasql('SELECT * INTO XLSX("wallet.xlsx",{headers:true}) FROM ?',
		// [$scope.stores]);
		// };
		// for get Advanced filter data using chips
		$scope.readonly = false;
		$scope.tags = [];
		$scope.totalFlag = "false";
		$scope.AdvancedSearch = function(currentsearch) {
			console.log(currentsearch);
			$scope.filteredStores = TabledataFilterFact.AdvancedFilter(
	                $scope.stores, currentsearch);
	        $scope.onFilterChange();
		};

		$scope.$watch('searchflag', function(currentvalue, oldvalue) {
			// reset the search fields for both the search
			$scope.searchKeywords = null;
			$scope.tags = [];
			$scope.currentPageStores = $scope.stores;
			$scope.searchKeywords = '';
			if ($scope.search == null)return;
			$scope.search();
		});
		$scope.cpmtransaction = function() {
			$scope.CPMdatafetchFlag(true);
			var fromDate = DateToString($scope.TransactionModel.from_Date);
			var toDate = DateToString(new Date($scope.TransactionModel.to_Date
					.getFullYear(), $scope.TransactionModel.to_Date.getMonth(),
					$scope.TransactionModel.to_Date.getDate() + 1));
			var TxnObj = JSON.stringify({
				'toDate' : toDate,
				'fromDate' : fromDate
			});
			console.log(TxnObj);
			$http({
				method : 'POST',
				url : API+'cpmtfailedtxservice.json',
				contentType : 'application/json',
				data : TxnObj,
			})
					.then(
							function(successresponse) {
								console.log(successresponse);

								$scope.stores = successresponse.data.failedtransactions;
								$scope.CPMdatafetchFlag(false);
								/*$scope.setComplainflag();*/
								// Passing data to the table.

								var init;
						        $scope.searchKeywords = '';
						        $scope.filteredStores = [];
						        $scope.row = '';
						        $scope.select = select;
						        $scope.onFilterChange = onFilterChange;
						        $scope.onNumPerPageChange = onNumPerPageChange;
						        $scope.onOrderChange = onOrderChange;
						        $scope.search = search;
						        $scope.order = order;
						        $scope.numPerPageOpt = [ 3, 5, 10, 20, 50, 100,
						          200 ];
						        $scope.numPerPage = $scope.numPerPageOpt[2];
						        $scope.currentPage = 1;
						        $scope.currentPage = [];

						        function select(page) {
						         var end, start;
						         start = (page - 1) * $scope.numPerPage;
						         end = start + $scope.numPerPage;
						         return $scope.currentPageStores = $scope.filteredStores
						           .slice(start, end);
						        }
						        ;

						        function onFilterChange() {
						         $scope.totalTransaction = 0;
/*//						         TransactionTotalExtract();
*/						         $scope.select(1);
						         $scope.currentPage = 1;
						         return $scope.row = '';
						        }
						        ;

						        function onNumPerPageChange() {
						         $scope.select(1);
						         return $scope.currentPage = 1;
						        }
						        ;

						        function onOrderChange() {
						         $scope.select(1);
						         return $scope.currentPage = 1;
						        }
						        ;

						        function search() {
						         $scope.filteredStores = $filter('filter')(
						           $scope.stores,
						           $scope.searchKeywords);
						         return $scope.onFilterChange();
						        }
						        ;

						        function order(rowName) {
						         if ($scope.row === rowName) {
						          return;
						         }
						         $scope.row = rowName;
						         $scope.filteredStores = $filter('orderBy')(
						           $scope.stores, rowName);
						         return $scope.onOrderChange();
						        }
						        ;

						        init = function() {
						         $scope.search();
						         return $scope.select($scope.currentPage);
						        };
						        init();

							},
							function(errorresponse) {
								$scope.CPMdatafetchFlag(false);
								AlertDialogFactory.showAlert(
										errorresponse.data.status, $scope);
							});
		};

    $scope.ReinitializeTxn = function(data){
    	$scope.bene = data;
    	var phoneNo = JSON.stringify({
            'number': $scope.bene.mobileNumber,
            'type': '5',
            'pin': '',
            'otc': '',
            'fName': '',
            'routingType': '',
            'mothersMaidenName': '',
            'state': '',
            'beneAccount': '',
            'beneMobile': '',
            'address': '',
            'birthDay': '',
            'gender': '',
            'otcRefCode': '',
            'beneNickName': '',
            'beneIFSC': '',
            'lname': '',
            'beneName': '',
            'beneCode': '',
            'account': '',
            'amount': '1.00',
            'amount_All': '1.00',
            'comment': 'test'
        });

        $http({
            method: 'POST',
            url: API +'cpmtservice.json',
            contentType: 'application/json',
            data: phoneNo,
        }).then(function(successresponse) {
        	console.log(successresponse.data.apiResponse.addinfo);
        	var RBenedata = successresponse.data.apiResponse.addinfo;
            $scope.RBenelist = {};
            $scope.RBenelist = JSON.parse(RBenedata);
            console.log($scope.RBenelist);
            $scope.showDialog();
        },
        function(errorresponse) {
        	AlertDialogFactory.showAlert(
					errorresponse.data.statusDesc, $scope);
            });
    };
    $scope.showDialog = function() {
	    $mdDialog.show({
	      controller: RDialogController,
	      templateUrl: 'Dialog.tmpl.html',
	      parent: angular.element(document.body),
	      // targetEvent: ev,
	      clickOutsideToClose:false,
	      locals:
	    	  {
	        benelist: $scope.RBenelist
	        }
	    }).then(function(selectedbene) {
	            var ReinitializeTxnObj = JSON.stringify({
	                'number': $scope.bene.mobileNumber,
	                'transId': $scope.bene.apiTId,
	                'type': '7',
	                'pin': '',
	                'otc': '',
	                'fName': '',
	                'routingType': selectedbene.type,
	                'mothersMaidenName': '',
	                'state': '',
	                'beneAccount': '',
	                'beneMobile': '',
	                'address': '',
	                'birthDay': '',
	                'gender': '',
	                'otcRefCode': '',
	                'beneNickName': '',
	                'beneIFSC': selectedbene.IFSC,
	                'lname': '',
	                'beneName': '',
	                'beneCode': selectedbene.BeneficiaryCode,
	                'account': '',
	                'amount': $scope.bene.amountTransacted,
	                'amount_All': '1.00',
	                'comment': 'test'
	            });
	            $http({
	                method: 'POST',
	                url: API +'cpmtservice.json',
	                contentType: 'application/json',
	                data: ReinitializeTxnObj,
	            }).then(function(successresponse) {

	            	AlertDialogFactory.showAlert(
	            			successresponse.data.statusDesc, $scope);

	                console.log(successresponse);
	            },
	             function(errorresponse) {
	            	AlertDialogFactory.showAlert(
							errorresponse.data.statusDesc, $scope);
	            });

	        }, function() {
	          $scope.status = 'You cancelled the dialog.';
	          console.log($scope.status);
	        });
	  };
	};

	  function RDialogController($scope, $mdDialog,benelist) {
		    $scope.Benelist = benelist;
		    $scope.selecet = false;
		    $scope.Selected = function(bene,type){
		    	if(type==null || type=='undefined'){
		    		$scope.selecet = false;

		    	}else{
		        $scope.selecet = true;
		        $scope.SelectedBeneForTxn = bene;
		        $scope.SelectedBeneForTxn.type = type;
		        $scope.Benename = bene.BeneficiaryName;
		    	}
		    };

		    $scope.hide = function() {
		      $mdDialog.hide();
		    };

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };

		    $scope.answer = function() {
		      $mdDialog.hide($scope.SelectedBeneForTxn);
		    };
		  }
	CpmtransactionController.$inject = ['$scope', '$http', '$rootScope',
			'$filter','AlertDialogFactory',
			'TabledataFilterFact','$mdDialog','API'];
	RDialogController.$inject = ['$scope','$mdDialog','benelist'];
	angular.module('app').controller('CpmtransactionController',
			CpmtransactionController).controller('RDialogController',RDialogController);
}());
