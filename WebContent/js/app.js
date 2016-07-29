
if (typeof $ === 'undefined') { throw new Error('This Accelalication\'s JavaScript requires jQuery'); }

var Accela = angular.module('Accela',['ngRoute','ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'ngFileUpload',
    'Accela.services',
	'angularSpinner'
  ]);

  Accela.run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache', function ($rootScope, $state, $stateParams, $window, $templateCache) {
      // Set reference to access them from any scope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;
	  $rootScope.showUploadInfo = true;
	  $rootScope.showReviewInfo = false;
	  $rootScope.licenseKey = "";
	  $rootScope.licenseMsgs = {"label":
			  [{name:"ACA",value:""},{name:"AGIS",value:"Accela GIS"},{name:"AIVR",value:"Accela IVR"},
			   {name:"AMO",value:"AMO"},{name:"AW",value:"Accela Wireless"},{name:"AssetMgt",value:"Asset Management"},
			   {name:"GovXML",value:"GovXML"},{name:"LandMgt",value:"Land Management"},{name:"LicenseCaseMgt",value:"License and Case Management"},
			   {name:"PublicHealth",value:"Public Health and Safety"},{name:"RealEstateAcq",value:"Real Estate Acquisition(SFWMD)"},{name:"SR",value:"Service Request"},
			   {name:"SuperAgency",value:"Super Agency"},{name:"addonName",value:"Add-on Name"},{name:"expirationDate",value:"Expiration Date"},
			   {name:"licensesAvailable",value:"Licenses Available"},{name:"licensesInUse",value:"Licenses in Use"},{name:"licensingInfo",value:"Product Licensing information"},
			   {name:"namedUsers",value:"Named Users(Total Available Licenses)"},{name:"productLicense",value:"Product License"},{name:"solutionName",value:"Solution Name"},
			   {name:"status",value:"Status"},{name:"unlimited",value:"Unlimited"},
			   {name:"noLicense",value:"The product license for {0} is missing. <br>To purchase a license, contact the Accela Customer Resource Center by e-mail at support@accela.com or by phone at (888) 722-2352 extension 5."}]
	  };
	  $rootScope.msgs=new Array();
      // Uncomment this to disable template cache
      /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
            $templateCache.remove(toState.templateUrl);
          }
      });*/

      // Scope Globals
      // -----------------------------------
      $rootScope.Accela = {
        name: 'Accela',
        description: 'Accela Agency Wizard',
        year: ((new Date()).getFullYear()),
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: null
        },
        useFullLayout: false,
        hiddenFooter: false,
        viewAnimation: 'ng-fadeInUp'
      };
  }]);

  /**
  ===================Route===============
*/
Accela.config(function($routeProvider,$locationProvider){
  $routeProvider.when('/login',{
    templateUrl:'agencyWizard/login.html',
    controller:'WizardController'
  })
  .when('/licenseUpload',{
    templateUrl:'agencyWizard/licenseUpload.html',
    controller:'WizardController'
  })
  .when('/reviewLicense',{
    templateUrl:'agencyWizard/licenseView.html',
    controller:'WizardController'
  })
  .when('/addAgency',{
    templateUrl:'agencyWizard/agencyAdd.html',
    controller:'WizardController'
  })
  .when('/agencuSuccess',{
    templateUrl:'agencyWizard/agencySuccess.html',
    controller:'WizardController'
  })
  .when('/selectModule',{
	templateUrl:'agencyWizard/viewModuleSolution.html',
	controller:'WizardController'
  })
  .when('/prepareBPT',{
	  templateUrl:'agencyWizard/chooseLoadBPT.html',
	  controller:'WizardController'
  })
  .when('/importBPT',{
	  templateUrl:'agencyWizard/acaConfigurationImport.html',
	  controller:'WizardController'
  })
  .otherwise({
    redirectTo: '/login'
  });
});

