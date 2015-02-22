// E2E test 
describe('Application homepage', function() {
  // A Car information
  var stockReference = 'arnyam-u-232603';
  var registrationPlate = 'ND13FXZ';
  // Control elements: 2xINPUTS, 1xBUTTON
  var elementStockReference = element(by.model('stockReference'));
  var elementregistrationPlate = element(by.model('registrationPlate'));
  var elementButton = element(by.tagName('button'));

  function waitToLoad() {
    // Wait to download images or to fail.
    var titleShowRoom = {};
    var imagesContainer = {};

    browser.wait(
	function () {
	    // Take the values titleShowRoom and imagesContainer from the promises
	    element(by.css('.title-showRoom')).getText().then(function(text) {titleShowRoom.text = text;});
	    element(by.repeater('photo in photos')).isPresent().then(function(test) {imagesContainer.ready = test;});
	    return (titleShowRoom.text === 'Images not found. Please check input information and/or connection.') || 
		    imagesContainer.ready;
	}
    );
  }

  function writeInputsAndClick(inputStockReference, inputRegistrationPlate) {
    // Clean the inputs of data
    elementStockReference.clear();
    elementregistrationPlate.clear();
    // Write the information in the inputs
    elementStockReference.sendKeys(inputStockReference);
    elementregistrationPlate.sendKeys(inputRegistrationPlate);

    elementButton.click();
  }


  it('should have a title', function() {
    browser.get('http://localhost:3000');

    expect(browser.getTitle()).toEqual('Arnold Clark Car Show');
  });

  it('should have two input elements', function() {
    expect(elementStockReference.isPresent()).toBe(true);
    expect(elementregistrationPlate.isPresent()).toBe(true);
  });

  it('should load images', function() {
    writeInputsAndClick(stockReference, registrationPlate);
    // Appears the Text 'Loading...' the firt time
    expect(element(by.css('.title-showRoom')).getText()).toEqual('Loading...');

    waitToLoad();    
    // Expect to find the photos repeater.
    expect(element(by.repeater('photo in photos')).isPresent()).toBe(true);
  });

  it('should not load images (not enough information)', function() {
    // The half of the car information 
    writeInputsAndClick(stockReference.substring(0, stockReference.length / 2), 
			registrationPlate.substring(0, registrationPlate.length / 2));    
    waitToLoad();

    expect(element(by.repeater('photo in photos')).isPresent()).toBe(false);
  });

  it('should select the main (show room) image', function() {
    var imageToTest;
    var showRoomImage = element(by.css('.show-room')).element(by.tagName('img'));
    var imagePreviewArray;

    writeInputsAndClick(stockReference, registrationPlate);
    waitToLoad();
    // Once it load the preview images get the preview images array
    imagePreviewArray = element.all(by.css('.preview img'));
    // Press click in the first image and record in imageToTest. 
    imagePreviewArray.first().click();
    imageToTest = showRoomImage.getAttribute('src');
    // Press click in the last image.
    imagePreviewArray.last().click();
    // The showRoomImage now is different from imageToTest (initial image)
    expect(showRoomImage.getAttribute('src')).not.toEqual(imageToTest);
    // Select the firt image and make click and expect to be equal
    imagePreviewArray.first().click();
    // Know the showRoom image is equal to the fisrt.
    expect(showRoomImage.getAttribute('src')).toEqual(imageToTest);
  });

  it('should change to full screen', function() {
    var showRoomImage = element(by.css('.show-room')).element(by.tagName('img'));
    var showRoom = element(by.css('.show-room'));

    writeInputsAndClick(stockReference, registrationPlate);
    waitToLoad();

    // Show Room  is not full screen 
    expect(showRoom.getAttribute('class')).not.toMatch('full-screen');
    showRoomImage.click();
    // Show Room is full screen 
    expect(showRoom.getAttribute('class')).toMatch('full-screen');
    // Show Room return to not full screen mode
    showRoom.click();
    expect(showRoom.getAttribute('class')).not.toMatch('full-screen');
  });

  it('should change image in full screen', function() {
    var imageToTest;
    var showRoomImage = element(by.css('.show-room')).element(by.tagName('img'));
    var imagePreviewArray;
    var leftButton = element(by.css('.button-left'));
    var rightButton = element(by.css('.button-right'));

    writeInputsAndClick(stockReference, registrationPlate);
    waitToLoad();
    // Once it load the preview images get the preview images array
    imagePreviewArray = element.all(by.css('.preview img'));
    // Press click in the first image and record in imageToTest. 
    imagePreviewArray.first().click();
    imageToTest = showRoomImage.getAttribute('src');
    // Go to full screen
    showRoomImage.click();

    // First go to the left and return
    // Image chage by left button
    leftButton.click();
    // The showRoomImage now is different from imageToTest (initial image)
    expect(showRoomImage.getAttribute('src')).not.toEqual(imageToTest);
    // Image chage by right button
    rightButton.click();
    // The showRoomImage now is equal to imageToTest
    expect(showRoomImage.getAttribute('src')).toEqual(imageToTest);

    // Second go to the right and return
    // Image chage by right button
    rightButton.click();
    // The showRoomImage now is different from imageToTest (initial image)
    expect(showRoomImage.getAttribute('src')).not.toEqual(imageToTest);
    // Image chage by left button
    leftButton.click();
    // The showRoomImage now is equal to imageToTest
    expect(showRoomImage.getAttribute('src')).toEqual(imageToTest);
  });
});
