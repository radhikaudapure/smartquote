var app= angular.module('sq.SmartQuoteDesktop',['ui.router','ui.bootstrap','ngResource','angularLocalStorage','uiSwitch'])
.config(function($logProvider){
    $logProvider.debugEnabled(true);
    
  })
.run(['$rootScope','$window','storage',function($rootScope,$window,storage){
   if(storage.get('userSession')==null || storage.get('userSession')==''){
      $rootScope.userSession=false;
   }
   if(storage.get('userNavMenu')==null || storage.get('userNavMenu')==''){
      $rootScope.userNavMenu=[];
   }
    storage.bind($rootScope, 'userSession',false);
    storage.bind($rootScope, 'userNavMenu',[]);
}])
.controller('SmartQuoteDesktopController',['$scope','$rootScope','$window','$state','$filter','$timeout','$http','notify','SQHomeServices',function($scope,$rootScope,$window,$state,$filter,$timeout,$http,notify,SQHomeServices){
 console.log("SmartQuoteDesktopController initialise");
$window.pageYOffset;
$scope.user={};
$scope.form={};
$scope.invalidEmailPassword=false;
$scope.errormsg='';
$rootScope.isAdmin=false;
 // $rootScope.showSpinner();
 if ($rootScope.userSession) {
 $state.transitionTo('userhome.start');
 }else{
 $state.transitionTo('home.start');
 }

/*===================================================*/
 $rootScope.userSignin=function(){
  if ($scope.form.loginUser.$valid){
    if($scope.user.userName=="admin@gmail.com"&&$scope.user.userPassword=="admin"){
      $rootScope.isAdmin=true;
      $rootScope.userSession=true;
      $state.transitionTo('userhome.start');
    }else{
    SQHomeServices.userLogIn($scope.user.userName,$scope.user.userPassword); 
    } 
  }else{
    $scope.form.loginUser.submitted=true;
  }
   
  };

  $scope.handleUserLogInDoneResponse=function(data){
    if(data){
      //console.log(data);  
      if(data.code.toUpperCase()=='SUCCESS'){ 
       $rootScope.userSession=true;
       //console.log("lllllllllllllllll");
       $state.transitionTo('userhome.start');
       $scope.user={};
       $scope.form.loginUser.submitted=false;
       $scope.form.loginUser.$setPristine();
       $rootScope.userNavMenu=data.result;
      }
      else if (data.code.toUpperCase()=='ERROR'){
        //$rootScope.alertError(data.message);
        $scope.invalidEmailPassword=true;
        $scope.errormsg=data.message;
      }
  }
  //$rootScope.hideSpinner();
  };

  var cleanupEventUserLogInDone = $scope.$on("UserLogInDone", function(event, message){
    console.log("UserLogInDone");
    console.log(message);
    $scope.handleUserLogInDoneResponse(message);      
  });

  var cleanupEventUserLogInNotDone = $scope.$on("UserLogInNotDone", function(event, message){
    console.log('Some server problem');
    $rootScope.hideSpinner();
  });

  $rootScope.userSignout=function(){
    console.log("signout")
    $rootScope.userSession=false;
    $rootScope.userNavMenu=[];
    $rootScope.isAdmin=false;
    $state.transitionTo('home.start');  
  };
/*===================================================*/
/*============== FORGET PASSWORD===========*/
$scope.isForgotPasswordOn=false;
$scope.forgotPasswordClicked=function(){
$scope.isForgotPasswordOn=true;
};

$scope.cancelForgetPassword=function(){
  $scope.isForgotPasswordOn=false;
};

$scope.submitForgetPassword=function(){
 if ($scope.form.forgotPassword.$valid){
  console.log($scope.user.userName)
  SQHomeServices.userForgotPassword($scope.user.userName);
 }

};
  $scope.handleUserForgotPasswordDoneResponse=function(data){
    if(data){
      if(data.code.toUpperCase()=='SUCCESS'){ 
       $rootScope.alertSuccess("Successfully reset password, please check your inbox for new password");
       $scope.user={};
       $scope.form.forgotPassword.submitted=false;
       $scope.form.forgotPassword.$setPristine();
       $scope.isForgotPasswordOn=false;
      }
      else if (data.code.toUpperCase()=='ERROR'){
       $rootScope.alertError(data.message);
      }
  }
  //$rootScope.hideSpinner();
  };

  var cleanupEventUserForgotPasswordDone = $scope.$on("UserForgotPasswordDone", function(event, message){
    console.log("UserForgotPasswordDone");
    console.log(message);
    $scope.handleUserForgotPasswordDoneResponse(message);      
  });

  var cleanupEventUserForgotPasswordNotDone = $scope.$on("UserForgotPasswordNotDone", function(event, message){
    console.log('Some server problem');
    $rootScope.hideSpinner();
  });

/*============== FORGET PASSWORD===========*/
  $scope.handleGetUserGroupInfoDoneResponse=function(data){
    if(data){
      if(data.code.toUpperCase()=='SUCCESS'){   
        $rootScope.userGroups=data.result;
    }
    }
    console.log("======================");
    $rootScope.hideSpinner();
  };

  var cleanupEventGetUserGroupInfoDone = $scope.$on("GetUserGroupInfoDone", function(event, message){
    console.log("GetUserGroupInfoDone");
    $scope.handleGetUserGroupInfoDoneResponse(message);      
  });

  var cleanupEventGetUserGroupInfoNotDone = $scope.$on("GetUserGroupInfoNotDone", function(event, message){
    console.log('Some server problem');
     $rootScope.hideSpinner();
  });

  $scope.handleGetUserGroupMenuDoneResponse=function(data){
  if(data){
    if(data.code.toUpperCase()=='SUCCESS'){   
      var result=data.result;
      result.forEach(function(element,index){
        if(element.menuName=='Profile'){
          element.status=true;
         // console.log(element)
          element.subMenuBeans.forEach(function(submenu,index){
            submenu.status=true;
          });
        }
      });
      $rootScope.userMenu=result;
      if ($rootScope.isAdmin) {
        $rootScope.userNavMenu=$rootScope.userMenu;
      }
    //$rootScope.userNavMenu=$rootScope.userMenu;
    }
   }
    $rootScope.hideSpinner();
  };

  var cleanupEventGetUserGroupMenuDone = $scope.$on("GetUserGroupMenuDone", function(event, message){
    console.log("GetUserGroupMenuDone");
    $scope.handleGetUserGroupMenuDoneResponse(message);      
  });

  var cleanupEventGetUserGroupMenuNotDone = $scope.$on("GetUserGroupMenuNotDone", function(event, message){
    //console.log('Some server problem');
    $rootScope.hideSpinner();
  });



	
 
 $rootScope.SQNotify = function(message,flag)
    {
      if(flag === 'success')
      {
        notify({message:message,template:'assets/notification/views/oz.success.tpl.html',position:'center'});
      }
      else if (flag === 'error') 
      {
         notify({message:message,template:'assets/notification/views/oz.failure.tpl.html',position:'center'});
      } 
       else if (flag === 'central') 
      {
         notify({message:message,template:'assets/notification/views/oz.central.tpl.html',position:'center'});
      } 
    };

$rootScope.alertSuccess=function(message){
swal("Success",message, "success");
};
$rootScope.alertError=function(message){
sweetAlert("Error",message, "error");
};
$rootScope.alertServerError=function(message){
sweetAlert("Oops...",message, "error");
};

$scope.$on('$destroy', function(event, message) {
  cleanupEventUserLogInDone();
  cleanupEventUserLogInNotDone();
});

}])
