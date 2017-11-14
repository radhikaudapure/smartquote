angular.module('sq.SmartQuoteDesktop')
.factory('SQUserHomeServices', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
    var UserHomeServices = {
        //createUserGroup:$resource('/smartquote/createUserGroup?userGroupName=:userGroupName&checkedMenuList=:checkedMenuList', {}, {createUserGroup :{method: 'POST'}}),
        // updateQuote1:$resource('/smartquote/updateQuote?objQuoteBean=:objQuoteBean', {}, {updateQuote1 :{method: 'POST'},params:{objQuoteBean:'@objQuoteBean'}}),
        // createQuote1:$resource('/smartquote/createQuote',{}, {createQuote1 :{method: 'POST'}}),
      
               getProductsFromJsonFile:$resource('/smartquote/products.json', {}, {getProductsFromJsonFileMethod:{method:'GET'}})
      };
    var userhome = {};
    var data;
    var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

    userhome.GetProductsFromJsonFile = function (){
    $http.get('/smartquote/products.json')
    .success(function(data) {
    console.log(data)
    $rootScope.$broadcast('GetProductsFromJsonFileDone', data);
    })
    .error(function (data, status, header, config) {
    console.log(data);
    $rootScope.$broadcast('GetProductsFromJsonFileNotDone', data);
    });
    };        

    // userhome.UpdateQuote1 = function (objQuoteBean){
    // console.log("UpdateQuote1")
    // data = $.param({objQuoteBean:objQuoteBean}); 
    //  $http.post('/smartquote/updateQuote', data, config)
    //         .success(function (data, status, headers, config) {
    //          console.log(data);
    //             if (data.code=="sessionTimeOut") {
    //             $rootScope.$broadcast('QuoteSessionTimeOut', data);     
    //             }else{
    //              $rootScope.$broadcast('UpdateQuoteDone', data); 
    //             }
    //         })
    //         .error(function (data, status, header, config) {
    //           console.log(data);
    //           $rootScope.$broadcast('UpdateQuoteNotDone', data);
    //         });
     
    // };

    // userhome.CreateQuote1 = function (objQuoteBean){
    // console.log("CreateQuote1")
    // data = $.param({objQuoteBean:objQuoteBean}); 
    // $http.post('/smartquote/createQuote', data, config)
    //         .success(function (data, status, headers, config) {
    //          console.log(data);
    //             if (data.code=="sessionTimeOut") {
    //             $rootScope.$broadcast('QuoteSessionTimeOut', data);     
    //             }else{
    //              $rootScope.$broadcast('CreateQuoteDone', data); 
    //             }
    //         })
    //         .error(function (data, status, header, config) {
    //           console.log(data);
    //           $rootScope.$broadcast('CreateQuoteNotDone', data);
    //         });


    // };

/*===============Manage User Group====================*/
    userhome.setUserGroup = function (userGroupId){
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

    userhome.saveUserGroup = function (userGroupName,checkedMenuList){
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

    userhome.editUserGroup = function (userGroupId,checkedMenuList){
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

     userhome.deleteUserGroup = function (userGroupId){
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
/*===================Manage USer Starts====================*/
    userhome.SaveUser = function (userDetails){
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

    userhome.GetUserList = function (){
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

     userhome.GetUserDetails = function (userId){
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

    userhome.UpdateUserDetails = function (userDetails){
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

     userhome.DeleteUser = function (userId){
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
    userhome.GetCustomerListView = function (userId){
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

    userhome.GetCustomerList = function (userId){
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

    userhome.GetCustomerDetails = function (customerCode){
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

    userhome.CreateCustomer = function (customerDetails){
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
    
    userhome.UpdateCustomer = function (customerDetails){
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
    userhome.DeleteCustomer = function (customerCode){
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
  userhome.GetProductGroupList = function (){
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
     userhome.GetProductGroupListView = function (){
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
    userhome.GetProductGroupDetails = function (productGroupCode){
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

    userhome.CreateProductGroup = function (productDetails){
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
    
    userhome.UpdateProductGroupDetails = function (productDetails){
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

    userhome.DeleteProductGroup = function (productGroupCode){
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
  userhome.GetProductListView = function (fromLimit,toLimit){
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

  userhome.GetProductList = function (prodLike){
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
    
   userhome.GetSearchedProductListView = function (prodLike){
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
 userhome.GetProductDetails = function (productCode){
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

    userhome.CreateProduct = function (productDetails){
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
    
     userhome.UpdateProductDetails = function (productDetails){
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

    userhome.DeleteProduct = function (productCode){
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



    return userhome;
  }
]);

