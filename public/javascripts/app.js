"use strict";

// Main module of the application
angular.module('myApp', []);

angular.module('myApp')
    .controller('userInterface', [
	'$scope',
	'$document',
	'$interval',
	function($scope, $document, $interval) {
	    // What cache server to ues?
	    var urlArnoldClark = "http://imagecache.arnoldclark.com/imageserver/";

	    $scope.notificationArea = "Show Room";
	    // Controls when show images
	    $scope.imageAvailable = false;
	    // Main Photo to display
	    $scope.showRoomImage = '';
	    $scope.fullScreen = false;	    
	    // To know the index in the array of the actual show room image.
	    var showRoomImageIndex = 0;
	    // The array of images.
    	    $scope.photos = [];

	    // Photo types
	    var imageResolution = {"preview":"350", "showRoom": "800"};
	    var imageCamera = ['f', 'i', 'r', '4', '5', '6'];
	    // Buffer of images.
	    var imagesLowResolution = [];
	    var imagesHighResolution = [];
	    var countLoadErrors = 0;

	    // Init the low resolution images array buffer
	    // Only call for High resolution images if exist the Low resolution first.
	    for (var i in imageCamera) {
		imagesLowResolution[i] = new Image();
		angular.element(imagesLowResolution[i]).on('load', function($event) {
		    // Find the camera View to get image high resolution
		    var cameraView = $event.target.src.search(/[f|i|r|4|5|6]([/.])$/g);
		    var indexCameraView = imageCamera.indexOf($event.target.src[cameraView]);
		    // If is a valid camera type
		    if (indexCameraView) {
			// Load the high resolution image
			imagesHighResolution[indexCameraView].src = $event.target.src.replace(imageResolution.preview, imageResolution.showRoom);
		    }
		});
		angular.element(imagesLowResolution[i]).on('error', function($event) {
		    countLoadErrors = countLoadErrors + 1;
		    if (countLoadErrors >= 6) {
			countLoadErrors = 0;
			
			// Call apply to move the images to the view
			$scope.$apply(function() {
			    $scope.notificationArea = 'Images not found. Please check input information and/or connection.';
			});
		    } 
		});
	    }

	    //Init the High resolution images array buffer.
	    for (var i in imageCamera) {
		imagesHighResolution[i] = new Image();
		// Image on load event control
		angular.element(imagesHighResolution[i]).on('load', function($event) {
		    if ($scope.imageAvailable == false) {
			// First Image
			$scope.imageAvailable = true;
			showRoomImageIndex = 0;
			$scope.showRoomImage = $event.target.src;
		    }
		    // Add images to the main photo array.
		    // Call apply to move the images to the view
		    $scope.$apply(function() {
			$scope.photos.push({"preview": $event.target.src.replace(imageResolution.showRoom, imageResolution.preview),
					    "showRoom": $event.target.src });
		    });
		});
	    }

	    $scope.obfuscatedID = function (stockReference, registrationPlate) {
		// Check that have at least 9 characters
		if (stockReference.length >= 9 && 
		    stockReference.length < 25 &&
		    registrationPlate.length > 0 &&
		    registrationPlate.length < 25) {
		    var obfuscated = '';
		    // Join the two strings (CAPITALIZED) ej: "arnax-u-22050" + "MJ56SXZ" = "arnax-u-22050MJ56SXZ"
		    var seed = stockReference.toUpperCase() + registrationPlate.toUpperCase();
		    // Then take fron the begin and the final until length of registrationPlate
		    for (var i = 0; i < registrationPlate.length; i++) {
			obfuscated = obfuscated + seed[i] + seed[seed.length - i - 1];
		    }
		    // Add the nine character.
		    obfuscated = obfuscated + seed[8];

		    return obfuscated;
		}

		return false;
	    };

	    // Call to load the images
	    $scope.loadImages = function () {
		var obfuscatedId = $scope.obfuscatedID($scope.stockReference, $scope.registrationPlate);
		// Load images only if obfuscatedId is valid.
		if (obfuscatedId) {
		    var baseUrl = urlArnoldClark + obfuscatedId + '/';
		    // Init the photos buffers.
		    $scope.photos = [];
		    $scope.imageAvailable = false;
		    $scope.notificationArea = 'Loading...';
		    countLoadErrors = 0;
		    // Load images from server
		    for (var i in imageCamera) {
			// Needed for browsers based in webkit
			imagesLowResolution[i].src = "";
			imagesHighResolution[i].src = "";
			// Call the new images
			imagesLowResolution[i].src = baseUrl +
		            imageResolution.preview + '/' + 
			    imageCamera[i] + '/';
		    }
		}
	    };

	    $scope.changeShowRoomImage = function (newImage) {
		$scope.showRoomImage = newImage;
	    };

	    $scope.shiftFullScreen = function (event) {
		// Stop event propagation in the showRoom image
		if (event.target.tagName == 'DIV' && $scope.fullScreen == false) {
		    return;
		}
		event.stopPropagation();
		// Send signal to the view to shift the full screen.
		$scope.fullScreen = !$scope.fullScreen;
	    };

	    $scope.shiftFullScreenImageLeft = function (event) {
		event.stopPropagation();
		if (showRoomImageIndex == 0) {
		    showRoomImageIndex = $scope.photos.length - 1;
		} else {
		    showRoomImageIndex = showRoomImageIndex - 1;
		}
		if ($scope.photos.length > 0) {
		    $scope.changeShowRoomImage($scope.photos[showRoomImageIndex].showRoom);
		} 
	    };

	    $scope.shiftFullScreenImageRight = function (event) {
		event.stopPropagation();
		if (showRoomImageIndex == ($scope.photos.length - 1)) {
		    showRoomImageIndex = 0;
		} else {
		    showRoomImageIndex = showRoomImageIndex + 1;
		}
		if ($scope.photos.length > 0) {
		    $scope.changeShowRoomImage($scope.photos[showRoomImageIndex].showRoom);
		} 
	    };

	}]);