/**
=============Controller===============
*/
Accela.controller('WizardController',['$rootScope','$scope','$location','Upload','WizardService','usSpinnerService',function($rootScope,$scope,$location,Upload,WizardService,usSpinnerService){
  
  $scope.isDisabled = false;
  if(!$rootScope.agencyCode)
  {
	  initUser();
  }
  
  function initUser(){
	  WizardService.getUser(null,function(result){
      if(!result.status){
		  if(result.map.user[0] != undefined && result.map.user[0] != null && result.map.user[0] != ""){
			  $rootScope.agencyCode = result.map.user[0];
		  }
		  if(result.map.user[1] != undefined && result.map.user[1] != null && result.map.user[1] != ""){
			  $rootScope.userId = result.map.user[1];
		  }
		  if(result.map.user[2] != undefined && result.map.user[2] != null && result.map.user[2] != ""){
			  $rootScope.password = result.map.user[2];
		  }
	  }
    });
  }
  
  $scope.validateUser = function(){
	  $scope.msgs.length=0;
	  var valAgency = agencyCode.value.replace(/(^\s*)|(\s*$)/g,'');
	  var valUserId = userId.value.replace(/(^\s*)|(\s*$)/g,'');
	if(valAgency == "" || valAgency.toUpperCase() != "ADMIN" || valUserId == "" || valUserId.toUpperCase() != "ADMIN"){
		$scope.msgs.push('Please use ADMIN account to login.');
	}
	if(password.value.replace(/(^\s*)|(\s*$)/g,'') == ""){
		$scope.msgs.push('Password is required.');
	}
	if($scope.msgs.length > 0){
		return;
	}
    WizardService.authenticate($.param({agencyCode:agencyCode.value,userId:userId.value,password:password.value}),function(result){
      if(result.status){
      $rootScope.user=result.obj.userId;
	  $rootScope.showUploadInfo = true;
	  $rootScope.showReviewInfo = false;
	  $rootScope.msgs.lenth = 0;
	  $rootScope.uid = result.obj.sessionId;
      $location.path("/licenseUpload");
      }else{
		 $scope.msgs.push(result.errorMsgs);
	  }
    });
  };

  $scope.viewLicense = function(file){
	if(!$rootScope.user){
		$location.path("/login");
		return;
	}
	$scope.msgs.length=0;
    file.upload = Upload.upload({
      url: 'rest/license/viewLicense',
      data: {file: file},
    });

    file.upload.then(function (response) {
	 if(response.status=200 && response.statusText == 'OK' && response.data.status){
		  file.result = response.status;
		  $rootScope.showUploadInfo = false;
		  $rootScope.showReviewInfo = true;
		  $rootScope.usedLicense = response.data.map.usedLicenses;
		  $rootScope.productlicense = response.data.map.PRODUCT_LICENSE;
		  $rootScope.solutions = response.data.map.SOLUTIONS;
		  $rootScope.licenseKey = response.data.obj.licenseInfo;
		  $rootScope.msgs.lenth = 0;
		  $rootScope.activeSolutionNames=response.data.map.ACTIVE_SOLUTIONS_NAME;
	 }else if(response.status=200 && response.statusText == 'OK' && !response.data.status){
		 $scope.msgs.push(response.data.errorMsgs);
	 }
    });
  };
  
  //add by Alex
  $scope.selectModule = function(){
	  if(!$rootScope.user){
		  $location.path("/login");
		  return;
	  }
	  WizardService.getModuleBySolution($.param({servProvCode:$rootScope.agencyCode.toUpperCase(),solutions:$rootScope.activeSolutionNames}),function(response){
		  if(response.status){
			  $rootScope.moduleNameSolutionMap = response.map.moduleNameSolutionMap;
			  $location.path("/selectModule");
			  
		  }else{
			  $scope.msgs.push(response.data.errorMsgs);
			  return;
		  }
	  });
  };
  
  $scope.uploadNewOne = function(){
	  if($rootScope.user){
		  $location.path("/licenseUpload");
		  $rootScope.showUploadInfo = true;
		  $rootScope.showReviewInfo = false;
	  }else{
		  $location.path("/login");
		  return;
	  }
  }

  $scope.addAgency = function()
  {
	  if(!$rootScope.user){
		  $location.path("/login");
		  return;
	  }
	  if(!$rootScope.agencyTimeZone){
		  WizardService.getTimeZone(null,function(result){
	      if(result.status){
	    	  $rootScope.agencyTimeZone = result.map.timeZone;
			  $scope.langFlag='N';
	      }
	    });
	  }
	  $rootScope.nServProvCode=$rootScope.productlicense.agency;
	  var modules = filterModules();
	  if(modules.length == 0)
	  {
		  $scope.msgs.push("Please choose one module at least.");
		  return;
	  }
	  $rootScope.selectedModules = modules;
	  $location.path("/addAgency");
  };
  
  function filterModules()
  {
	  var selectedModules = new Array();
	  var allInputs = $(":input");
	  if(allInputs)
	  {
		  for(i in allInputs)
		  {
			  if(allInputs[i].checked == true)
			  {
				  selectedModules.push(allInputs[i].name);
			  }
		  }
	  }
	  return selectedModules.toString();
  }

  $scope.saveAgency = function(){
	  if(!$rootScope.user){
		  $location.path("/login");
		  return;
	  }
	  $scope.msgs.length=0;
	  //No license upload, need login. Force back to login page.
	  if(!$rootScope.productlicense.agency){
		  $scope.msgs.push('Please login.');
		  $location.path('/login');
		  return;
	  }
	  var langArr = multipleLanguage;
	  var lang1 = langArr[0].checked;
	  var lang2 = langArr[1].checked;
	  $scope.multipleLanguage = 'N';
	  if(lang1){
		  $scope.multipleLanguage = langArr[0].value;
	  }else if(lang2){
		  $scope.multipleLanguage = langArr[1].value;
	  }else{
		  $scope.msgs.push('Please choose one language.');
	  }
	  var childAgencyArr = cildAgency;
	  var child1 = childAgencyArr[0].checked;
	  var child2 = childAgencyArr[1].checked;
	  $scope.childAgency = 'N';
	  if(child1){
		  $scope.childAgency = childAgencyArr[0].value;
	  }else{
		  $scope.childAgency = childAgencyArr[1].value;
	  }
	  //compare input agency with licensed agency.
	  if($rootScope.nServProvCode.replace(/(^\s*)|(\s*$)/g,'') == ""){
		  $scope.msgs.push('Agency name is required.');
	  }else if($rootScope.productlicense.agency!=$rootScope.nServProvCode.replace(/(^\s*)|(\s*$)/g,'').toUpperCase()){
		  $scope.msgs.push('The agency can not match with the License.');
	  }
	  if(jurisdiction.value.replace(/(^\s*)|(\s*$)/g,'') == ""){
		  $scope.msgs.push('Jurisdiction is required.');
	  }
	  if(agencyName.value.replace(/(^\s*)|(\s*$)/g,'') == ""){
		  $scope.msgs.push('Agency is required.');
	  }
	  if(timeZone.value.replace(/(^\s*)|(\s*$)/g,'') == ""){
		  $scope.msgs.push('Time Zone is required.');
	  }
	  if(address1.value.replace(/(^\s*)|(\s*$)/g,'') == ""){
		  $scope.msgs.push('Address Line 1 is required.');
	  }
	  if(mainContact.value.replace(/(^\s*)|(\s*$)/g,'') == ""){
		  $scope.msgs.push('Main Contact is required.');
	  }
	  if($scope.msgs.length > 0){
		  usSpinnerService.stop('spinner-1');
		  return;
	  }
	  $scope.isDisabled = true;
	  usSpinnerService.spin('spinner-1');
	  WizardService.saveAgency($.param({servProvCode:$rootScope.nServProvCode.toUpperCase(),agencyName:agencyName.value,
		  multiLangFlag:$scope.multipleLanguage,licenseKey:$rootScope.licenseKey,city:city.value,address1:address1.value,
		  childAgency:$scope.childAgency,jurisdiction:jurisdiction.value,mainContact:mainContact.value,state:state.value,
		  zip:zip.value,timeZone:timeZone.value,activeSolutionsName:$rootScope.activeSolutionNames,uid:$rootScope.uid,
		  selectedModules:$rootScope.selectedModules}),function(result){
		  if(result.status){
			  $scope.successAgency=$rootScope.nServProvCode.toUpperCase();
			  $scope.productlicense=null;
			  $location.path('/agencuSuccess');
		  }else{
			 $scope.isDisabled = false;
			 usSpinnerService.stop('spinner-1');
			 $scope.msgs.push(result.errorMsgs);
		  }
	  });
  };
  
  $scope.forwardBPTNotice = function()
  {
	  if(!$rootScope.user){
		  $location.path("/login");
		  return;
	  }
	  $location.path('/prepareBPT');
  };
  $scope.forwardBPTImport = function()
  {
	  if(!$rootScope.user){
		  $location.path("/login");
		  return;
	  }
	  $location.path('/importBPT');
  };
}]);

