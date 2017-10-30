angular.module('sq.SmartQuoteDesktop')
.controller('SQViewEditQuoteController',function($uibModal,$scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQUserHomeServices,hotkeys,$http,SQQuoteServices,CalculationFactory){
console.log('initialise SQViewEditQuoteController');
$scope.quoteListView=[];
$scope.quoteView={};
$scope.showEditQuoteView=false;

$scope.form={};
$scope.customerQuote={};
$scope.addProduct={};
$scope.isProductSelected=false;
$scope.isProductInvalid=false;
$scope.isCustomerSelected=false;
$scope.isCustomerInvalid=false;

var isSalesPersonExist=false;
var isSupplierExist=false;

$scope.isAddProductModalShow=false;
$scope.isEditViewShow=false;

$scope.competeQuote=["Yes","No"];
$scope.currentSupplierList=[];
$scope.salesPersonList=[];
$scope.userList=[];
$scope.isAlternateAdded=false;

//=============== init date========================
$scope.today = function() {
	$scope.dt = new Date();
	console.log($scope.dt)
	return $scope.dt;

};
$scope.open1 = function() {
$scope.popup1.opened = true;
};

$scope.initDate=function(){
$scope.popup1={};
$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = "dd-MM-yyyy";//$scope.formats[1];
$scope.dateOptions = {
formatYear: 'yy',
startingDay: 1,
showWeeks: false
};
$scope.customerQuote.modefiedDate=$scope.today();
};

$scope.quoteDateChanged=function(quoteDate){
// console.log("quoteDateChanged");
// console.log(quoteDate);
// console.log(moment(quoteDate).format());
// console.log(moment(quoteDate).format());
// console.log(moment(quoteDate).format('YYYY-MM-DD,h:mm:ss a'));
};
$scope.getFormattedDate=function(date){
var dt = new Date(date);
// console.log("date ::: ",dt)
// var fDate= moment(dt).format('YYYY-MM-DD');
var fDate= moment(dt).format("DD-MM-YYYY");
// console.log("getFormattedDate : "+fDate);
// console.log(moment(fDate).format('YYYY-MM-DD'))
// return moment(fDate).format('yyyy-MM-dd');
return fDate;
};

//initialising Search======================
$scope.initAuotoComplete=function(){
// $scope.selectedProduct=null;
products = new Bloodhound({
	datumTokenizer:function(d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	prefetch: {
		url: "/smartquote/products.json?query=%QUERY",
		cache: false,
		beforeSend: function(xhr){
        $rootScope.showSpinner();
        },
		filter: function (devices) {
			$rootScope.hideSpinner();
			return $.map(devices, function (device) {
				return {
					code: device.code,
					value : device.value
				};
			});
		}
	},
});
products.clearPrefetchCache();
products.initialize();
$rootScope.productsDataset = {
	displayKey: 'value',
	limit: 200,
// async: false,
source: products.ttAdapter(),
};

$rootScope.exampleOptions = {
	displayKey: 'title',
	highlight: true
};
// $timeout(function() {
// 	$rootScope.hideSpinner();
// }, 1000);
};
// $scope.initAuotoComplete=function(){
// 	$scope.selectedProduct=null;
// 	 products = new Bloodhound({
// 	    // datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.value); },
// 	    datumTokenizer:function(d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
// 	    queryTokenizer: Bloodhound.tokenizers.whitespace,
// 	    // local: $scope.productList,
// 	    prefetch: {
// 		url: "smartquote/products.json?query=%QUERY",
// 		cache: false,
// 		filter: function (devices) {
// 		return $.map(devices, function (device) {
// 		return {
// 			code: device.code,
// 		    value : device.value
// 		};
// 		});
// 		}
// 		},
// 	  });
//     products.initialize();
    
//     $rootScope.productsDataset = {
//       displayKey: 'value',
//       limit: 200,
//       source: products.ttAdapter(),
//     };
//     $rootScope.exampleOptions = {
//       displayKey: 'title',
//       highlight: true
//     };
//     $timeout(function() {
//   		 $rootScope.hideSpinner();
//   	}, 1000);
// }

$scope.dataTableOpt = {
   //custom datatable options 
  // or load data through ajax call also
  "aLengthMenu": [[10, 50, 100,-1], [10, 50, 100,'All']],
  };

// ===============================UIB MODAL CODE=================================//
$scope.animationsEnabled=true;
$scope.openMyModal = function (product) {
	var modalInstance1=$uibModal.open({
	animation: $scope.animationsEnabled,
	backdrop: "static",
	keyboard: false,
	templateUrl: 'addProductModal.html',
	size: 'lg',
	controller: 'SQAddProductModalController',
	resolve: {
	dataToModal: function () {
		var dataToModal
		if ($scope.productButtonStatus=='add') {	
		dataToModal={
			'quoteStatus':'edit',
			'productButtonStatus':$scope.productButtonStatus,
			'customerQuote':$scope.customerQuote,
			// 'productList':$scope.productList,
			'productGroupList':$scope.productGroupList,
			'isAddProductModalShow':$scope.isAddProductModalShow,
			// 'addedProductCount': $scope.addedProductCount
			}
		}else if ($scope.productButtonStatus=='edit') {
			dataToModal={
			'quoteStatus':'edit',
			'productButtonStatus':$scope.productButtonStatus,
			'customerQuote':$scope.customerQuote,
			// 'productList':$scope.productList,
			'productGroupList':$scope.productGroupList,
			'isAddProductModalShow':$scope.isAddProductModalShow,
			'product':$scope.editProduct,
			// 'addedProductCount': $scope.addedProductCount
			}	
		}
		return dataToModal
	}
	}
	});
	modalInstance1.result.then(function (dataFromModal) {
	console.log("dataFromModal");
	console.log(dataFromModal);
	if (dataFromModal.addNextProduct.toLowerCase()=="addnextproduct") {
		// $scope.addProductToQuote(dataFromModal);
		// $scope.isAddProductModalShow=true;
		// $scope.openMyModal();
	}else if(dataFromModal.addNextProduct.toLowerCase()=="saveclose"){
	$rootScope.addProductToEditQuote(dataFromModal);
	$scope.isAddProductModalShow=false;
	}else if(dataFromModal.addNextProduct.toLowerCase()=="sessiontimeout"){
	console.log("Session time out update quote >>")
	$scope.isAddProductModalShow=false;
	$scope.updateQuote();
	}
	}, function () {
	$log.info('Modal dismissed at: ' + new Date());
	$scope.isAddProductModalShow=false;
	});

};

// ===============================UIB MODAL CODE=================================//

$scope.initViewEditQuote=function(){
$rootScope.showSpinner();
SQQuoteServices.GetQuoteView();

};
$scope.initViewEditQuote();

$scope.handleGetQuoteViewDoneResponse=function(data){
if(data){
	// console.log(data)
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
 	$scope.quoteListView=data.result;
 	// $rootScope.showSpinner();
	SQUserHomeServices.GetServices();
}else{
  $rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventGetQuoteViewDone = $scope.$on("GetQuoteViewDone", function(event, message){
$scope.handleGetQuoteViewDoneResponse(message);      
});

var cleanupEventGetQuoteViewNotDone = $scope.$on("GetQuoteViewNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// Get Terms & Services=====================================
$scope.handleGetServicesDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.serviceList=data.result;
  $scope.serviceList1=data.result;
  // $scope.serviceList1=data.result;
  	// $rootScope.showSpinner();
	SQUserHomeServices.GetTermsConditions();
}
// $rootScope.hideSpinner();
}
}
};

var cleanupEventGetServicesDone = $scope.$on("GetServicesDone", function(event, message){
$scope.handleGetServicesDoneResponse(message);      
});

var cleanupEventGetServicesNotDone = $scope.$on("GetServicesNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// -------------------------------------------------------------------
$scope.handleGetTermsConditionsDoneResponse=function(data){
 // console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.termConditionList=data.result;
  $scope.termConditionList1=data.result;
  // $scope.termConditionList1=data.result;
	
}
 $rootScope.hideSpinner();
}
}
};

