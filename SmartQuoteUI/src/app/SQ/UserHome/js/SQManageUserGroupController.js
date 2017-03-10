angular.module('sq.SmartQuoteDesktop')
.controller('SQManageUserGroupController',['$scope','$rootScope','$log','$state','$timeout','$http','SQHomeServices','SQUserHomeServices',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,SQUserHomeServices){
console.log('initialise SQManageUserGroupController controller');
$scope.user={};
$scope.form={};
$scope.isOpen=false;
$scope.buttonstatus='add';

$scope.resetView=function(){
$scope.user={};
$scope.form.userManageUserGroup.userGroupName.$dirty=false;
$scope.form.userManageUserGroup.submitted=false;
$rootScope.showSpinner();
SQHomeServices.GetUserGroupInfo();
SQHomeServices.GetUserGroupMenu();
};


$scope.handlesetUserGroupResponse=function(data){
console.log(data);
var selectedsubmenukeepGoing = true;	
if (data) {
	if (data.code.toUpperCase()=="SUCCESS") {
		var selectedMenu=data.result;
		$rootScope.userMenu.forEach(function(menu,menuindex){
			//console.log(menu);
			for (var selectedMenuIndex = 0; selectedMenuIndex < selectedMenu.length; selectedMenuIndex++) {
			// selectedMenu.forEach(function(selectedmenu,selectedmenuindex){
			if(menu.menuId==selectedMenu[selectedMenuIndex].menuId){
				menu.status=true;
				menu.subMenuBeans.forEach(function(submenu,submenuindex){
					for (var i = 0; i < selectedMenu[selectedMenuIndex].subMenuBeans.length; i++) {
						if (submenu.subMenuId==selectedMenu[selectedMenuIndex].subMenuBeans[i].subMenuId) {
							// console.log(submenu.subMenuId,selectedmenu.subMenuBeans[i].subMenuId);
							//console.log("---------------");
							//console.log(selectedMenu);
							submenu.status=true;
							break;
						}
						else{
							// console.log(submenu.subMenuId,selectedmenu.subMenuBeans[i].subMenuId);
							// console.log("///////////");
							submenu.status=false;
							selectedMenu[selectedMenuIndex].subMenuBeans[i].status=false;
						}
					}
				});
				break;
			}else{menu.status=false;}
			}
		});

		$scope.isOpen=true;
		$scope.buttonstatus='edit';
		$rootScope.hideSpinner();

	}
}

};
var cleanupEventSetUserGroupDone = $scope.$on("SetUserGroupDone", function(event, message){
$scope.handlesetUserGroupResponse(message);      
});
var cleanupEventSetUserGroupNotDone = $scope.$on("SetUserGroupNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner(); 
});

$scope.getUserGroupId=function(userGroup){
var userGroupId;
$rootScope.userGroups.result.forEach(function(userGroupElement,index){
	  var user=userGroupElement;
	  var userGroupName=userGroup.userGroup;
	if (user.value==userGroupName) {
		userGroupId=user.key;
	}
});
return userGroupId;
};

$scope.setUserGroup=function(userGroup){
//console.log(userGroup);
var userGroupId=$scope.getUserGroupId(userGroup);
//console.log(userGroupId);
$rootScope.showSpinner();
SQUserHomeServices.setUserGroup(userGroupId);

};

$scope.menuChecked=function(index){
if ($rootScope.userMenu[index].status) {
	$rootScope.userMenu[index].subMenuBeans.forEach(function(element, index) {
           element.status=true;
    });
}else{
	$rootScope.userMenu[index].subMenuBeans.forEach(function(element, index) {
           element.status=false;
    });
}
};

$scope.subMenuChecked=function(menu,submenu){
 var menus=[];
 var submenus=[];
 menus = menu;
 submenus = menu.subMenuBeans;
 //console.log(submenus);
 submenus.forEach(function(submenuelement,index){
 	//console.log("...");
 	if (submenuelement.subMenuId==submenu.subMenuId) {
 		$rootScope.userMenu.forEach(function(menuelement, index) {
 			if (menu.menuId==menuelement.menuId) {
           	menuelement.status=true;	
 			}	
    	});
 	}
 });
};

$scope.jsonToCreateUserGroup=function(){
var selectedMenusAndSubmenus=[];
$scope.menuselected=0;
console.log(selectedMenusAndSubmenus.length)
$rootScope.userMenu.forEach(function(menuelement, menuindex) {
	if (menuelement.status){
	$scope.menuselected++;
	console.log("menuelement.status")
	var menu={};
	var submenu=[];
		$rootScope.userMenu[menuindex].subMenuBeans.forEach(function(submenuelement, submenuindex){
			if(submenuelement.status){
				var sub;
				sub={'subMenuId':submenuelement.subMenuId,'subMenuName':submenuelement.subMenuName};
				submenu.push(sub);
			}
		});
		menu={
			'menuId':menuelement.menuId,
			'menuName':menuelement.menuName,
			'subMenuBeans':submenu
		}
		selectedMenusAndSubmenus.push(menu);
	}

});
//console.log(JSON.stringify(selectedMenusAndSubmenus).length);
return angular.toJson(selectedMenusAndSubmenus);

};


$scope.saveUserGroupMenu=function(){
var userGroupName='';
var checkedMenuList=[];
userGroupName=$scope.user.userGroup;
checkedMenuList=$scope.jsonToCreateUserGroup();
if($scope.form.userManageUserGroup.$valid){
if($scope.menuselected>0&&userGroupName!==''&&userGroupName!==undefined){
	if ($scope.buttonstatus=='add') {
	//console.log("ADD");	
	$rootScope.showSpinner();
	SQUserHomeServices.saveUserGroup(userGroupName,checkedMenuList);	
	}else if($scope.buttonstatus=='edit'){
	//console.log("EDIT");
	$rootScope.showSpinner();
	var userGroup={'userGroup':userGroupName};
	var userGroupId=$scope.getUserGroupId(userGroup);
	SQUserHomeServices.editUserGroup(userGroupId,checkedMenuList);
	}
	}else{
		$rootScope.alertError("Please select atleast one menu");
	}
}else{
	$scope.form.userManageUserGroup.submitted=true;
}

};



$scope.handleAddUserGroupDoneResponse=function(data){
console.log(data)	;
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){  
	$rootScope.alertSuccess("Successfully added user group");
	$scope.resetView();
	 
}
}
$rootScope.hideSpinner();
};

