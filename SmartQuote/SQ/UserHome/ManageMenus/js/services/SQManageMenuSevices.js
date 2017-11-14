angular.module('sq.SmartQuoteDesktop')
.factory('SQManageMenuServices', [
'$rootScope',
'$resource',
'$http',
'$state',
'$log',
function ($rootScope, $resource, $http, $state, $log) {
var ManageServices = {
//Services API	
getServicesAPI:$resource('/smartquote/getServices', {}, {getServicesMethod :{method: 'POST'}}),
createServiceAPI:$resource('/smartquote/createService?service=:service', {}, {createServiceMethod :{method: 'GET'},params:{service:'@service'}}),
updateServiceAPI:$resource('/smartquote/updateService?service=:service&id=:id', {}, {updateServiceMethod :{method: 'GET'},params:{service:'@service',id:'@id'}}),
deleteServiceAPI:$resource('/smartquote/deleteService?id=:id', {}, {deleteServiceMethod :{method: 'GET'},params:{id:'@id'}}),

//Term Condition API	
getTermsListAPI:$resource('/smartquote/getTermsConditions', {}, {getTermsListMethod :{method: 'POST'}}),
createTermsConditionsAPI:$resource('/smartquote/createTermsConditions?termCondition=:termCondition', {}, {createTermsConditionsMethod :{method: 'GET'},params:{termCondition:'@termCondition'}}),
updateTermsConditionsAPI:$resource('/smartquote/updateTermsConditions?termCondition=:termCondition&id=:id', {}, {updateTermsConditionsMethod :{method: 'GET'},params:{termCondition:'@termCondition',id:'@id'}}),
deleteTermConditionAPI:$resource('/smartquote/deleteTermCondition?id=:id', {}, {deleteTermConditionMethod :{method: 'GET'},params:{id:'@id'}}),

//Alternative API	
getAlternateProductsView:$resource('/smartquote/getAlternateProductsView', {}, {getAlternateProductsViewMethod :{method: 'POST'}}),
deleteAlternateProduct:$resource('/smartquote/deleteAlternateProduct?mainProductId=:mainProductId&altProductId=:altProductId', {}, {deleteAlternateProductMethod :{method: 'GET'},params:{mainProductId:'@mainProductId',altProductId:'@altProductId'}}),
getOffersList:$resource('/smartquote/getOffersList', {}, {getOffersListMethod :{method: 'POST'}}),
deleteOffer:$resource('/smartquote/deleteOffer?id=:id', {}, {deleteOfferMethod :{method: 'GET'},params:{id:'@id'}}),
};
var manageMenu = {};
var data;
var config = {
headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
}

/*===============Manage User Group====================*/
manageMenu.setUserGroup = function (userGroupId){
$http({
method: "GET",
url: "/smartquote/getAssignedAccess?userGroupId="+userGroupId,
//data: $scope.additionalCategory.addCatName
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{          
$rootScope.$broadcast('SetUserGroupDone', data);    
}     
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('SetUserGroupNotDone', data);
//error
});
};

manageMenu.saveUserGroup = function (userGroupName,checkedMenuList){
$http({
method: "POST",
url: "/smartquote/createUserGroup?userGroupName="+userGroupName+"&checkedMenuList="+checkedMenuList,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('AddUserGroupDone', data); 
}   
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('AddUserGroupNotDone', data); 
});
};

manageMenu.editUserGroup = function (userGroupId,checkedMenuList){
$http({
method: "POST",
url: "/smartquote/updateUserGroup?userGroupId="+userGroupId+"&checkedMenuList="+checkedMenuList,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('EditUserGroupDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('EditUserGroupNotDone', data);
});
};

manageMenu.deleteUserGroup = function (userGroupId){
$http({
method: "POST",
url: "/smartquote/deleteUserGroup?userGroupId="+userGroupId,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteUserGroupDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteUserGroupNotDone', data);
});
};
/*===================Manage User Starts====================*/
manageMenu.SaveUser = function (userDetails){
console.log(userDetails)
$http({
method: "POST",
url: "/smartquote/createUser?userDetails="+userDetails,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('SaveUserDone', data); 
}
}).error(function(data, status, header, config){
console.log(data);
$rootScope.$broadcast('SaveUserNotDone', data);
});
}; 

manageMenu.GetUserList = function (){
$http({
method: "POST",
url: "/smartquote/getUserList",
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetUserListDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetUserListNotDone', data);
});
};

manageMenu.GetUserDetails = function (userId){
console.log(userId)
$http({
method: "POST",
url: "/smartquote/getUserDetails?userId="+userId,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetUserDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetUserDetailsNotDone', data);
});
};

manageMenu.UpdateUserDetails = function (userDetails){
$http({
method: "POST",
url: "/smartquote/updateUserDetails?userDetails="+userDetails,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateUserDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('UpdateUserDetailsNotDone', data);
});
};

manageMenu.DeleteUser = function (userId){
$http({
method: "POST",
url: "/smartquote/deleteUser?userId="+userId,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteUserDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteUserNotDone', data);
});
};
/*===============Manage Customer====================*/
manageMenu.GetCustomerListView = function (userId){
$http({
method: "POST",
url: "/smartquote/getCustomerListView",
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetCustomerListViewDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetCustomerListViewNotDone', data);
});
};

manageMenu.GetCustomerList = function (userId){
$http({
method: "POST",
url: "/smartquote/getCustomerList",
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetCustomerListDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetCustomerListNotDone', data);
});
};

manageMenu.GetCustomerDetails = function (customerCode){
$log.debug("GetCustomerDetails");
$log.debug(customerCode);
$http({
method: "POST",
url: "/smartquote/getCustomerDetails?customerCode="+customerCode,
}).success(function(data, status, header, config){
$log.debug(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetCustomerDetailsDone', data); 
}
}).error(function(data, status, header, config){
$log.debug(data);
$rootScope.$broadcast('GetCustomerDetailsNotDone', data);
});
};

manageMenu.CreateCustomer = function (customerDetails){
$http({
method: "POST",
url: "/smartquote/createCustomer?customerDetails="+customerDetails,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('CreateCustomerDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('CreateCustomerNotDone', data);
});
};

manageMenu.UpdateCustomer = function (customerDetails){
$http({
method: "POST",
url: "/smartquote/updateCustomerDetails?customerDetails="+customerDetails,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateCustomerDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('UpdateCustomerNotDone', data);
});
};
manageMenu.DeleteCustomer = function (customerCode){
$http({
method: "POST",
url: "/smartquote/deleteCustomer?customerCode="+customerCode,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteCustomerDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteCustomerNotDone', data);
});
};
/*=================MANAGE PRODUCT GROUP==================*/
manageMenu.GetProductGroupList = function (){
$http({
method: "POST",
url: "/smartquote/getProductGroupList",
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductGroupListDone', data);
} 
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductGroupListNotDone', data);
});
};
manageMenu.GetProductGroupListView = function (){
$http({
method: "POST",
url: "/smartquote/getProductGroupListView",
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductGroupListViewDone', data);
} 
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductGroupListViewNotDone', data);
});
};
manageMenu.GetProductGroupDetails = function (productGroupCode){
$http({
method: "POST",
url: "/smartquote/getProductGroupDetails?productGroupCode="+productGroupCode,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductGroupDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductGroupDetailsNotDone', data);
});
};

manageMenu.CreateProductGroup = function (productDetails){
$http({
method: "POST",
url: "/smartquote/createProductGroup?productDetails="+productDetails,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('CreateProductGroupDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('CreateProductGroupNotDone', data);
});
};

manageMenu.UpdateProductGroupDetails = function (productDetails){
$http({
method: "POST",
url: "/smartquote/updateProductGroupDetails?productDetails="+productDetails,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateProductGroupDetailsDone', data);
} 
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('UpdateProductGroupDetailsNotDone', data);
});
};

manageMenu.DeleteProductGroup = function (productGroupCode){
$http({
method: "POST",
url: "/smartquote/deleteProductGroup?productGroupCode="+productGroupCode,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteProductGroupDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteProductGroupNotDone', data);
});
};
/*========================MANAGE PRODUCT==============================*/
manageMenu.GetProductListView = function (fromLimit,toLimit){
console.log(fromLimit,toLimit)
$http({
method: "POST",
url: "/smartquote/getProductListView?fromLimit="+fromLimit+"&toLimit="+toLimit,
// data:{fromLimit:fromLimit,toLimit:toLimit}
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductListViewDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductListViewNotDone', data);
});
};

manageMenu.GetProductList = function (prodLike){
$http({
method: "POST",
url: "/smartquote/getProductList?prodLike="+prodLike,
}).success(function(data, status, header, config){
// console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductListDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductListNotDone', data);
});
};

manageMenu.GetSearchedProductListView = function (prodLike){
$http({
method: "POST",
url: "/smartquote/getSearchedProductListView?prodLike="+prodLike,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetSearchedProductListViewDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetSearchedProductListViewNotDone', data);
});
};
manageMenu.GetProductDetails = function (productCode){
$http({
method: "POST",
url: "/smartquote/getProductDetails?productCode="+productCode,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductDetailsNotDone', data);
});
};

manageMenu.CreateProduct = function (productDetails){
$http({
method: "POST",
url: "/smartquote/createProduct?productDetails="+encodeURIComponent(productDetails),
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('CreateProductDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('CreateProductNotDone', data);
});
};

manageMenu.UpdateProductDetails = function (productDetails){
$http({
method: "POST",
url: "/smartquote/updateProductDetails?productDetails="+encodeURIComponent(productDetails),
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateProductDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('UpdateProductDetailsNotDone', data);
});
};

manageMenu.DeleteProduct = function (productCode){
$http({
method: "POST",
url: "/smartquote/deleteProduct?productCode="+productCode,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteProductDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteProductNotDone', data);
});
};
// ==========================ManageServices ===========================
manageMenu.GetServices = function (){
ManageServices.getServicesAPI.getServicesMethod(function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('GetServicesDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('GetServicesNotDone', error);
});
};

manageMenu.CreateService = function (service){
// console.log(termCondition)
ManageServices.createServiceAPI.createServiceMethod({service:service},function (success) {
console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('CreateServiceDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('CreateServiceNotDone', error);
});
};

manageMenu.UpdateService = function (service,id){
ManageServices.updateServiceAPI.updateServiceMethod({service:service,id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('UpdateServiceDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('UpdateServiceNotDone', error);
});
};

manageMenu.DeleteService = function (id){
ManageServices.deleteServiceAPI.deleteServiceMethod({id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('DeleteServiceDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('DeleteServiceNotDone', error);
});  
}

// ==========================Terms & Conditions===========================
manageMenu.GetTermsConditions = function (){
ManageServices.getTermsListAPI.getTermsListMethod(function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('GetTermsConditionsDone', success); 
}
}, function (error) {
console.log(error);
$rootScope.$broadcast('GetTermsConditionsNotDone', error);
});
};

manageMenu.CreateTermsConditions = function (termCondition){
// console.log(termCondition)
ManageServices.createTermsConditionsAPI.createTermsConditionsMethod({termCondition:termCondition},function (success) {
console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('CreateTermsConditionsDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('CreateTermsConditionsNotDone', error);
});
};


manageMenu.UpdateTermsConditions = function (termCondition,id){
ManageServices.updateTermsConditionsAPI.updateTermsConditionsMethod({termCondition:termCondition,id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('UpdateTermsConditionsDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('UpdateTermsConditionsNotDone', error);
});
};

manageMenu.DeleteTermCondition = function (id){
ManageServices.deleteTermConditionAPI.deleteTermConditionMethod({id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('DeleteTermConditionDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('DeleteTermConditionNotDone', error);
});
};
//================ Manage Alternate Product=======================
manageMenu.CreateAlternateProducts = function (alternateProductDetails){
console.log("CreateAlternateProducts")
console.log(alternateProductDetails)
data = $.param({alternateProductDetails:alternateProductDetails}); 
$http.post('/smartquote/createAlternateProducts', data, config)
.success(function (data, status, headers, config) {
console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('CreateAlternativeProductDone', data); 
}
})
.error(function (data, status, header, config) {
console.log(data);
$rootScope.$broadcast('CreateAlternativeProductNotDone', data); 
});
}; 

manageMenu.UpdateAlternateProducts = function (alternateProductDetails){
console.log("CreateAlternateProducts")
console.log(alternateProductDetails)
data = $.param({alternateProductDetails:alternateProductDetails}); 
$http.post('/smartquote/updateAlternateProducts', data, config)
.success(function (data, status, headers, config) {
console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateAlternativeProductDone', data); 
}
})
.error(function (data, status, header, config) {
console.log(data);
$rootScope.$broadcast('UpdateAlternativeProductNotDone', data); 
});
};

manageMenu.GetAlternateProductsView = function (){
console.log("GetAlternateProductsView")
ManageServices.getAlternateProductsView.getAlternateProductsViewMethod(function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('GetAlternateProductsViewDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetAlternateProductsViewNotDone', error); 
});
};

manageMenu.DeleteAlternateProduct = function (mainId,altId){
ManageServices.deleteAlternateProduct.deleteAlternateProductMethod({mainProductId:mainId,altProductId:altId},function (success) {
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('DeleteAlternateProductDone', success); 
}
}, function (error) {
console.log(error);
$rootScope.$broadcast('DeleteAlternateProductNotDone', error);  
});
}


//================ Manage Alternate Product=======================
manageMenu.SaveDataWithFile = function (uploadUrl,formData){
console.log(formData.get("offerDetail"));
$http.post(uploadUrl, formData,{
withCredentials: true,
headers: {'Content-Type': undefined },
transformRequest: angular.identity
})
.success(function(data, status, header, config){
console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('SaveDataWithFileDone', data); 
}
})
.error(function(data, status, header, config){
$rootScope.$broadcast('SaveDataWithFileNotDone', error);  

});
};

manageMenu.GetOffersList = function (){
console.log("GetAlternateProductsView")
ManageServices.getOffersList.getOffersListMethod(function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('GetOffersListDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetOffersListNotDone', error); 
});
};

