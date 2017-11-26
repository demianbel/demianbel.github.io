var pjs = new PointJS(640, 480, {
	backgroundColor : '#4b4843' // optional
});
// pjs.system.initFullPage(); // for Full Page mode
// pjs.system.initFullScreen(); // for Full Screen mode (only Desctop)

var log    = pjs.system.log;     // log = console.log;
var game   = pjs.game;           // Game Manager
var point  = pjs.vector.point;   // Constructor for Point
var camera = pjs.camera;         // Camera Manager
var brush  = pjs.brush;          // Brush, used for simple drawing
var OOP    = pjs.OOP;            // Objects manager
var math   = pjs.math;           // More Math-methods
var tiles  = pjs.tiles;

// var key   = pjs.keyControl.initKeyControl();
var mouse = pjs.mouseControl.initMouseControl();
// var touch = pjs.touchControl.initTouchControl();
// var act   = pjs.actionControl.initActionControl();

var width  = game.getWH().w; // width of scene viewport
var height = game.getWH().h; // height of scene viewport
var volume = 0.01;
var ambientSound = pjs.audio.newAudio('sounds/ambient/forest_birds.mp3', volume);
pjs.system.setTitle('Journey Game'); // Set Title for Tab or Window
pjs.mouseControl.setCursorImage('images/cursors/default_cursor.png');
var previousLoop = [];
// create player
const player = {
  health : 100,
  maxHealth : 100,
  def : 0,
  name : 'Evgeniy',
  inventory : [],
  inventoryMaxSize : 16
};
player.heal = function(power) {
  var resultHealth = this.health + power;
  if (resultHealth > this.maxHealth) {
    this.health = this.maxHealth;
  } else {
    this.health = resultHealth;
  }
};
player.damage = function(power) {
  var resultHealth = this.health - power;
  if (resultHealth <= 0) {
    this.health = 0;
  } else {
    this.health = resultHealth;
  }
};
player.putToInventory = function(item) {
  if (this.inventory.length < this.inventoryMaxSize) {
    this.inventory.push(item);
    return true;
  } else {
    return false;
  }
};

var events = [];
var backButton = game.newImageObject({
  file : 'images/buttons/back_button.png',
  x : 5,
  y : 5,
  w : 40,
  h : 40,
});

var returnOnPreviousLoop = function() {
  var index = previousLoop.length - 1;
  var goTo = previousLoop[index];
  previousLoop.splice(index, 1);
  game.setLoop(goTo);
};