var cleanupEventGetTermsConditionsDone = $scope.$on("GetTermsConditionsDone", function(event, message){
$scope.handleGetTermsConditionsDoneResponse(message);      
});

var cleanupEventGetTermsConditionsNotDone = $scope.$on("GetTermsConditionsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// ====================View Edit================
$scope.termConditionList=[];
$scope.servicesList=[];

var quote;
$scope.initEditQuote=function(quote1){
// console.log(quote)
$rootScope.showSpinner();
SQQuoteServices.GetCurrentSupplierList();
quote=quote1;
};
/*=============GET CURRENT SUPPLIER LIST==================*/
$scope.handleGetCurrentSupplierListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
 	$scope.currentSupplierList=data.result;
 	// $rootScope.showSpinner();
	// SQUserHomeServices.GetSalesPersonList();
	SQUserHomeServices.GetUserList();
}else{
  $rootScope.alertError(data.message);
}
// $rootScope.hideSpinner();
}
}
};

var cleanupEventGetCurrentSupplierListDone = $scope.$on("GetCurrentSupplierListDone", function(event, message){
$scope.handleGetCurrentSupplierListDoneResponse(message);      
});

var cleanupEventGetCurrentSupplierListNotDone = $scope.$on("GetCurrentSupplierListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*==========================GET USER LIST==============================*/
$scope.handleGetUserListDoneResponse=function(data){
if(data){
if (data.code) {	
  if(data.code.toUpperCase()=='SUCCESS'){   
	console.log(data)	;
	$scope.userList=data.result;
	console.log($rootScope.userData);
	$scope.customerQuote.salesPerson='';
	angular.forEach($scope.userList, function(element, key){
		if (element.key==quote.salesPersonId && element.value==quote.salesPerson) {
			console.log("equal")
			$scope.customerQuote.salesPerson=element;
		}
	});
	SQQuoteServices.GetTermsAndServiceList(quote.quoteId);
	}
  // $rootScope.hideSpinner();
}
}
};

var cleanupEventGetUserListDone = $scope.$on("GetUserListDone", function(event, message){
$scope.handleGetUserListDoneResponse(message);      
});

var cleanupEventGetUserListNotDone = $scope.$on("GetUserListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// =========GetTermsAndServiceList

$scope.handleGetTermsAndServiceListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	// console.log(data)
 	$scope.selectedTermConditionList=data.result.termConditionList;
 	$scope.selectedServiceList=data.result.serviceList;
	$scope.getProductsList();
	
	
	
}else{
  $rootScope.alertError(data.message);
}
// $rootScope.hideSpinner();
}
}
};

var cleanupEventGetTermsAndServiceListDone = $scope.$on("GetTermsAndServiceListDone", function(event, message){
$scope.handleGetTermsAndServiceListDoneResponse(message);      
});

var cleanupEventGetTermsAndServiceListNotDone = $scope.$on("GetTermsAndServiceListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// =====================getProductsList=======
$scope.getProductsList=function(){
	console.log("getProductsList")
	// $scope.initAuotoComplete();
	$scope.checkSelectedTermsAndCondition();
	$scope.checkSelectedServices();
	$scope.initAuotoComplete();
	$scope.getProductGroup();
	// $scope.initAuotoComplete();
}

// $scope.handleGetProductListDoneResponse=function(data){
// if(data){
// if (data.code){
//   if(data.code.toUpperCase()=='SUCCESS'){
//   		// $rootScope.hideSpinner();
//    		$scope.productList=data.result;
// 		$scope.priceArray=[];
// 		// $scope.getProductGroup();
// 		$scope.checkSelectedTermsAndCondition();
// 		$scope.checkSelectedServices();
// 		$scope.initAuotoComplete();
// 		$scope.getProductGroup();
//   }else{
//    $rootScope.hideSpinner();
//    $rootScope.alertError(data.message);
//   }
// // $rootScope.hideLoadSpinner();
// }
// }
// };

// var cleanupEventGetProductListDone = $scope.$on("GetProductListDone", function(event, message){
// 	// console.log("GetProductListDone");
// $scope.handleGetProductListDoneResponse(message);      
// });

// var cleanupEventGetProductListNotDone = $scope.$on("GetProductListNotDone", function(event, message){
// $rootScope.alertServerError("Server error");
// $rootScope.hideSpinner();
// });
/*=============GET PRODUCT GROUP LIST==================*/
$scope.productGroupList=[];
$scope.getProductGroup=function(){
	// console.log("getProductGroup")
	$rootScope.showSpinner();
	SQUserHomeServices.GetProductGroupList();
	// }
};
$scope.handleGetGetProductGroupListDoneResponse=function(data){
	// console.log(data)
	if(data){
	if (data.code) {
	if(data.code.toUpperCase()=='SUCCESS'){
	$scope.productGroupList=data.result;

	//$scope.openMyModal(); 
	}else{
	$rootScope.hideSpinner();
    $rootScope.alertError(data.message);
	}
	$rootScope.hideSpinner();
	// $rootScope.hideLoadSpinner();
	}
	}
};

var cleanupEventGetProductGroupListDone = $scope.$on("GetProductGroupListDone", function(event, message){
$scope.handleGetGetProductGroupListDoneResponse(message);      
});

var cleanupEventGetProductGroupListNotDone = $scope.$on("GetProductGroupListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*=============GET PRODUCT GROUP LIST==================*/
$scope.initProducts=function(){
	$scope.getProductGroup();
};
//========================================================
/*=============GET SALES PERSON LIST==================*/
$scope.handleGetSalesPersonListDoneResponse=function(data){
if(data){
// console.log(data)	
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
 	$scope.salesPersonList=data.result;
 	// $rootScope.showSpinner();
	SQQuoteServices.GetTermsAndServiceList(quote.quoteId);
}else{
  $rootScope.alertError(data.message);
}
// $rootScope.hideSpinner();
}
}
};

var cleanupEventGetSalesPersonListDone = $scope.$on("GetSalesPersonListDone", function(event, message){
$scope.handleGetSalesPersonListDoneResponse(message);      
});

