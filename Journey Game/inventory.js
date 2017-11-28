game.newLoopFromConstructor('inventory', function() {
  // Constructor Game Loop
  var bg = game.newImageObject({
    file: 'images/backgrounds/menuBG.jpg',
    x: 0,
    y: 0,
    w: 640,
    h: 480,
  });

  var previousButton = game.newImageObject({
    file: 'images/buttons/left_direction_button.png',
    positionC: point(width / 5, height / 2),
    w: 100,
    h: 200,
    alpha: 0.8
  });

  var nextButton = game.newImageObject({
    file: 'images/buttons/left_direction_button.png',
    positionC: point(width / 5 * 4, height / 2),
    w: 100,
    h: 200,
    alpha: 0.8,
    angle: 180
  });

  var itemNumber = false;

  inventoryText = game.newTextObject({
    positionC: point(game.getWH2().w, 30), // central position of text
    size: 50, // size text
    color: '#363636', // color text
    text: 'Inventory', // label
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });

  numberText = game.newTextObject({
    positionC: point(game.getWH2().w, 60), // central position of text
    size: 20, // size text
    color: '#363636', // color text
    text: '( ' + itemNumber + ':' + player.inventory.length + ' )', // label
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });

  var updateNumberText = function() {
    if (itemNumber == false) {
      numberText.text = '(empty)'
    } else {
      numberText.text = '( ' + itemNumber + ':' + player.inventory.length + ' )';
    }
  }

  var updateInventoryNumber = function() {
    if (player.inventory.length > 0) {
      if (itemNumber == false || itemNumber > player.inventory.length) {
        itemNumber = 1;
      }
    } else {
      itemNumber = false;
    }
    updateNumberText();
  }

  var incrementItemNumber = function() {
    if (player.inventory.length > 0) {
      if (itemNumber < player.inventory.length) {
        itemNumber++;
      } else {
        itemNumber = 1;
      }
    }
    updateNumberText();
  }

  var decrementItemNumber = function() {
    if (player.inventory.length > 0) {
      if (itemNumber > 1) {
        itemNumber--;
      } else {
        itemNumber = player.inventory.length;
      }
    }
    updateNumberText();
  }

  this.update = function() {
    // Update function
    if (mouse.isInObject(backButton) && mouse.isPress('LEFT')) {
      returnOnPreviousLoop();
    }
    if (mouse.isInObject(previousButton) && mouse.isPress('LEFT')) {
      decrementItemNumber();
    }
    if (mouse.isInObject(nextButton) && mouse.isPress('LEFT')) {
      incrementItemNumber();
    }
    game.clear(); // clear screen
    bg.draw();
    backButton.draw();
    inventoryText.draw();
    if (itemNumber != false) {
      player.inventory[itemNumber - 1].processMouseEvents();
      updateInventoryNumber();
      if (itemNumber != false) {
        player.inventory[itemNumber - 1].drawInventory();
        previousButton.draw();
        nextButton.draw();
      }
    }
    numberText.draw();
  };

  this.entry = function() { // optional
    log('inventory is started');
    updateInventoryNumber();
  };

  this.exit = function() { // optional
    log('inventory is stopped');
  };
});
