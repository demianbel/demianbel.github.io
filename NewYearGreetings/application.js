var pjs = new PointJS(640, 480, {
  backgroundColor: '#4b4843' // optional
});
// pjs.system.initFullPage(); // for Full Page mode
// pjs.system.initFullScreen(); // for Full Screen mode (only Desctop)

var log = pjs.system.log; // log = console.log;
var game = pjs.game; // Game Manager
var point = pjs.vector.point; // Constructor for Point
var camera = pjs.camera; // Camera Manager
var brush = pjs.brush; // Brush, used for simple drawing
var OOP = pjs.OOP; // Objects manager
var math = pjs.math; // More Math-methods
var tiles = pjs.tiles;

// var key   = pjs.keyControl.initKeyControl();
var mouse = pjs.mouseControl.initMouseControl();
// var touch = pjs.touchControl.initTouchControl();
// var act   = pjs.actionControl.initActionControl();

var width = game.getWH().w; // width of scene viewport
var height = game.getWH().h; // height of scene viewport
var ambientSound = pjs.audio.newAudio('sounds/background.mp3', 0.03);
var finalSound = pjs.audio.newAudio('sounds/final_background.mp3', 0.03);
pjs.system.setTitle('Happy New Year');
var vk_inited = false;
VK.init(function() { 
	vk_inited = true;
	log('vk inited');
 });
var requested = false;
var snowflakes = [];
var counter = 0;
game.newLoopFromConstructor('newYear', function() {
	var bg = game.newImageObject({
	    file: 'images/greetings.jpg',
	    x: 0,
	    y: 0,
	    w: 640,
	    h: 480,
	});
	var tree = game.newImageObject({
	    file: 'images/tree.png',
	    x: width - 200,
	    y: height - 200,
	    w: 150,
	    h: 150,
	});
	var treeInstructions = game.newTextObject({
		x: width - 400,
		y: height - 180,
		size: 25, // size text
		color: '#0a0a0a', // color text
		text: 'Загляни под ёлочку', // label
		font: 'Arial' // font family
	});
	
	var newGameText= game.newTextObject({
		positionC : point(width / 2 , height / 2),
		size: 40, // size text
		color: '#0a0a0a', // color text
		text: 'С Новым Годом !', // label
		font: 'Arial' // font family
	});
	this.update = function() {
		game.clear();
		if (vk_inited && !requested){
			requested = true;
			VK.api("users.get", function(data) { 
		    	name = data.response[0].first_name; 
		    	newGameText = game.newTextObject({
		    		positionC : point(width / 2 , height / 2),
		    		size: 40, // size text
		    		color: '#0a0a0a', // color text
		    		text: 'С Новым Годом, ' + name + ' !', // label
		    		font: 'Arial' // font family
		    	});
			});
		}
		if(vk_inited) {
		if (mouse.isInObject(tree)) {
		      if (mouse.isPress('LEFT')) {
		        game.setLoop('gifts');
		      }
		}
		counter++;
		if (counter == 20) {
			OOP.forInt(5, function() {
				var snowflake = game.newImageObject({
					file: 'images/snowflake_2.png',
					x: Math.random() * (width + height / 2) - height / 2,
					y: -20,
					w: 10,
					h: 10,
				});
				snowflakes.push(snowflake);
			});
			counter = 0;
		}
		bg.draw();
		tree.draw();
		treeInstructions.draw();
		if (newGameText) {
			newGameText.draw();
		}
		var mousePosition = mouse.getPosition();
		OOP.forArr(snowflakes, function(val, i, arr) {
			val.draw();
			distance = Math.hypot(val.x - mousePosition.x, val.y - mousePosition.y);
			if (distance > 50) {
				val.y = val.y + 0.5;
				val.x = val.x + 0.25;
			} else {
				val.y = val.y + Math.random() * 4 - 2;
				val.x = val.x + Math.random() * 4 - 2;
			}
			if (val.y > height || val.x > width) {
				var index = snowflakes.indexOf(val);
				snowflakes.splice(index, 1);
			}
		})
		}
	};
	
	this.entry = function() {
		// optional
		log('newYear is started');
	 };

	this.exit = function() {
		 // optional
		 log('newYear is stopped');
	};
});