var cleanupEventGetSalesPersonListNotDone = $scope.$on("GetSalesPersonListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});


$scope.checkSelectedServices=function(){
if ($scope.selectedServiceList!='' && $scope.serviceList!='') {
for (var i =0; i<$scope.serviceList.length; i++) {
	if ($scope.selectedServiceList.length>0) {
	for (var j =0; j<$scope.selectedServiceList.length; j++) {
		if ($scope.serviceList[i].key==$scope.selectedServiceList[j].key) {
			$scope.serviceList[i].code=true;
			break;
		}else{
			$scope.serviceList[i].code=false;
		}
	}
}else{
$scope.serviceList[i].code=false;
}
}
}
 // console.log(JSON.stringify($scope.selectedServiceList));
 // console.log(JSON.stringify($scope.serviceList));
};

$scope.checkSelectedTermsAndCondition=function(){
if ($scope.selectedTermConditionList!='' && $scope.termConditionList!='') {
	// console.log("checkSelectedTermsAndCondition")
for (var i =0; i<$scope.termConditionList.length; i++) {
	if ($scope.selectedTermConditionList.length>0) {	
	for (var j =0; j<$scope.selectedTermConditionList.length; j++) {
		if ($scope.termConditionList[i].key==$scope.selectedTermConditionList[j].key) {
			$scope.termConditionList[i].code=true;
			break;
		}else{
			$scope.termConditionList[i].code=false;
		}
	}
	}else{
		$scope.termConditionList[i].code=false;
	}
}
}
// console.log(JSON.stringify($scope.selectedTermConditionList));
// console.log(JSON.stringify($scope.termConditionList));
};

$scope.closeEditProduct=function(){
console.log("closeEditProducts");
};

$scope.viewDetailInformation=function(quote){
	console.log(quote);
	var currentQuote=angular.copy(quote);
	// var dt = new Date(currentQuote.createdDate);
	// console.log("date ::: ",dt)
	
	$scope.showEditQuoteView=true;
	if (currentQuote.competeQuote.toUpperCase=='NO') {
	$scope.isCurrentSupplierNameRequired=false;
	}else if (currentQuote.competeQuote.toUpperCase=='YES') {
	$scope.isCurrentSupplierNameRequired=true;
	}
	var salesPerson = {'code': currentQuote.salesPerson, 'key': currentQuote.salesPersonId, 'value': currentQuote.salesPerson}
	if (currentQuote.currentSupplierId>0) {
	var currentSupplierName = {'code': currentQuote.currentSupplierName, 'key': currentQuote.currentSupplierId, 'value': currentQuote.currentSupplierName}	
	}else{
	// var currentSupplierName = {'code': null, 'key': null, 'value': null}	
	var currentSupplierName ="";	
	}
	$scope.isEditViewShow=true;
	currentQuote.currentSupplierName=currentSupplierName;
	currentQuote.salesPerson=salesPerson;
	$scope.customerQuote=currentQuote;
	$scope.customerQuote.productList=$scope.getProductsListArray(currentQuote.productList);
    // $scope.customerQuote.createdDate=dt;

	$scope.initEditQuote(quote);
	$scope.calculateAllInformation();
	$scope.checkAlternativeAdded();
	$rootScope.isQuoteActivated=true;
	$scope.initDate();
	

};
// ===============****************************=================================
$scope.getProductsListArray=function(productList){
	// console.log("getProductsListArray");
	// console.log(JSON.stringify(productList));
	var list=[];	
	if (productList.length>0) {
		angular.forEach(productList, function(product, key){
			// console.log("looop... "+key)
			if (product.isAlternative!=null) {
				if (product.isAlternative.toUpperCase()=="YES" && key>0) {
				// console.log("product.isAlternative "+product.isAlternative.toUpperCase())
				if (product.altForQuoteDetailId>0) {
					angular.forEach(list, function(listProd, key){
						if (listProd.quoteDetailId==product.altForQuoteDetailId) {
							var altProd=product;
							listProd.altProd=angular.copy(altProd);
							listProd.isLinkedExact=true
						}
					});
				}
			}else{
				list.push(product);
			}
			}else{
				list.push(product);
			}
			// console.log(list)
		});
	}
	return list;
};

/*===================GET PRODUCT GROUP DETAILS=================*/
$scope.checkIfProductExist=function(){
		$scope.isProductExist=false;
	 	angular.forEach( $scope.customerQuote.productList, function(value, key){
	 		if (value.itemCode==$scope.addProduct.itemCode) {
	 			// console.log("Duplicates")
	 			$scope.isProductExist=true;
	 		}
	 	});
	};

// $scope.disableCurrentSupplierGP=false;
// $scope.getProductDetails=function(product){
// //console.log(product);
// $rootScope.showSpinner();
// SQUserHomeServices.GetProductDetails(product.code);
// };

// $scope.handleGetProductDetailsDoneResponse=function(data){
// if(data){
// if (data.code) {
//   if(data.code.toUpperCase()=='SUCCESS'){
//   	console.log(data.objProductResponseBean)
//   	$scope.addProduct=angular.copy(data.objProductResponseBean);
//   	$scope.addProduct.quotePrice=null;
//   	$scope.productInfo=angular.copy(data.objProductResponseBean);
//   	$scope.addProduct.itemQty=1;
//   	if ($scope.addProduct.gstFlag.toUpperCase()=='NO') {
//   		$scope.disableCurrentSupplierGP=true;	
//   	};
//   	// $scope.addProduct.itemQty=data.objProductResponseBean.qtyBreak1;
//   	$scope.createArrayOfQuantityAndPrice($scope.addProduct);
//   	$scope.isProductSelected=true;
//   	$scope.isProductInvalid=false;
//   	// $scope.checkIfProductExist();
  	
// 	}else{
// 		$rootScope.alertError(data.message);
// 	}
// }
// }
// $rootScope.hideSpinner();
// };

// var cleanupEventGetProductDetailsDone = $scope.$on("GetProductDetailsDone", function(event, message){
// $scope.handleGetProductDetailsDoneResponse(message);      
// });

// var cleanupEventGetProductDetailsNotDone = $scope.$on("GetProductDetailsNotDone", function(event, message){
// $rootScope.alertServerError("Server error");
// $rootScope.hideSpinner();
// });

// ===================== RESET & CANCEL=====================

$scope.resetUpdateQuote=function(){
	// $rootScope.moveToTop();
	$log.debug("cancelCreateQuote call");
	$scope.customerQuote={};
	$scope.addedProductList=[];
	$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
	$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
	$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
	isSupplierExist=false;
	isSalesPersonExist=false;
	$scope.customerQuote.competeQuote="No";
	// $scope.serviceList=[];
	// $scope.termConditionList=[];
	$scope.isEditViewShow=false;
	$scope.form.addCustomerQuote.submitted=false;
	$scope.form.addCustomerQuote.$setPristine();
	$scope.showEditQuoteView=false;
	$scope.showAddProductError=false;
	$rootScope.isQuoteActivated=false;
	$scope.initDate();
}
$scope.cancelCreateQuote=function(){
var previousWindowKeyDown = window.onkeydown;
  swal({
  title: 'Confirm Navigation',
  text: "Your unsaved data will be lost. \n Are you sure you want to leave this page ?",
  showCancelButton: true,
  closeOnConfirm: true,
  cancelButtonText:"Stay on Page",
  confirmButtonText:"Leave Page"
  }, function (isConfirm) {
  if (isConfirm) {
    $scope.resetUpdateQuote();
  } 
  });
	
}
// ===================== ADD PRODUCTS=====================
$scope.resetCurrentSupplier=function(){
console.log("resetCurrentSupplier");
console.log($scope.customerQuote.productList.length)
angular.forEach($scope.customerQuote.productList, function(value, key){
			value.currentSupplierPrice=0;
			value.currentSupplierTotal=0;
			value.currentSupplierGP=0;
			value.savings=0;
			if(value.altProd.itemCode){
			value.altProd.currentSupplierPrice=0;
			value.altProd.currentSupplierTotal=0;
			value.altProd.currentSupplierGP=0;
			value.altProd.savings=0;
			}
		});
}

$scope.showConfirmationWindow=function(){
var previousWindowKeyDown = window.onkeydown;
  swal({
  title: 'Are you sure?',
  text: "Changing compete quote to 'no' can reset current customer price data to 0 .",
  showCancelButton: true,
  closeOnConfirm: true,
  cancelButtonText:"Cancel",
  confirmButtonText:"Confirm"
  }, function (isConfirm) {
    if (isConfirm) {
      $scope.resetCurrentSupplier();
    }else{
      $scope.customerQuote.competeQuote='Yes';	
    } 
  });
};
$scope.currentSupplierNameChanged=function(){
	if ($scope.customerQuote.currentSupplierName!='') {
		$scope.customerQuote.competeQuote='Yes';	
	}
	if($scope.customerQuote.currentSupplierName==''){
		$scope.customerQuote.competeQuote='No';
	}
}
$scope.competeQuoteChanged=function(){
console.log($scope.customerQuote.competeQuote)
if ($scope.customerQuote.competeQuote=='No'){
	// if ($scope.customerQuote.productList.length>0) {
	// $scope.showConfirmationWindow();	
	// };	
	$scope.customerQuote.currentSupplierName=null;
	$scope.isCurrentSupplierNameRequired=false;
	if ($scope.customerQuote.productList) {
	if($scope.customerQuote.productList.length>0){
		$scope.showConfirmationWindow();
	}else{
	$scope.isCurrentSupplierNameRequired=false;
	$scope.customerQuote.currentSupplierName="";
	}	
	}else{
	$scope.isCurrentSupplierNameRequired=false;
	$scope.customerQuote.currentSupplierName="";
	}
	$scope.calculateAllInformation();
}
if ($scope.customerQuote.competeQuote=='Yes'){
	$scope.isCurrentSupplierNameRequired=true;
}
}



// $scope.productCodeNotFound=function(noProductFound){
// 	if (noProductFound!=undefined) {
// 	// console.log("productCodeNotFound");
// 	// console.log(noProductFound);
// 	if ($scope.productButtonStatus=='add') {
// 	$scope.isNewProduct=noProductFound;
// 	}
// 	}
// };

$scope.productCodeChanged=function(){
// console.log(noProductFound)	
// $scope.isNewProduct=noProductFound
if ($scope.isProductSelected) {
// console.log($scope.isProductSelected)
var code=$scope.addProduct.itemCode;	
$scope.addProduct={};
$scope.productInfo=undefined;
$scope.addProduct.itemCode=code;
$scope.priceArray=[];
// $scope.isProductInvalid=true;
}else{
	if ($scope.addProduct.itemCode) {
		if ($scope.addProduct.itemCode.length==2) {
		// var prodLike='';
	 //    prodLike=$scope.addProduct.itemCode;
		// $rootScope.showLoadSpinner();
		// // $rootScope.showSpinner();
		// SQUserHomeServices.GetProductList(prodLike);
		// $('#targetItemCode').blur();	
		}
	}
}
};
$scope.showAddProductModal=function(status,product,index){
	console.log('showAddProductModal')
	// console.log($scope.form.addCustomerQuote)
	// console.log("Product")
	// console.log(product)
	// console.log($scope.customerQuote.productList)
	var prod=angular.copy(product);
	if ($scope.isEditViewShow) {	
	if ($scope.form.addCustomerQuote.$valid) {
		// console.log("edit valid")
			$scope.productButtonStatus=status;
			$scope.isAddProductModalShow=true;
			// console.log($scope.productButtonStatus)
			if ($scope.productButtonStatus=='add') {
			    // $scope.initProducts();
			    $scope.openMyModal();
			}else if($scope.productButtonStatus=='edit'){
				$scope.editProduct=angular.copy(product);
				$scope.editIndex=index;
				// console.log(prod)
				$rootScope.showSpinner();
				$scope.getEditProductAlternatives($scope.editProduct.itemCode);

				// $scope.openMyModal();
			}

	}else{
		$scope.form.addCustomerQuote.submitted=true;		
	}
	}
};

$scope.assignAlternatives=function(data){
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				if (data.objProductResponseBean.alternativeProductList) {
				if (data.objProductResponseBean.alternativeProductList.length>0) {
					$scope.editProduct.alternativeProductList=angular.copy(data.objProductResponseBean.alternativeProductList);
				}	
				}
				$scope.openMyModal();
			}
		};			
	}
	$rootScope.hideSpinner();
};
$scope.getEditProductAlternatives=function(productCode){
// $rootScope.showLoadSpinner();
$http({
method: "POST",
// url: "/smartquote/getProductDetails?productCode="+productCode,
url: "/smartquote/getProductDetailsWithAlternatives?productCode="+productCode,
}).success(function(data, status, header, config){
console.log(data)
if (data.code=="sessionTimeOut") {
$scope.addProductFromModal("sessiontimeout");
}else{
$scope.assignAlternatives(data);
}
}).error(function(data, status, header, config){
$rootScope.$broadcast('GetProductDetailsNotDone', data);
});
}
// ===============CALCULATION===============================
$scope.getPriceInPercentage=function(price,cost){
	var val;
	val=((price-cost)/price)*100;
	return val.toFixed(2);
};


