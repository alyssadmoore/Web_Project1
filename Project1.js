// As usual, small "main" method sets up components of runner and starts game
function startGame() {
  runner = new component(32, 32, "running-person.png", 20, 150, "image")
  gameArea.start();
}

/* Game area class contains canvas element, along with
   start, clear, and stop functions to manipulate canvas */
var gameArea = {
  canvas : document.createElement("canvas"),

  /* Start method creates canvas, sets it before all other elements on page,
     sets interval at which to update the game area (20 times a second) */
  start : function() {
    this.canvas.width = 400;
    this.canvas.height = 200;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/* Represents some object in the game area; right now that is only the
   runner. Will be reused later to incorporate obstacles/powerups/etc.
   Includes methods update, newPosition and hitVerticalBound */
function object(width, height, color, x, y, type) {
  this.type = type;
  // Runner: only component of "image" type
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  // Size of component (runner, powerup, obstacle, etc.)
  this.width = width;
  this.height = height;
  // Placement of component
  this.x = x;
  this.y = y;
  // Speed at which the component is moving
  this.speedX = 0;
  this.speedY = 0;
  // Gravity placed upon the component
  this.gravity = 0.05;
  // Change in gravity (aka velocity)
  this.gravitySpeed = 0;

  // Redraws the runner (can be reused to redraw obstacles)
  this.update = function() {
      context = gameArea.context;
      if (type == "image") {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
  }

  /* Decides the new position of the runner; also checks whether or not
     runner has gone off the game area above or below */
  this.newPosition = function() {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitVerticalBound();
  }

  // Stops the runner when they hit the edge of the canvas
  this.hitVerticalBound = function() {
    var floor = gameArea.canvas.height - this.height;
    var ceiling = 0;
    // If the runner hits the floor, change the icon back to a running person
    if (this.y > floor) {
      runner.image.src = "running-person.png";
      this.y = floor;
      this.gravitySpeed = 0;
    }
    // As long as the runner stays in the air, don't change the icon
    if (this.y < ceiling) {
        this.y = ceiling;
        this.gravitySpeed = 0;
    }
  }
}

// Every time game area is updated we clear the screen,
// decide new position(s), then redraw the game area
function updateGameArea() {
  gameArea.clear();
  runner.newPosition();
  runner.update();
}

/* When the runner jumps, their image changes to a jumping person
   and gravity is changed on mouseup and mousedown */
function jump(n) {
  runner.image.src = "jumping_person.png";
  runner.gravity = n;
}