// Game Loops
game.newLoopFromConstructor('menu', function() {
  // init images
  var bg = game.newImageObject({
   file : 'images/backgrounds/menuBG.jpg',
   x : 0,
   y : 0,
   w : 640,
   h : 480,
  });
  
  //init Objects
  var newGameMenuItem = game.newRectObject({
    x : 20,
    y : 20,
    w : 300,
    h : 40,
    fillColor : '#77401c',
    alpha : 0.8,
    strokeColor : '#77401c',
    strokeWidth : 5,
  });
  
  var newGameText = game.newTextObject({
	  x : 30,
	  y : 20,
		size : 40, // size text
		color : '#0a0a0a', // color text
		text : 'New game', // label
		font : 'Arial' // font family
	});
	
	var settingsMenuItem = game.newRectObject({
    x : 20,
    y : 70,
    w : 300,
    h : 40,
    fillColor : '#77401c',
    alpha : 0.8,
    strokeColor : '#77401c',
    strokeWidth : 5,
  });
  
  var settingsText = game.newTextObject({
		// positionC : point(130 , 95), // central position of text
		x : 30,
		y : 70,
		size : 40, // size text
		color : '#0a0a0a', // color text
		text : 'Settings', // label
		font : 'Arial' // font family
	});
  
  this.update = function () {
		// Update function
		// new game click listener
		if(mouse.isInObject(newGameMenuItem)) {
      newGameMenuItem.alpha = 1;
      if (mouse.isPress('LEFT')) {
        previousLoop.push('menu');
        game.setLoop('forest');
      }
    } else {
       newGameMenuItem.alpha = 0.8;
    }
    
    // settings click listener
		if(mouse.isInObject(settingsMenuItem)) {
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

	this.entry = function () { // optional
		log('myGame is started');
	};

	this.exit = function () { // optional
		log('myGame is stopped');
	};
	
	var drawMenu = function () {
	  newGameMenuItem.draw();
    settingsMenuItem.draw();
    newGameText.draw();
    settingsText.draw();
	};
});

game.newLoopFromConstructor('forest', function () {
	// Constructor Game Loop
  var eventsNumber = false;
  var victoryEventsNumber = 20;
  var bg = game.newImageObject({
  file : 'images/backgrounds/forestBG.jpg',
  x : 0,
  y : 0,
  w : 640,
  h : 480,
  });
  // create images
  var nextButton = game.newImageObject({
    file : 'images/buttons/next_button.png',
    x : width - 75,
    y : height - 90,
    w : 70,
    h : 70
  });
  var playerButton = game.newImageObject({
    file : 'images/buttons/player_button.png',
    x : width - 90,
    y : 20,
    w : 70,
    h : 70
  });
  var inventoryButton = game.newImageObject({
    file : 'images/buttons/inventory_button.png',
    x : width - 90,
    y : 100,
    w : 70,
    h : 70
  });
  // create game area
  var gameAreaSize = 450;
  var gameAreaX = (width - gameAreaSize)/2;
  var gameAreaY = (height - gameAreaSize)/2;
  var gameArea = game.newRectObject({
    w : gameAreaSize,
    h : gameAreaSize,
    x : gameAreaX,
    y : gameAreaY,
    fillColor : '#eb4379',
    alpha : 0.3,
    strokeColor : '#070707',
    strokeWidth : 5,
  });
  var healthLabel = game.newTextObject({
	  positionC : point(width/4, 40),
	  text : 'HEALTH',
	  size : 20, // size text
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});
  var healthText = game.newTextObject({
	  positionC : point(width/4, 60),
	  text : player.health + ':' + player.maxHealth,
	  size : 20, // size text
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});
	var inventoryLabel = game.newTextObject({
	  positionC : point(width/4*3, 40),
	  text : 'INVENTORY',
	  size : 20, // size text
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});
  var inventoryText = game.newTextObject({
	  positionC : point(width/4*3, 60),
	  text : player.inventory.length + ':' + player.inventoryMaxSize,
	  size : 20, // size text
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});
	var playerName = game.newTextObject({
	  positionC : point(width/2, 50),
	  text : player.name,
	  size : 50, // size text
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});
  var instructionsRect = game.newRectObject({
    x : gameAreaX + 10,
    y : gameAreaY + 70,
    w : gameAreaSize - 20,
    h : 30,
    fillColor : '#450ac0',
    alpha : 0.8,
    strokeColor : '#070707',
    strokeWidth : 5,
  });
  var instructionsText = game.newTextObject({
    x : instructionsRect.x + 5,
    y: instructionsRect.y + 5,
	  text : 'Click next to start journey...',
	  size : 20, // size text
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
  });
  var animationRectSize = 200;
  var eventAnimationRectangle = game.newRectObject({
    x : gameAreaX + (gameAreaSize - animationRectSize) / 2,
    y : gameAreaY + 120,
    w : animationRectSize,
    h : animationRectSize,
    fillColor : '#483285',
    alpha : 0.7,
    strokeColor : '#070707',
    strokeWidth : 5,
  });
  var currentEvent = false;
  // create player events
  const playerDieEvent = {
    eventImage : game.newImageObject({
      file : 'images/events/player/die.png',
      x : eventAnimationRectangle.x + 5,
      y : eventAnimationRectangle.y +5,
      w : animationRectSize - 10,
      h : animationRectSize - 10,
    }),
    tryAgain : game.newTextObject({
      x : gameAreaX + 10,
      y : eventAnimationRectangle.y + 15 + animationRectSize,
	    text : 'try again',
	    size : 20, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    }),
    returnHome : game.newTextObject({
      x : gameAreaX + 10,
      y : eventAnimationRectangle.y + 45 + animationRectSize,
	    text : 'return',
	    size : 20, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    }),
    info : 'Your journey is over...'
  };
  playerDieEvent.drawEvent =  function(){
     this.eventImage.draw();
     this.tryAgain.draw();
     this.returnHome.draw();
  };
  playerDieEvent.processMouseEvents =  function(){
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
    eventImage : game.newImageObject({
      file : 'images/events/player/victory.png',
      x : eventAnimationRectangle.x + 5,
      y : eventAnimationRectangle.y +5,
      w : animationRectSize - 10,
      h : animationRectSize - 10,
    }),
    tryAgain : game.newTextObject({
      x : gameAreaX + 10,
      y : eventAnimationRectangle.y + 15 + animationRectSize,
	    text : 'repeat',
	    size : 20, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    }),
    returnHome : game.newTextObject({
      x : gameAreaX + 10,
      y : eventAnimationRectangle.y + 45 + animationRectSize,
	    text : 'return',
	    size : 20, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    }),
    info : 'You returned from journey!'
  };
  playerVictoryEvent.drawEvent =  function(){
     this.eventImage.draw();
     this.tryAgain.draw();
     this.returnHome.draw();
  };
  playerVictoryEvent.processMouseEvents =  function(){
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
  var resetGame = function() {
    instructionsText.text = 'Click next to start journey...';
    player.health = player.maxHealth;
    player.inventory = [];
    updatePlayerHealthText();
    updatePlayerInventoryText();
    currentEvent = false;
    eventsNumber = false;
  }
  var forest_events = [];
  //create forest events
  class Food {
  constructor(file, titleWidth, titleHeight, number, name, eatFunc) {
    this.name = name,
    this.mushroom = game.newAnimationObject({
      animation : tiles.newImage(file).getAnimation(0, 0, titleWidth, titleHeight, number),
      x : eventAnimationRectangle.x + 5,
      y : eventAnimationRectangle.y +5,
      w : animationRectSize - 10,
      h : animationRectSize - 10,
      delay : 10
    }),
    this.harvest = game.newTextObject({
      x : gameAreaX + 10,
      y : eventAnimationRectangle.y + 15 + animationRectSize,
	    text : 'harvest',
	    size : 20, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    }),
    this.eat = game.newTextObject({
      x : gameAreaX + 10,
      y : eventAnimationRectangle.y + 45 + animationRectSize,
	    text : 'eat',
	    size : 20, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    }),
    this.leave = game.newTextObject({
      x : gameAreaX + 10,
      y : eventAnimationRectangle.y + 75 + animationRectSize,
	    text : 'leave',
	    size : 20, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    }),
    this.info = 'You have found ' + name,
    this.eatFunc = eatFunc
    this.use = game.newTextObject({
      positionC : point(width / 4, height - 70),
	    text : 'use',
	    size : 40, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    }),
    this.throwOut = game.newTextObject({
      positionC : point(width / 4 * 3, height - 70),
	    text : 'throw',
	    size : 40, // size text
		  font : 'Courier', // font family
		  strokeColorText : '#0a0a0a',
		  strokeWidthText : 2
    })
  }
  drawInventory(){
      this.mushroom.draw();
      this.use.draw();
      this.throwOut.draw();
  }
  drawEvent(){
      this.mushroom.draw();
      this.harvest.draw();
      this.eat.draw();
      this.leave.draw();
  }
  processMouseEvents(){
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

	var updatePlayerHealthText = function() {
    var prefix = '';
    if (player.health < 100) {
      prefix = ' ';
    }
    if (player.health < 10) {
         prefix = '  ';
    }
    healthText.text =  prefix + player.health + ':' + player.maxHealth;
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
	
	this.update = function () {
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
      if (mouse.isInObject(nextButton) && mouse.isPress('LEFT')){
        var pos = math.random(0, forest_events.length - 1, false);
        currentEvent = forest_events[pos];
        instructionsText.text = currentEvent.info;
        if(eventsNumber) {
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

	this.entry = function () { // optional
		log('forest is started');
		updatePlayerInventoryText();
		updatePlayerHealthText();
	};

	this.exit = function () { // optional
		log('forest is stopped');
	};

});

game.newLoopFromConstructor('inventory', function () {
	// Constructor Game Loop
  var bg = game.newImageObject({
    file : 'images/backgrounds/menuBG.jpg',
    x : 0,
    y : 0,
    w : 640,
    h : 480,
  });
  
  var previousButton = game.newImageObject({
    file : 'images/buttons/left_direction_button.png',
    positionC : point(width / 5, height / 2),
    w : 100,
    h : 200,
    alpha : 0.8
  });
  
  var nextButton = game.newImageObject({
    file : 'images/buttons/left_direction_button.png',
    positionC : point(width / 5 * 4, height / 2),
    w : 100,
    h : 200,
    alpha : 0.8,
    angle : 180
  });
  
  var itemNumber = false;
  
	inventoryText = game.newTextObject({
		positionC : point(game.getWH2().w, 30), // central position of text
		size : 50, // size text
		color : '#363636', // color text
		text : 'Inventory', // label
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});
	
	numberText = game.newTextObject({
		positionC : point(game.getWH2().w, 60), // central position of text
		size : 20, // size text
		color : '#363636', // color text
		text : '( ' + itemNumber + ':' + player.inventory.length + ' )', // label
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});
	
	var updateNumberText = function(){
	  if (itemNumber == false) {
	    numberText.text = '(empty)'
	  } else {
	    numberText.text = '( ' + itemNumber + ':' + player.inventory.length + ' )';
	  }
	}
	
	var updateInventoryNumber = function(){
	  if (player.inventory.length > 0) {
		  if (itemNumber == false || itemNumber > player.inventory.length){
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

	this.update = function () {
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
	    player.inventory[itemNumber-1].processMouseEvents();
	    updateInventoryNumber();
	    if (itemNumber != false) {
	      player.inventory[itemNumber-1].drawInventory();
	      previousButton.draw();
        nextButton.draw();
	    }
	  }
		numberText.draw();
	};

	this.entry = function () { // optional
		log('inventory is started');
    updateInventoryNumber();
	};

	this.exit = function () { // optional
		log('inventory is stopped');
	};
});

game.newLoopFromConstructor('settings', function () {
	// Constructor Game Loop
  var bg = game.newImageObject({
    file : 'images/backgrounds/menuBG.jpg',
    x : 0,
    y : 0,
    w : 640,
    h : 480,
  });
  
	myText = game.newTextObject({
		positionC : point(game.getWH2().w, 30), // central position of text
		size : 50, // size text
		color : '#363636', // color text
		text : 'Settings', // label
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});
	
	var firstCircleX = 190;
	var circleDistance = 30;
	var volumeCircleArray = [];
	OOP.forInt(10, function(i) {
	  var circle = game.newCircleObject({
	    x : firstCircleX + i * circleDistance,
	    y : 105,
	    radius : 10,
	    fillColor : '#055f1e',
	  });
	  volumeCircleArray.push(circle);
	});
	
	var drawCircles = function() {
		var alpha = 0.5;
	  OOP.forArr(volumeCircleArray, function(el){
	    if (mouse.isInObject(el) || ((el.x - firstCircleX) / circleDistance + 1)/100 === volume){
	      alpha = 1;
	    }
	    el.alpha = alpha;
	    el.draw();
	  });
	}
	
	var volumeText = game.newTextObject({
		x : 50,
		y : 100,
		size : 30, // size text
		color : '#363636', // color text
		text : 'Volume', // label
		font : 'Courier', // font family
		strokeColorText : '#0a0a0a',
		strokeWidthText : 2
	});

	this.update = function () {
		// Update function
    if (mouse.isInObject(backButton) && mouse.isPress('LEFT')) {
      returnOnPreviousLoop();
    }
    OOP.forArr(volumeCircleArray, function(el){
      if (mouse.isInObject(el) && mouse.isPress('LEFT')) {
        volume = ((el.x - firstCircleX) / circleDistance + 1)/100;
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

	this.entry = function () { // optional
		log('settings is started');
	};

	this.exit = function () { // optional
		log('settings is stopped');
	};

});

game.setLoopSound('settings', [ambientSound]);
game.setLoopSound('forest', [ambientSound]);
game.startLoop('menu');