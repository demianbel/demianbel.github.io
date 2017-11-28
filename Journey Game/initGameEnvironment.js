var volume = 0.01;
var ambientSound = pjs.audio.newAudio('sounds/ambient/forest_birds.mp3', volume);
pjs.system.setTitle('Journey Game'); // Set Title for Tab or Window
pjs.mouseControl.setCursorImage('images/cursors/default_cursor.png');
var previousLoop = [];
// create player
const player = {
  health: 100,
  maxHealth: 100,
  def: 0,
  name: 'Evgeniy',
  inventory: [],
  inventoryMaxSize: 16
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
  file: 'images/buttons/back_button.png',
  x: 5,
  y: 5,
  w: 40,
  h: 40,
});

var returnOnPreviousLoop = function() {
  var index = previousLoop.length - 1;
  var goTo = previousLoop[index];
  previousLoop.splice(index, 1);
  game.setLoop(goTo);
};
