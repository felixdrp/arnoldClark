// Unit test

describe('myApp', function() {
  beforeEach(module('myApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('Check controller', function() {
    it('Obfuscate references', function() {
      var $scope = {};
      var controller = $controller('userInterface', { $scope: $scope });
      // If empty references return false
      expect($scope.obfuscatedID('arnyam-u-232603', '') || $scope.obfuscatedID('', 'ND13FXZ')).toEqual(false);
      // If too long references return false
      expect($scope.obfuscatedID('arnyam-u-232603', '1234568901234567890123456') || $scope.obfuscatedID('1234568901234567890123456', 'ND13FXZ')).toEqual(false);
      // Valid test
      expect($scope.obfuscatedID('arnyam-u-232603', 'ND13FXZ')).toEqual('AZRXNFY3A1MD-N-');
    });
  });
});