var cleanupEventAddUserGroupDone = $scope.$on("AddUserGroupDone", function(event, message){
$scope.handleAddUserGroupDoneResponse(message);      
});

var cleanupEventAddUserGroupNotDone = $scope.$on("AddUserGroupNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

$scope.handleEditUserGroupDoneResponse=function(data){
console.log(data)	;
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){   
	$rootScope.alertSuccess("Successfully updated user group");
	$scope.resetView();
}
}
$rootScope.hideSpinner();
};

var cleanupEventEditUserGroupDone = $scope.$on("EditUserGroupDone", function(event, message){
$scope.handleEditUserGroupDoneResponse(message);      
});

var cleanupEventEditUserGroupNotDone = $scope.$on("EditUserGroupNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*====================================================================*/
$scope.deleteUserGroupMenu=function(){
	var userGroupName='';
	userGroupName=$scope.user.userGroup;
	var userGroup={'userGroup':userGroupName};
	var userGroupId=$scope.getUserGroupId(userGroup);
	//console.log(userGroupId);
	$rootScope.showSpinner();
	SQUserHomeServices.deleteUserGroup(userGroupId);

};
$scope.handleDeleteUserGroupDoneResponse=function(data){
console.log(data)	;
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){   
	$rootScope.alertSuccess("Successfully deleted user group");
	$scope.resetView();
	
}
}
$rootScope.hideSpinner();
};

var cleanupEventDeleteUserGroupDone = $scope.$on("DeleteUserGroupDone", function(event, message){
$scope.handleDeleteUserGroupDoneResponse(message);      
});

var cleanupEventDeleteUserGroupNotDone = $scope.$on("DeleteUserGroupNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});




$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8) {
        //console.log('here!');
        $scope.resetView();
        // $scope.isOpen=false;
		$scope.buttonstatus='add';
    }

};

$scope.$on('$destroy', function(event, message) {
	cleanupEventSetUserGroupDone();
	cleanupEventSetUserGroupNotDone();
	cleanupEventAddUserGroupDone();
	cleanupEventAddUserGroupNotDone();
	cleanupEventEditUserGroupDone();
	cleanupEventEditUserGroupNotDone();
	cleanupEventDeleteUserGroupDone();
	cleanupEventDeleteUserGroupNotDone();

});

}]);