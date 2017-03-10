angular.module('sq.SmartQuoteDesktop')
.directive('sqSpinner', [
'$timeout',
function ($timeout) {
  return {
    restrict: 'EA',
    replace: true,
    template: '<div style="position:fixed;z-index:100;left:0;right:0;width:100%;height:100%;margin:auto;background:#ffffff;opacity:.4;" ng-show="spinner.isShown">' + '<center>' + '<i style="margin:250px auto;" class="fa fa-spinner fa-spin fa-3x">' + '</i>' + '</center>' + '</div>',
    controller: [
      '$scope',
      '$rootScope',
      function ($scope, $rootScope) {
        $scope.spinner = { isShown: false };
        $rootScope.showSpinner = function () {
          $scope.spinner.isShown = true;
        };
        $rootScope.hideSpinner = function () {
          $scope.spinner.isShown = false;
        };
      }
    ]
  };
}
])
.directive('loadSpinnerLoad', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'EA',
        replace: true,
        template: '<div class="col-md-3" style="position:absolute;z-index:100;left:0;right:0;margin:auto;width:100%;height:100%;" ng-show="spinner.isShown">' + '<center style="margin-top:200px;">' + '<i style="color:#545454;" class="fa fa-circle-o-notch fa-lg fa-spin" aria-hidden="true">' + '</center>' + '</div>',
        controller: [
          '$scope',
          '$rootScope',
          function ($scope, $rootScope) {
            $scope.spinner = { isShown: false };
            $rootScope.showLoadSpinner = function () {
              $scope.spinner.isShown = true;
            };
            $rootScope.hideLoadSpinner = function () {
              $scope.spinner.isShown = false;
            };
          }
        ]
      };
    }])
.directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }]);