// $scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
// $scope.getSupplierInformation=function(){
// 	var subtotal=0;
// 	var gstTotal=0;
// 	// console.log($scope.customerQuote.pricesGstInclude);
// 	if ($scope.customerQuote.productList.length>0) {
// 		angular.forEach($scope.customerQuote.productList, function(value, key){
// 			// console.log(value);
// 			subtotal=subtotal+parseFloat(value.currentSupplierTotal);	
// 			if ($scope.customerQuote.pricesGstInclude) {	
// 				if (value.gstFlag.toUpperCase()=='YES') {
// 					gstTotal=gstTotal+((10/100)*value.currentSupplierTotal)
// 				}
// 			}
// 		});
// 		$scope.supplierInformation.subtotal=subtotal;
// 		$scope.supplierInformation.gstTotal=gstTotal;
// 		$scope.supplierInformation.total=$scope.supplierInformation.subtotal+$scope.supplierInformation.gstTotal;
// 	}else{
// 		$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
// 	}
// };
// $scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
// $scope.getTotalInformation=function(){
// 	var subtotal=0;
// 	var gstTotal=0;
// 	if ($scope.customerQuote.productList.length>0) {
// 		angular.forEach($scope.customerQuote.productList, function(value, key){
// 			subtotal=subtotal+parseFloat(value.total);
// 			if ($scope.customerQuote.pricesGstInclude) {
// 			if (value.gstFlag.toUpperCase()=='YES') {
// 			gstTotal=gstTotal+((10/100)*parseFloat(value.total))
// 			}
// 			}
// 		});
// 		$scope.totalInformation.subtotal=subtotal;
// 		$scope.totalInformation.gstTotal=gstTotal;
// 		$scope.totalInformation.total=$scope.totalInformation.subtotal+$scope.totalInformation.gstTotal;
// 	}else{
// 		$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
// 	}
// };