//License import controller
Accela.controller('licenseImportController',['$rootScope','$scope','LicenseImportService',function($rootScope,$scope,$location,LicenseImportService){
  $scope.viewLicense = function(){
    LicenseImportService.viewLicense($.param({file:$scope.file}),function(result){
      if(result.status){
        $location.path("/viewLicense");
      }else{
        //show error message
      }
    });
  };
}]);

//Agency add controller
Accela.controller('AgencyCreateController',['$rootScope','$scope','LicenseService','AgencyGenerationService',function($scope,$ngResource,LicenseService,AgencyGenerationService){
  $scope.checkAgency = function(){
    AgencyGenerationService.checkAgency($.param({servProvCode:$scope.servProvCode}),function(result){
      if(result.status){
        //next step
      }else{
        //show error message
      }
    });
  };

  $scope.checkRequired = function(){
    AgencyGenerationService.checkRequired($.param({servProvCode:$scope.nServProvCode,agencyName:$scope.agencyName,jurisdiction:scope.jurisdiction,multiLangFlag:scope.multiLangFlag,
      city:$scope.city,address1:$scope.address1,contactLine1:$scope.contactLine1,state:$scope.state,zip:$scope.zip,timeZone:$scope.timeZone}),function(result){
        if(result.status){
          //next step
        }else{
          //block, show error message
        }
      });
    };

    $scope.createAgency = function(){
      AgencyGenerationService.createAgency($.param({servProvCode:servProvCode.value,agencyName:$scope.agencyName,jurisdiction:scope.jurisdiction,multiLangFlag:scope.multiLangFlag,
        city:$scope.city,address1:$scope.address1,contactLine1:$scope.contactLine1,state:$scope.state,zip:$scope.zip,timeZone:$scope.timeZone}),function(result){
          if(result.status){
            //next step
          }else{
            //block, show message
          }
        });
    }
}]);

var services = angular.module('Accela.services', ['ngResource']);

services.factory('WizardService', function($resource) {
	return $resource('/agencyWizard/rest/:context/:action', {},
			{
				authenticate: {
					method: 'POST',
					params: {'action' : 'authenticate','context':'user'},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				},
				viewLicense: {
					method: 'POST',
					params: {'action' : 'viewLicense','context':'license'},
					headers : {'Content-Type': 'multipart/form-data'}
				},
				saveAgency:{
					method: 'POST',
					params: {'action':'create','context':'agency'},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				},
				getTimeZone:{
					method: 'GET',
					params: {'action':'getTimeZone','context':'agency'},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				},
				getUser:{
					method: 'GET',
					params: {'action':'getUser','context':'user'},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				},
				getModuleBySolution:{
					method: 'POST',
					params: {'action':'getModuleBySolution','context':'license'},
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}
			}
		);
});