game.newLoopFromConstructor('gifts', function() {
	var giftOpened = false;
	
	var bg = game.newImageObject({
	    file: 'images/gifts.jpg',
	    x: 0,
	    y: 0,
	    w: 640,
	    h: 480,
	});
	var openedGift;
	var openedGiftInfo;
	var toTheWall = game.newTextObject({
		x: 230,
		y: height - 40,
		size: 25, // size text
		color: '#FFD700', // color text
		text: 'Получить поздравление на стену!', // label
		font: 'Arial' // font family
	});
	var gift = game.newAnimationObject({
        animation: tiles.newImage('images/animated_gift.png').getAnimation(0, 0, 256, 256, 8),
        x: width / 2 - 100,
        y: height / 2 - 100,
        w: 200,
        h: 200,
        delay: 5
     });
	
	var treeInstructions = game.newTextObject({
		x: 10,
		y: 10,
		size: 25, // size text
		color: '#FF0000', // color text
		text: 'Ура, подарок!', // label
		font: 'Arial' // font family
	});
	
	var treeInstructionsSecondRow = game.newTextObject({
		x: 10,
		y: 35,
		size: 25, // size text
		color: '#FF0000', // color text
		text: 'Скорее открывай!', // label
		font: 'Arial' // font family
	});
	
	var gifts = [];
	class Gift {
		constructor(name, imagePath) {
			this.name = name;
			this.gift = game.newImageObject({
	    	    file: imagePath,
	    	    x: width / 2 - 100,
	            y: height / 2 - 100,
	    	    w: 200,
	    	    h: 200,
	    	});
		}
	}
	// add gifts
	gifts.push(new Gift('Мешочек радости', 'images/bag.png'));
	gifts.push(new Gift('Сундук денег', 'images/chest.png'));
	gifts.push(new Gift('Пригоршни счастья', 'images/happy.jpg'));
	gifts.push(new Gift('Бесконечная удача', 'images/luck.png'));
	gifts.push(new Gift('Островок спокойствия', 'images/isle.png'));
	gifts.push(new Gift('Пилюли крепкого здоровья', 'images/tablet.png'));
	gifts.push(new Gift('Баночка сильного духа', 'images/health.png'));
	gifts.push(new Gift('Целый кот нежности', 'images/cat.png'));
	gifts.push(new Gift('Уголёк тепла', 'images/warm.jpg'));
	gifts.push(new Gift('Море любви', 'images/love.png'));
	
	var publishToVK = function(text) {
		VK.api("wall.post", {text},function(data) {});
		log(text);
	}
	var hint = game.newTextObject({
		positionC : point(width / 2 , height / 2 + 120),
		size: 25, // size text
		color: '#FF0000', // color text
		text: 'Кликни на подарок, если хочешь другой!', // label
		font: 'Arial', // font family
		strokeColorText: '#0a0a0a',
		strokeWidthText: 2
	});
	var wallMessage;	
	this.update = function() {
		if (mouse.isInObject(gift)) {
		      if (mouse.isPress('LEFT')) {
		    	var pos = math.random(0, gifts.length - 1, false);
		        currentGift = gifts[pos];
		    	openedGift = currentGift.gift;
		    	openedGiftInfo = game.newTextObject({
		    		positionC : point(width / 2 , height / 2 - 120),
		    		size: 30, // size text
		    		color: '#FF0000', // color text
		    		text: currentGift.name, // label
		    		font: 'Arial', // font family
		    		strokeColorText: '#0a0a0a',
		    		strokeWidthText: 2
		    	});
		    	wallMessage = 'Я получил "' + currentGift.name + '" от Демьяна в приложении: link вместе со словами: ' +
		        'Поздравляю с Новым Годом! Желаю счастья, здоровья, любви, удачи и всего-всего, чего только можно пожелать!' + 
		    	'Пусть мой небольшой подарок сделает твою жизнь если не лучше, то хотя бы немного проще и веселее! С праздником!';
		        giftOpened = true;
		      }
		}
		if (mouse.isInObject(toTheWall)) {
		      if (mouse.isPress('LEFT')) {
		    	  publishToVK(wallMessage);
		    	  game.setLoop('final');
		      }
		}
		game.clear();
		bg.draw();
		if (!giftOpened) {
			treeInstructions.draw();
			treeInstructionsSecondRow.draw();
			gift.draw();
		} else {
			hint.draw();
			openedGift.draw();
			openedGiftInfo.draw();
			toTheWall.draw();
		}
	}
	
	this.entry = function() {
		// optional
		log('gifts is started');
	 };

	this.exit = function() {
		 // optional
		 log('gifts is stopped');
	};
});

game.newLoopFromConstructor('final', function() {	
	var bg = game.newImageObject({
	    file: 'images/final.jpeg',
	    x: 0,
	    y: 0,
	    w: 640,
	    h: 480,
	});
	
	this.update = function() {	
		counter++;
		if (counter == 20) {
			OOP.forInt(5, function() {
				var snowflake = game.newImageObject({
					file: 'images/snowflake_2.png',
					x: Math.random() * (width + height / 2) - height / 2,
					y: -20,
					w: 10,
					h: 10,
				});
				snowflakes.push(snowflake);
			});
			counter = 0;
		}
		game.clear();
		bg.draw();
		var mousePosition = mouse.getPosition();
		OOP.forArr(snowflakes, function(val, i, arr) {
			val.draw();
			distance = Math.hypot(val.x - mousePosition.x, val.y - mousePosition.y);
			if (distance > 50) {
				val.y = val.y + 0.5;
				val.x = val.x + 0.25;
			} else {
				val.y = val.y + Math.random() * 4 - 2;
				val.x = val.x + Math.random() * 4 - 2;
			}
			if (val.y > height || val.x > width) {
				var index = snowflakes.indexOf(val);
				snowflakes.splice(index, 1);
			}
		})
	}
	
	this.entry = function() {
		// optional
		log('final is started');
	 };

	this.exit = function() {
		 // optional
		 log('final is stopped');
	};
});
game.setLoopSound('newYear', [ambientSound]);
game.setLoopSound('gifts', [ambientSound]);
game.setLoopSound('final', [finalSound]);
game.startLoop('newYear');