// $scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
// $scope.getGpInformation=function(){
// 	var gpRequiredSubtotal=0;
// 	var currentSupplierGPSubtotal=0;
// 	var countGpRequired=0;
// 	var countcurrentSupplierGP=0;
// 	if ($scope.customerQuote.productList.length>0) {
// 		angular.forEach($scope.customerQuote.productList, function(value, key){
// 			gpRequiredSubtotal=gpRequiredSubtotal+parseFloat(value.gpRequired);
// 			countGpRequired++;
// 		});
// 		angular.forEach($scope.customerQuote.productList, function(value, key){
// 			currentSupplierGPSubtotal=currentSupplierGPSubtotal+parseFloat(value.currentSupplierGP);
// 			countcurrentSupplierGP++;
// 		});
// 		$scope.gpInformation.avgGpRequired=gpRequiredSubtotal/countGpRequired;
// 		$scope.gpInformation.avgCurrentSupplierGp=currentSupplierGPSubtotal/countcurrentSupplierGP;
// 	}else{
// 		$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};	
// 	}
// };
$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getSupplierInformation=function(){
$scope.supplierInformation=CalculationFactory.getSupplierInformation($scope.customerQuote);
};

$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
$scope.getGpInformation=function(){
$scope.gpInformation=CalculationFactory.getGpInformation($scope.customerQuote);
};

$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getTotalInformation=function(){
$scope.totalInformation=CalculationFactory.getTotalInformation($scope.customerQuote);
};

$scope.calculateAllInformation=function(){
	// console.log("calculateAllInformation")
	$scope.getSupplierInformation();
  	$scope.getGpInformation();
  	$scope.getTotalInformation();	
  	$scope.calculateAlternativeProductsInformation();
};
//=============Calculation==========================
$scope.altSupplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getAltSupplierInformation=function(){
$scope.altSupplierInformation=CalculationFactory.getAltSupplierInformation($scope.customerQuote);
};

$scope.altGpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
$scope.getAltGpInformation=function(){
$scope.altGpInformation=CalculationFactory.getAltGpInformation($scope.customerQuote);
};

$scope.altTotalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getAltTotalInformation=function(){
	// console.log("getAltTotalInformation")
$scope.altTotalInformation=CalculationFactory.getAltTotalInformation($scope.customerQuote);	
};
$scope.calculateAlternativeProductsInformation=function(){
	console.log("calculateAlternativeProductsInformation")
	$scope.getAltSupplierInformation();
	$scope.getAltGpInformation();
	$scope.getAltTotalInformation();
	// console.log("isAlternateAdded" + $scope.isAlternateAdded)
};
$scope.checkAlternativeAdded=function(){
	var count=0;
	$rootScope.addedProductCount=0;
	if ($scope.customerQuote.productList.length>0) {
		angular.forEach($scope.customerQuote.productList, function(value, key){
			if (value.altProd) {
			if (value.altProd.itemCode){
				count++;
				$rootScope.addedProductCount=$rootScope.addedProductCount+2;
			}
			}else{
				$rootScope.addedProductCount++;
			}
		});
	}	
	if (count>0) {
		$scope.isAlternateAdded=true;
		$scope.customerQuote.saveWithAlternative=true;
	}else{
		$scope.isAlternateAdded=false;
	}
	// console.log($rootScope.addedProductCount);
}
//============================================================

$rootScope.addProductToEditQuote=function(dataFromModal){
	console.log("addProductToEditQuote<<<<<<<<...>>>>>")
	$scope.addProduct=dataFromModal.addProduct;
	$scope.productButtonStatus=dataFromModal.productButtonStatus;
	$scope.isNewProduct=dataFromModal.isNewProduct;
	// console.log($scope.addProduct)
	var product;
	product=angular.copy($scope.addProduct);
	// console.log(product);
	if (product.currentSupplierPrice>0 && product.quotePrice>0) {//product.currentSupplierPrice>product.quotePrice
	if (product.currentSupplierPrice==product.quotePrice) {
	product.savings=0;	
	}else{
	product.savings=$scope.getPriceInPercentage(product.currentSupplierPrice,product.quotePrice);	
	}
	};
	if (product.currentSupplierPrice>0) {
	product.currentSupplierGP=$scope.getPriceInPercentage(product.currentSupplierPrice,product.avgcost);	
	}else{
	product.currentSupplierGP=0;	
	product.currentSupplierPrice=0;	
	}
	product.total=product.itemQty*product.quotePrice;
	product.currentSupplierTotal=product.itemQty*product.currentSupplierPrice;
	product.gpRequired=$scope.getPriceInPercentage(product.quotePrice,product.avgcost);

	var newProduct;
	if ($scope.isNewProduct) {
			newProduct={
			'itemCode':product.itemCode,
			'itemDescription':product.itemDescription,
			'productGroupCode':product.productGroup.code,
			'unit':product.unit,
			'avgcost':product.avgcost,
			'itemQty':product.itemQty,
			'currentSupplierPrice':product.currentSupplierPrice,
			'currentSupplierTotal':product.currentSupplierTotal,
			'currentSupplierGP':product.currentSupplierGP,
			'quotePrice':product.quotePrice,
			'total':product.total,
			'gpRequired':product.gpRequired,
			'savings':product.savings,
			'isNewProduct':$scope.isNewProduct,
			'gstFlag':product.gstFlag,
			'isLinkedExact':product.isLinkedExact,
			'lineComment':product.lineComment,
			'isAlternative':'no'
			};	
			if (product.isLinkedExact) {	
			if(product.altProd!=null){
			// newProduct.isLinkedExact=product.isLinkedExact
			if (product.altProd.currentSupplierPrice>0 && product.altProd.quotePrice>0) {//product.altProd.currentSupplierPrice>product.altProd.quotePrice
			if (product.altProd.currentSupplierPrice==product.altProd.quotePrice) {
			product.altProd.savings=0;		
			}else{
			product.altProd.savings=$scope.getPriceInPercentage(product.altProd.currentSupplierPrice,product.altProd.quotePrice);	
			}
			};
			if (product.altProd.currentSupplierPrice>0) {
			product.altProd.currentSupplierGP=$scope.getPriceInPercentage(product.altProd.currentSupplierPrice,product.altProd.avgcost);	
			}else{
			product.altProd.currentSupplierGP=0;	
			product.altProd.currentSupplierPrice=0;		
			}	
			product.altProd.total=product.altProd.itemQty*product.altProd.quotePrice;
			product.altProd.currentSupplierTotal=product.altProd.itemQty*product.altProd.currentSupplierPrice;
			product.altProd.gpRequired=$scope.getPriceInPercentage(product.altProd.quotePrice,product.altProd.avgcost);
			}
			newProduct.altProd=product.altProd;
			}
	 		product=angular.copy(newProduct);
	 		$log.debug(JSON.stringify(product))
	}else{
		product.isNewProduct=$scope.isNewProduct;
	}

	if ($scope.productButtonStatus=='add') {
		if ( $scope.customerQuote.productList.length>0) {
 			$scope.customerQuote.productList.push(product);	
  			$scope.calculateAllInformation();
  			$scope.checkAlternativeAdded();
	 	}else{ 		
	 	$scope.customerQuote.productList.push(product);	
	 	$scope.calculateAllInformation();
	 	$scope.checkAlternativeAdded();
	    // $scope.closeAddProductModal();
	 	}
	};
 	if ($scope.productButtonStatus=='edit') {
 		$scope.customerQuote.productList[$scope.editIndex]=product;
 		$scope.calculateAllInformation();
 		$scope.checkAlternativeAdded();
 		// $scope.closeAddProductModal();
 	};
	// console.log(product)	
};