manageMenu.DeleteOffer = function (id){
console.log(id)
ManageServices.deleteOffer.deleteOfferMethod({id:id},function (success) {
console.log(success)
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('DeleteOfferDone', success); 
}
}, function (error) {
console.log(error);
$rootScope.$broadcast('DeleteOfferNotDone', error);  
});
}  
//================= Manage Customer=========================

return manageMenu;
}])

.factory('ArrayOperationFactory', function(){
// var objectInfo={'subtotal':0,'gstTotal':0,'total':0};
return {
sayHello: function(text){
return "Factory says \"Hello " + text + "\"";
},
insertIntoArrayKeyValue: function(array,obj){
array.push(obj);
return "success insertIntoArrayKeyValue";
},
deleteFromArrayKeyValue: function(array,obj1){
var objIndex = array.findIndex((obj => obj.id == obj1.id));
array.splice(objIndex,1);
// angular.forEach(array, function(element, index){
// if(element.key==obj.key&&element.value.toUpperCase()==obj.value.toUpperCase()){
// console.log(element)
// array.splice(index,1);
// }
// });
return "success deleteFromArrayKeyValue";
},
updateArrayKeyValue: function(array,obj1){
objIndex = array.findIndex((obj => obj.id == obj1.id));
array[objIndex] = obj1;
// angular.forEach(array, function(element, index){
// if(element.key==obj.key){
// array[index]=obj;
// } 
// });
return "success update";
},
}
})
