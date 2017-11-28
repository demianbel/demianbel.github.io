game.newLoopFromConstructor('forest', function() {
  // create player events
  const playerDieEvent = {
    eventImage: game.newImageObject({
      file: 'images/events/player/die.png',
      x: eventAnimationRectangleX + 5,
      y: eventAnimationRectangleY + 5,
      w: animationRectSize - 10,
      h: animationRectSize - 10,
    }),
    tryAgain: game.newTextObject({
      x: gameAreaX + 10,
      y: eventAnimationRectangleY + 15 + animationRectSize,
      text: 'try again',
      size: 20, // size text
      font: 'Courier', // font family
      strokeColorText: '#0a0a0a',
      strokeWidthText: 2
    }),
    returnHome: game.newTextObject({
      x: gameAreaX + 10,
      y: eventAnimationRectangleY + 45 + animationRectSize,
      text: 'return',
      size: 20, // size text
      font: 'Courier', // font family
      strokeColorText: '#0a0a0a',
      strokeWidthText: 2
    }),
    info: 'Your journey is over...'
  };
  playerDieEvent.drawEvent = function() {
    this.eventImage.draw();
    this.tryAgain.draw();
    this.returnHome.draw();
  };
  playerDieEvent.processMouseEvents = function() {
    if (mouse.isInObject(this.tryAgain) && mouse.isPress('LEFT')) {
      resetGame();
      return;
    }
    if (mouse.isInObject(this.returnHome) && mouse.isPress('LEFT')) {
      resetGame();
      game.setLoop('menu');
      return;
    }
  };

  const playerVictoryEvent = {
    eventImage: game.newImageObject({
      file: 'images/events/player/victory.png',
      x: eventAnimationRectangleX + 5,
      y: eventAnimationRectangleY + 5,
      w: animationRectSize - 10,
      h: animationRectSize - 10,
    }),
    tryAgain: game.newTextObject({
      x: gameAreaX + 10,
      y: eventAnimationRectangleY + 15 + animationRectSize,
      text: 'repeat',
      size: 20, // size text
      font: 'Courier', // font family
      strokeColorText: '#0a0a0a',
      strokeWidthText: 2
    }),
    returnHome: game.newTextObject({
      x: gameAreaX + 10,
      y: eventAnimationRectangleY + 45 + animationRectSize,
      text: 'return',
      size: 20, // size text
      font: 'Courier', // font family
      strokeColorText: '#0a0a0a',
      strokeWidthText: 2
    }),
    info: 'You returned from journey!'
  };
  playerVictoryEvent.drawEvent = function() {
    this.eventImage.draw();
    this.tryAgain.draw();
    this.returnHome.draw();
  };
  playerVictoryEvent.processMouseEvents = function() {
    if (mouse.isInObject(this.tryAgain) && mouse.isPress('LEFT')) {
      resetGame();
      return;
    }
    if (mouse.isInObject(this.returnHome) && mouse.isPress('LEFT')) {
      resetGame();
      game.setLoop('menu');
      return;
    }
  };
  var forest_events = [];
  //create forest events
  class Food {
    constructor(file, titleWidth, titleHeight, number, name, eatFunc) {
      this.name = name,
        this.mushroom = game.newAnimationObject({
          animation: tiles.newImage(file).getAnimation(0, 0, titleWidth, titleHeight, number),
          x: eventAnimationRectangleX + 5,
          y: eventAnimationRectangleY + 5,
          w: animationRectSize - 10,
          h: animationRectSize - 10,
          delay: 10
        }),
        this.harvest = game.newTextObject({
          x: gameAreaX + 10,
          y: eventAnimationRectangleY + 15 + animationRectSize,
          text: 'harvest',
          size: 20, // size text
          font: 'Courier', // font family
          strokeColorText: '#0a0a0a',
          strokeWidthText: 2
        }),
        this.eat = game.newTextObject({
          x: gameAreaX + 10,
          y: eventAnimationRectangleY + 45 + animationRectSize,
          text: 'eat',
          size: 20, // size text
          font: 'Courier', // font family
          strokeColorText: '#0a0a0a',
          strokeWidthText: 2
        }),
        this.leave = game.newTextObject({
          x: gameAreaX + 10,
          y: eventAnimationRectangleY + 75 + animationRectSize,
          text: 'leave',
          size: 20, // size text
          font: 'Courier', // font family
          strokeColorText: '#0a0a0a',
          strokeWidthText: 2
        }),
        this.info = 'You have found ' + name,
        this.eatFunc = eatFunc
      this.use = game.newTextObject({
          positionC: point(width / 4, height - 70),
          text: 'use',
          size: 40, // size text
          font: 'Courier', // font family
          strokeColorText: '#0a0a0a',
          strokeWidthText: 2
        }),
        this.throwOut = game.newTextObject({
          positionC: point(width / 4 * 3, height - 70),
          text: 'throw',
          size: 40, // size text
          font: 'Courier', // font family
          strokeColorText: '#0a0a0a',
          strokeWidthText: 2
        })
    }
    drawInventory() {
      this.mushroom.draw();
      this.use.draw();
      this.throwOut.draw();
    }
    drawEvent() {
      this.mushroom.draw();
      this.harvest.draw();
      this.eat.draw();
      this.leave.draw();
    }
    processMouseEvents() {
      if (mouse.isInObject(this.harvest) && mouse.isPress('LEFT')) {
        var success = player.putToInventory(this);
        if (success) {
          updatePlayerInventoryText();
          instructionsText.text = 'You pick up this ' + this.name;
          currentEvent = false;
        } else {
          instructionsText.text = "You cann't carry more";
        }
        return;
      }
      if (mouse.isInObject(this.eat) && mouse.isPress('LEFT')) {
        this.eatFunc();
        currentEvent = false;
        return;
      }
      if (mouse.isInObject(this.leave) && mouse.isPress('LEFT')) {
        instructionsText.text = 'You leave the ' + this.name;
        currentEvent = false;
        return;
      }
      if (mouse.isInObject(this.use) && mouse.isPress('LEFT')) {
        this.eatFunc();
        player.inventory.splice(player.inventory.indexOf(this), 1);
        return;
      }
      if (mouse.isInObject(this.throwOut) && mouse.isPress('LEFT')) {
        let index = player.inventory.indexOf(this);
        player.inventory.splice(index, 1);
        instructionsText.text = 'You threw out the ' + this.name;
        return;
      }
    }
  }
  let goodMushroomEv = new Food("images/events/forest/white_mushroom.png", 221, 250, 4, 'delicious mushroom', function() {
    player.heal(10);
    instructionsText.text = 'Mushroom heals you on 10 points';
    updatePlayerHealthText();
  });
  let strangeMushroomEv = new Food("images/events/forest/strange_mushroom.png", 563, 720, 4, 'strange mushroom', function() {
    if (math.random(0, 1, false) == 0) {
      player.heal(20);
      instructionsText.text = 'Mushroom heals you on 20 points';
    } else {
      player.damage(20);
      instructionsText.text = 'Mushroom damages you on 20 points';
    }
    updatePlayerHealthText();
  });
  let badMushroomEv = new Food("images/events/forest/bad_mushroom.png", 200, 200, 4, 'bad mushroom', function() {
    player.damage(10);
    instructionsText.text = 'Mushroom damages you on 10 points';
    updatePlayerHealthText();
  });
  let raspberryEv = new Food("images/events/forest/raspberry.png", 170, 170, 4, 'raspberry', function() {
    player.heal(20);
    instructionsText.text = 'Raspberry heals you on 20 points';
    updatePlayerHealthText();
  });

  forest_events.push(goodMushroomEv);
  forest_events.push(strangeMushroomEv);
  forest_events.push(badMushroomEv);
  forest_events.push(raspberryEv);

  // Constructor Game Loop
  var eventsNumber = false;
  var victoryEventsNumber = 20;
  var bg = game.newImageObject({
    file: 'images/backgrounds/forestBG.jpg',
    x: 0,
    y: 0,
    w: 640,
    h: 480,
  });
  // create images
  var nextButton = game.newImageObject({
    file: 'images/buttons/next_button.png',
    x: width - 75,
    y: height - 90,
    w: 70,
    h: 70
  });
  var playerButton = game.newImageObject({
    file: 'images/buttons/player_button.png',
    x: width - 90,
    y: 20,
    w: 70,
    h: 70
  });
  var inventoryButton = game.newImageObject({
    file: 'images/buttons/inventory_button.png',
    x: width - 90,
    y: 100,
    w: 70,
    h: 70
  });
  var gameArea = game.newRectObject({
    w: gameAreaSize,
    h: gameAreaSize,
    x: gameAreaX,
    y: gameAreaY,
    fillColor: '#eb4379',
    alpha: 0.3,
    strokeColor: '#070707',
    strokeWidth: 5,
  });
  var healthLabel = game.newTextObject({
    positionC: point(width / 4, 40),
    text: 'HEALTH',
    size: 20, // size text
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });
  var healthText = game.newTextObject({
    positionC: point(width / 4, 60),
    text: player.health + ':' + player.maxHealth,
    size: 20, // size text
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });
  var inventoryLabel = game.newTextObject({
    positionC: point(width / 4 * 3, 40),
    text: 'INVENTORY',
    size: 20, // size text
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });
  var inventoryText = game.newTextObject({
    positionC: point(width / 4 * 3, 60),
    text: player.inventory.length + ':' + player.inventoryMaxSize,
    size: 20, // size text
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });
  var playerName = game.newTextObject({
    positionC: point(width / 2, 50),
    text: player.name,
    size: 50, // size text
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });
  var instructionsRect = game.newRectObject({
    x: gameAreaX + 10,
    y: gameAreaY + 70,
    w: gameAreaSize - 20,
    h: 30,
    fillColor: '#450ac0',
    alpha: 0.8,
    strokeColor: '#070707',
    strokeWidth: 5,
  });
  var instructionsText = game.newTextObject({
    x: instructionsRect.x + 5,
    y: instructionsRect.y + 5,
    text: 'Click next to start journey...',
    size: 20, // size text
    font: 'Courier', // font family
    strokeColorText: '#0a0a0a',
    strokeWidthText: 2
  });
  var eventAnimationRectangle = game.newRectObject({
    x: eventAnimationRectangleX,
    y: eventAnimationRectangleY,
    w: animationRectSize,
    h: animationRectSize,
    fillColor: '#483285',
    alpha: 0.7,
    strokeColor: '#070707',
    strokeWidth: 5,
  });
  var currentEvent = false;
  var resetGame = function() {
    instructionsText.text = 'Click next to start journey...';
    player.health = player.maxHealth;
    player.inventory = [];
    updatePlayerHealthText();
    updatePlayerInventoryText();
    currentEvent = false;
    eventsNumber = false;
  }

  var updatePlayerHealthText = function() {
    var prefix = '';
    if (player.health < 100) {
      prefix = ' ';
    }
    if (player.health < 10) {
      prefix = '  ';
    }
    healthText.text = prefix + player.health + ':' + player.maxHealth;
  };

  var updatePlayerInventoryText = function() {
    inventoryText.text = player.inventory.length + ':' + player.inventoryMaxSize;
  };

  var drawGameArea = function() {
    bg.draw();
    backButton.draw();
    inventoryButton.draw();
    playerButton.draw();
    gameArea.draw();
    playerName.draw();
    healthLabel.draw();
    healthText.draw();
    inventoryLabel.draw();
    inventoryText.draw();
    instructionsRect.draw();
    instructionsText.draw();
    eventAnimationRectangle.draw();
  }

  this.update = function() {
    // Update function
    if (mouse.isInObject(backButton) && mouse.isPress('LEFT')) {
      returnOnPreviousLoop();
    }
    if (mouse.isInObject(inventoryButton) && mouse.isPress('LEFT')) {
      previousLoop.push('forest');
      game.setLoop('inventory');
    }
    if (player.health == 0) {
      currentEvent = playerDieEvent;
      instructionsText.text = currentEvent.info;
    }
    game.clear(); // clear screen
    drawGameArea();
    if (currentEvent == false) {
      if (eventsNumber != false && eventsNumber == victoryEventsNumber) {
        eventsNumber = false;
        currentEvent = playerVictoryEvent;
        instructionsText.text = currentEvent.info;
      } else {
        nextButton.draw();
      }
      if (mouse.isInObject(nextButton) && mouse.isPress('LEFT')) {
        var pos = math.random(0, forest_events.length - 1, false);
        currentEvent = forest_events[pos];
        instructionsText.text = currentEvent.info;
        if (eventsNumber) {
          eventsNumber++;
        } else {
          eventsNumber = 1;
        }
      }
    } else {
      currentEvent.drawEvent();
      currentEvent.processMouseEvents();
    }
  };

  this.entry = function() { // optional
    log('forest is started');
    updatePlayerInventoryText();
    updatePlayerHealthText();
  };

  this.exit = function() { // optional
    log('forest is stopped');
  };
});