// $scope.saveAndAddAnotherProduct=function(){	
// 	var savedProduct=$scope.addProductToQuote();
// 	if (savedProduct) {
// 	 $scope.resetAddProductToQuote();
// 	 $('#targetItemCode').focus();
// 	 // $scope.addMore.addAnotherProduct=false;
// 	 return true;
// 	}
// 	};

// 	$scope.saveProductQuote=function(addAnotherProduct){
// 	console.log("addAnotherProduct........"+$scope.addMore.addAnotherProduct);
// 	var savedProducts;
// 	if (addAnotherProduct) {
// 		savedProducts=$scope.saveAndAddAnotherProduct();
// 		if (savedProducts) {
// 			// $scope.customerQuote.productList=angular.copy($scope.addedProductList);
// 		}
// 	}else if(!addAnotherProduct){
// 	    savedProducts=$scope.addProductToQuote();
// 		if (savedProducts) {
// 			// $scope.customerQuote.productList=angular.copy($scope.addedProductList);
// 			$scope.closeAddProductModal();
// 		}
// 	}
// };

$scope.deleteProductFromQuote=function(index){
	if ($scope.customerQuote.productList.length>0) {
	$scope.customerQuote.productList.splice(index,1);
	$scope.calculateAllInformation();
	$scope.checkAlternativeAdded();
	}else{
	}
};

// ===================== EDIT PRODUCT=====================
$scope.createArrayOfQuantityAndPrice=function(product){
var qty=[];
var price=[];
$scope.quantityArray=[];
$scope.priceArray=[];
if (product.price0exGST || product.price1exGST || product.price2exGST || product.price3exGST || product.price4exGST) {
price.push(product.price0exGST.toString());
price.push(product.price1exGST.toString());
price.push(product.price2exGST.toString());
price.push(product.price3exGST.toString());
price.push(product.price4exGST.toString());
angular.forEach(price, function(value, key){
	if (value==price[key+1]) {
	}else{
		$scope.priceArray.push(value);
	}
});
}
// console.log($scope.priceArray);
};

$scope.quotePriceFocused=function(){
	$('#quotePrice').change();
}
// ===============****************************=================================
$scope.showCommentModal=function(quote){
	$('#commentModal').modal({ keyboard: false,backdrop: 'static',show: true});
	$scope.customerQuote=quote;
	$scope.comment='';
};

$scope.addComment=function(){
// console.log($scope.comment);
// console.log($scope.customerQuote);
if ($scope.form.commentForm.$valid) {
	$rootScope.showSpinner();
	SQQuoteServices.AddComment($scope.customerQuote.quoteId,$scope.comment);
}else{
	$scope.form.commentForm.submitted=true;
}
};

/*=============GET PRODUCT GROUP LIST==================*/
/*============= Comment On Quote==================*/
$scope.closeCommentModal=function(quote){
	$('#commentModal').modal('hide');
	$scope.form.commentForm.submitted=false;
   	$scope.form.commentForm.$setPristine();
   	// $scope.init();	
   	$scope.initViewEditQuote();
};
$scope.handleAddCommentDoneResponse=function(data){
if(data){
if (data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
   	// console.log(data);
 	// var date= moment();
	// var day=date.format('DD');
	// var month=date.format('MMM');
	// var year=date.format('YYYY');
	// var time=moment().format('LT');
	// console.log(date)
	// console.log(day,month,year,time)
	// console.log(moment().month(month).format('MMM'))
   var comment=data.result;
   $scope.customerQuote.commentList.push(comment);
   $scope.comment='';

   $scope.form.commentForm.submitted=false;
   $scope.form.commentForm.$setPristine();
  }else{
   $rootScope.alertError(data.message);
  }
$rootScope.hideSpinner();
}
}
};

var cleanupEventAddCommentDone = $scope.$on("AddCommentDone", function(event, message){
// console.log("AddCommentDone");
$scope.handleAddCommentDoneResponse(message);      
});

