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
//var ambientSound = pjs.audio.newAudio('sounds/background.mp3', 0.1);
pjs.system.setTitle('Happy New Year');
var vk_inited = false;
VK.init(function() { 
	vk_inited = true;
	log('vk inited');
 });
var name = false;
game.newLoopFromConstructor('newYear', function() {
	var counter = 0;
	var bg = game.newImageObject({
	    file: 'images/greetings.jpg',
	    x: 0,
	    y: 0,
	    w: 640,
	    h: 480,
	});
	
	var newGameText = game.newTextObject({
		 	positionC : point(width / 2 , height / 2),
		    size: 40, // size text
		    color: '#0a0a0a', // color text
		    text: 'С Новым Годом!', // label
		    font: 'Arial' // font family
	});

	var snowflakes = [];
	 
	this.update = function() {
		game.clear();
		if (vk_inited && name){
		log('enter to name init')
		VK.api('account.getProfileInfo', {},function(data){
			log(data);
			if(data.response) {
				log(data.response.toString());
				name = data.response.first_name;
				log(name);
			}
		});
		}
		if(vk_inited) {
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
		newGameText.draw();
		OOP.forArr(snowflakes, function(val, i, arr) {
			val.draw();
			val.y = val.y + 0.5;
			val.x = val.x + 0.25;
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

game.startLoop('newYear');
