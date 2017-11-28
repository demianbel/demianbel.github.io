game.newLoopFromConstructor('menu', function() {
  // init images
  var bg = game.newImageObject({
    file: 'images/backgrounds/menuBG.jpg',
    x: 0,
    y: 0,
    w: 640,
    h: 480,
  });

  //init Objects
  var newGameMenuItem = game.newRectObject({
    x: 20,
    y: 20,
    w: 300,
    h: 40,
    fillColor: '#77401c',
    alpha: 0.8,
    strokeColor: '#77401c',
    strokeWidth: 5,
  });

  var newGameText = game.newTextObject({
    x: 30,
    y: 20,
    size: 40, // size text
    color: '#0a0a0a', // color text
    text: 'New game', // label
    font: 'Arial' // font family
  });

  var settingsMenuItem = game.newRectObject({
    x: 20,
    y: 70,
    w: 300,
    h: 40,
    fillColor: '#77401c',
    alpha: 0.8,
    strokeColor: '#77401c',
    strokeWidth: 5,
  });

  var settingsText = game.newTextObject({
    // positionC : point(130 , 95), // central position of text
    x: 30,
    y: 70,
    size: 40, // size text
    color: '#0a0a0a', // color text
    text: 'Settings', // label
    font: 'Arial' // font family
  });

  this.update = function() {
    // Update function
    // new game click listener
    if (mouse.isInObject(newGameMenuItem)) {
      newGameMenuItem.alpha = 1;
      if (mouse.isPress('LEFT')) {
        previousLoop.push('menu');
        game.setLoop('forest');
      }
    } else {
      newGameMenuItem.alpha = 0.8;
    }

    // settings click listener
    if (mouse.isInObject(settingsMenuItem)) {
      settingsMenuItem.alpha = 1;
      if (mouse.isPress('LEFT')) {
        previousLoop.push('menu');
        game.setLoop('settings');
      }
    } else {
      settingsMenuItem.alpha = 0.8;
    }
    game.clear(); // clear screen
    bg.draw();
    drawMenu();
  };

  this.entry = function() { // optional
    log('myGame is started');
  };

  this.exit = function() { // optional
    log('myGame is stopped');
  };

  var drawMenu = function() {
    newGameMenuItem.draw();
    settingsMenuItem.draw();
    newGameText.draw();
    settingsText.draw();
  };
});