var cleanupEventAddCommentNotDone = $scope.$on("AddCommentNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

//============================ Save As PDF =================================
$scope.saveAsPDF=function(quote){
console.log(quote);
// var doc = new jsPDF({
//   orientation: 'landscape',
//   unit: 'in',
//   format: [4, 2]
// })
// doc.addPage()
// doc.addPage()
// doc.text('I am on page 3', 10, 10)
// doc.setPage(1)
// doc.text('I am on page 1', 10, 10)
// doc.save('two-by-four.pdf')
 var url ="/smartquote/custComparison?quoteId="+quote.quoteId;
 window.open(url,'location=1,status=1,scrollbars=1,width=1050,fullscreen=yes,height=1400');
};
$scope.exportToPronto=function(quote){
	console.log(quote);
	 var url ="/smartquote/exportToPronto?quoteId="+quote.quoteId;
	 window.open(url,'location=1,status=1,scrollbars=1,width=1050,fullscreen=yes,height=1400');
	};

//==============================================Update Quote=======================================
$scope.createAlternativeArray=function(product){
var alternativeArray=[];
// obj.mainProductCode='';
// obj.alternativeProductList=[];
angular.forEach($scope.customerQuote.productList, function(value, key){
	if (value.altProd) {
		if (value.altProd.itemCode) {
			var obj={};
			var product={};
			product={altProductCode:value.altProd.itemCode, altProductDefaultPrice :0 }
			obj.mainProductCode=value.itemCode;
			obj.altProductObj=product;
			alternativeArray.push(obj);
		}
	}
});
return alternativeArray;
};
// $scope.jsonOfProductList=function(customerQuote){
// 	var productList=[];
// 	var product={};
// 	console.log("customerQuote");
// 	console.log(customerQuote);
// 	if (customerQuote.saveWithAlternative) {
// 		angular.forEach(customerQuote.productList, function(value, key){
// 			if (value.altProd) {
// 			if (value.altProd.itemCode) {	
// 			product={
// 			"avgcost":value.altProd.avgcost,
// 			"itemCode": value.altProd.itemCode,
// 			"currentSupplierGP": value.altProd.currentSupplierGP,
// 			"currentSupplierPrice": value.altProd.currentSupplierPrice,
// 			"currentSupplierTotal": value.altProd.currentSupplierTotal,
// 			"itemDescription": value.altProd.itemDescription,
// 			"description2": value.altProd.description2,
// 			"description3": value.altProd.description3,
// 			"gpRequired": value.altProd.gpRequired,
// 			"gstFlag": value.altProd.gstFlag,
// 			"itemQty": value.altProd.itemQty,
// 			"price0exGST": value.altProd.price0exGST,
// 			"price1exGST": value.altProd.price1exGST,
// 			"price2exGST": value.altProd.price2exGST,
// 			"price3exGST": value.altProd.price3exGST,
// 			"price4exGST": value.altProd.price4exGST,
// 			"quotePrice": value.altProd.quotePrice,
// 			"savings": value.altProd.savings,
// 			"total": value.altProd.total,
// 			"unit": value.altProd.unit,
// 			}
// 			productList.push(product);
// 			}
// 			}else{
// 			product={
// 			"avgcost": value.avgcost,
// 			"itemCode": value.itemCode,
// 			"itemDescription": value.itemDescriptione,
// 			"description2": value.description2,
// 			"description3": value.description3,
// 			"currentSupplierGP": value.currentSupplierGP,
// 			"currentSupplierPrice": value.currentSupplierPrice,
// 			"currentSupplierTotal": value.currentSupplierTotal,
// 			"gpRequired": value.gpRequired,
// 			"gstFlag": value.gstFlag,
// 			"isNewProduct": value.isNewProduct,
// 			"itemQty": value.itemQty,
// 			"price0exGST": value.price0exGST,
// 			"price1exGST": value.price1exGST,
// 			"price2exGST": value.price2exGST,
// 			"price3exGST": value.price3exGST,
// 			"price4exGST": value.price4exGST,
// 			"productGroupCode": value.productGroupCode,
// 			"productGroupName": value.productGroupName,
// 			"qtyBreak0": value.qtyBreak0,
// 			"qtyBreak1": value.qtyBreak1,
// 			"qtyBreak2": value.qtyBreak2,
// 			"qtyBreak3": value.qtyBreak3,
// 			"qtyBreak4": value.qtyBreak4,
// 			"quotePrice": value.quotePrice,
// 			"savings": value.savings,
// 			"total": value.total,
// 			"unit": value.unit,
// 			"isLinkedExact": value.isLinkedExact,
// 			}
// 			productList.push(product);	
// 			}
// 		});
// 	}else{
// 		angular.forEach(customerQuote.productList, function(value, key){
// 			product={
// 			"avgcost": value.avgcost,
// 			"itemCode": value.itemCode,
// 			"itemDescription": value.itemDescriptione,
// 			"description2": value.description2,
// 			"description3": value.description3,
// 			"currentSupplierGP": value.currentSupplierGP,
// 			"currentSupplierPrice": value.currentSupplierPrice,
// 			"currentSupplierTotal": value.currentSupplierTotal,
// 			"gpRequired": value.gpRequired,
// 			"gstFlag": value.gstFlag,
// 			"isNewProduct": value.isNewProduct,
// 			"itemQty": value.itemQty,
// 			"price0exGST": value.price0exGST,
// 			"price1exGST": value.price1exGST,
// 			"price2exGST": value.price2exGST,
// 			"price3exGST": value.price3exGST,
// 			"price4exGST": value.price4exGST,
// 			"productGroupCode": value.productGroupCode,
// 			"productGroupName": value.productGroupName,
// 			"qtyBreak0": value.qtyBreak0,
// 			"qtyBreak1": value.qtyBreak1,
// 			"qtyBreak2": value.qtyBreak2,
// 			"qtyBreak3": value.qtyBreak3,
// 			"qtyBreak4": value.qtyBreak4,
// 			"quotePrice": value.quotePrice,
// 			"savings": value.savings,
// 			"total": value.total,
// 			"unit": value.unit,
// 			"isLinkedExact": value.isLinkedExact,
// 			}
// 			productList.push(product);
// 		});
// 	}
// 	return productList;
// };
$scope.jsonToCreateQuote=function(){
var objQuoteBean={};
var supplierName='';
var supplierId=null;
var salesPerson='';
var salesPersonId=null;
if ($scope.customerQuote.currentSupplierName!=undefined) {
if($scope.customerQuote.currentSupplierName.key){
	supplierName=$scope.customerQuote.currentSupplierName.value;
	supplierId=$scope.customerQuote.currentSupplierName.key
}else if($scope.customerQuote.currentSupplierName==''||$scope.customerQuote.currentSupplierName==null){
	console.log("$scope.customerQuote.currentSupplierName "+$scope.customerQuote.currentSupplierName);
	supplierName=$scope.customerQuote.currentSupplierName;
	supplierId=-1;
}else{
	supplierName=$scope.customerQuote.currentSupplierName;
	supplierId=0;	
}
};
if ($scope.customerQuote.salesPerson!=undefined) {
if ($scope.customerQuote.salesPerson.key) {
	salesPerson=$scope.customerQuote.salesPerson.value;
	salesPersonId=$scope.customerQuote.salesPerson.key;
}else{
	salesPerson=$scope.customerQuote.salesPerson;
	salesPersonId=0;
}
};
var monthlyAvgPurchase=0;
var isNewCustomer='no';
if ($scope.isNewCustomer) {
monthlyAvgPurchase=$scope.customerQuote.monthlyAvgPurchase;
isNewCustomer='yes';
};

objQuoteBean={

'quoteId':$scope.customerQuote.quoteId,
'custCode':$scope.customerQuote.custCode,
'custName':$scope.customerQuote.custName,
'address':$scope.customerQuote.address,
'email':$scope.customerQuote.email,
'faxNo':$scope.customerQuote.faxNo,
'phone':$scope.customerQuote.phone,
'monthlyAvgPurchase':monthlyAvgPurchase.toString(),
'isNewCustomer':isNewCustomer,
'quoteAttn':$scope.customerQuote.quoteAttn,
'currentSupplierName':supplierName,
'currentSupplierId':supplierId,

'modifiedDate':moment($scope.customerQuote.modefiedDate).format('YYYY-MM-DD HH:mm:ss'),
'competeQuote':$scope.customerQuote.competeQuote,
'salesPerson':salesPerson,
'salesPersonId':salesPersonId,
'pricesGstInclude':$scope.customerQuote.pricesGstInclude,
'notes':$scope.customerQuote.notes,
'productList':$scope.customerQuote.productList,
// 'productList':$scope.jsonOfProductList($scope.customerQuote),
'serviceList':$scope.serviceList,
'termConditionList':$scope.termConditionList,
'userId':$rootScope.userData.userId,

}
if ($scope.customerQuote.saveWithAlternative) {
	console.log("saveWithAlternative")
	objQuoteBean.alternativeArray=$scope.createAlternativeArray();
	objQuoteBean.saveWithAlternative=$scope.customerQuote.saveWithAlternative;
}
// console.log(JSON.stringify(objQuoteBean))
// return JSON.stringify(objQuoteBean);
 return objQuoteBean;
}

$scope.updateQuote=function(){
$log.debug("updateQuote call");
// console.log();
if ($scope.form.addCustomerQuote.$valid) {
 // $scope.jsonToCreateQuote();
 $log.debug(JSON.stringify($scope.customerQuote));
	if ($scope.customerQuote.productList.length>0) {
		isSalesPersonExist=false;
		isSupplierExist=false;
		 // console.log($scope.customerQuote.currentSupplierName)
		// console.log($scope.customerQuote.currentSupplierName!=undefined)
		angular.forEach($scope.currentSupplierList, function(currentSupplierName, key){
			if ($scope.customerQuote.currentSupplierName!=undefined&&$scope.customerQuote.currentSupplierName!=''&&$scope.customerQuote.currentSupplierName!=null) {	
				// console.log(currentSupplierName)
				if ($scope.customerQuote.currentSupplierName.key) {
				}else{
				if ($scope.customerQuote.currentSupplierName.toUpperCase()==currentSupplierName.value.toUpperCase()){
					isSupplierExist=true;
					// console.log("isSupplierExist")
					}	
				}
			}
			
		});
		// angular.forEach($scope.salesPersonList, function(salesPerson, key){
		// 	if ($scope.customerQuote.salesPerson!=undefined) {	
		// 	if ($scope.customerQuote.salesPerson.key) {
		// 	}else{
		// 	if ($scope.customerQuote.salesPerson.toUpperCase()==salesPerson.value.toUpperCase()){
		// 		// console.log("isSalesPersonExist")
		// 		isSalesPersonExist=true;
		// 	}	
		// 	}
		// 	}
		// });
		// $log.debug("valid form");
		if (isSupplierExist) {
			if (isSupplierExist) {
				$scope.form.addCustomerQuote.currentSupplierName.$invalid=true;
				$scope.form.addCustomerQuote.submitted=true;
				$('#currentSupplierName').focus();
			}else{
				$scope.form.addCustomerQuote.currentSupplierName.$invalid=false;
			}
			// if (isSalesPersonExist) {
			// 	$('#salesPerson').focus();
			// 	$scope.form.addCustomerQuote.salesPerson.$invalid=true;
			// 	$scope.form.addCustomerQuote.submitted=true;
			// }else{
			// 	$scope.form.addCustomerQuote.salesPerson.$invalid=false;
			// }
		}else{
			console.log(JSON.stringify($scope.jsonToCreateQuote()));
			$rootScope.showSpinner();
			SQQuoteServices.UpdateQuote(JSON.stringify($scope.jsonToCreateQuote()));
		}
	}else{
		$log.debug("please add products");
		$scope.showAddProductError=true;
		$('#addProductLink').focus();
	}


}else{
	$log.debug("invalid form");
	$rootScope.moveToTop();
	$scope.form.addCustomerQuote.submitted=true;
}
};
$scope.handleUpdateQuoteDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	// console.log(data)
  	 // $rootScope.alertSuccess("Successfully updated quote");
  	 swal({
	  title: "Success",
	  text: "Successfully updated quote!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
  	 // $scope.cancelCreateQuote();
  	 $scope.resetUpdateQuote();
  	 $scope.initViewEditQuote();
  	 // $scope.init();	
	});
  }else{
  	$rootScope.alertError(data.message);
  }
 $rootScope.hideSpinner();
}}
};

