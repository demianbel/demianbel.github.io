game.newLoopFromConstructor('settings', function() {
  // Constructor Game Loop
  var bg = game.newImageObject({
    file: 'images/backgrounds/menuBG.jpg',
    x: 0,
    y: 0,
    w: 640,
    h: 480,
  });

  myText = game.newTextObject({
    positionC: point(game.getWH2().w, 30), // central position of text
    size: 50, // size text
    color: '#363636', // color text
    text: 'Settings', // label
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });

  var firstCircleX = 190;
  var circleDistance = 30;
  var volumeCircleArray = [];
  OOP.forInt(10, function(i) {
    var circle = game.newCircleObject({
      x: firstCircleX + i * circleDistance,
      y: 105,
      radius: 10,
      fillColor: '#055f1e',
    });
    volumeCircleArray.push(circle);
  });

  var drawCircles = function() {
    var alpha = 0.5;
    OOP.forArr(volumeCircleArray, function(el) {
      if (mouse.isInObject(el) || ((el.x - firstCircleX) / circleDistance + 1) / 100 === volume) {
        alpha = 1;
      }
      el.alpha = alpha;
      el.draw();
    });
  }

  var volumeText = game.newTextObject({
    x: 50,
    y: 100,
    size: 30, // size text
    color: '#363636', // color text
    text: 'Volume', // label
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });

  this.update = function() {
    // Update function
    if (mouse.isInObject(backButton) && mouse.isPress('LEFT')) {
      returnOnPreviousLoop();
    }
    OOP.forArr(volumeCircleArray, function(el) {
      if (mouse.isInObject(el) && mouse.isPress('LEFT')) {
        volume = ((el.x - firstCircleX) / circleDistance + 1) / 100;
        ambientSound.setVolume(volume);
      }
    });
    game.clear(); // clear screen
    bg.draw();
    backButton.draw();
    myText.draw();
    volumeText.draw();
    drawCircles();

  };

  this.entry = function() { // optional
    log('settings is started');
  };

  this.exit = function() { // optional
    log('settings is stopped');
  };

});
game.setLoopSound('settings', [ambientSound]);
game.setLoopSound('forest', [ambientSound]);
game.startLoop('menu');