var cleanupEventCreateQuoteDone = $scope.$on("QuoteSessionTimeOut", function(event, message){     
$scope.resetUpdateQuote();
$rootScope.$broadcast('SessionTimeOut', message); 		
$rootScope.alertSessionTimeOutOnQuote();
});

var cleanupEventUpdateQuoteDone = $scope.$on("UpdateQuoteDone", function(event, message){
$scope.handleUpdateQuoteDoneResponse(message);      
});

var cleanupEventUpdateQuoteNotDone = $scope.$on("UpdateQuoteNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

//=================================================================================================

hotkeys.bindTo($scope)
.add({
  combo: 'ctrl+shift+a',
  description: 'Show / hide add product pop-up',
  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  callback: function() {
  	console.log("hotkeys pressed");
  	console.log($scope.isAddProductModalShow)
  	if (!$scope.isAddProductModalShow) {
  	$scope.showAddProductModal('add')
  	}else{
  		$rootScope.closeModal();
  	}
  }
});

hotkeys.bindTo($scope)
.add({
  combo: 'ctrl+shift+z',
  description: 'Add Next Product',
  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  callback: function() {
    console.log("add product");
    console.log($scope.isAddProductModalShow);
  	if ($scope.isAddProductModalShow) {
  		$rootScope.addNextProduct();
  	}

  }
});    

hotkeys.bindTo($scope)
.add({
  combo: 'ctrl+shift+s',
  description: 'Save Quote / Save & Close Product',
  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  callback: function() {
  	 console.log("add product");
  	 console.log($scope.isAddProductModalShow);
  	if ($scope.isAddProductModalShow) {
  		$rootScope.saveAndClose();
  	}else{
  		$scope.updateQuote();
  	}
  }
});

hotkeys.bindTo($scope)
.add({
  combo: 'ctrl+shift+x',
  description: 'Cancel Quote ',
  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  callback: function() {
  	if ($scope.isAddProductModalShow) {
  	}else{
  	$scope.cancelCreateQuote();
  	}
  }
});



$scope.$on('$destroy', function(event, message) {
	cleanupEventAddCommentDone();
	cleanupEventAddCommentNotDone();
	// cleanupEventGetProductDetailsDone();
	// cleanupEventGetProductDetailsNotDone();
	// cleanupEventGetProductListDone();
	// cleanupEventGetProductListNotDone();
	cleanupEventUpdateQuoteDone();
	cleanupEventUpdateQuoteNotDone();
	cleanupEventGetQuoteViewDone();
	cleanupEventGetQuoteViewNotDone();
	cleanupEventGetCurrentSupplierListDone();
	cleanupEventGetCurrentSupplierListNotDone();
	cleanupEventGetSalesPersonListDone();
	cleanupEventGetSalesPersonListNotDone();
	cleanupEventGetProductGroupListDone();
	cleanupEventGetProductGroupListNotDone();
	$rootScope.isQuoteActivated=false;
});

});