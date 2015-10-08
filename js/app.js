'use strict';

// Environment config variables
var config = {
    // Scalar values to multiply by player position
    MOVE_X_STEP: 101,
    MOVE_Y_STEP: 72,
    // Max position value
    MAX_X: 4,
    MAX_Y: 5
};

/*
 * Enemies our player must avoid
 */
var Enemy = function() {
    // Enemy sprite image
    this.sprite = 'images/enemy-bug.png';
    // Assign random x and y starting positions, speed
    this.init();
};

/*
 * Sets up initial variables for enemies
 */
Enemy.prototype.init = function(){
    // Assign position
    this.x = this.getRandomIntInclusive(0, 4);
    this.y = this.getRandomIntInclusive(1, 3);

    // Assign random speed
    this.speed = Math.random() + 0.05;
};

/*
 * Returns a random integer between min (included) and max (included)
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param min - lowest integer value in range (inclusive)
 * @param max - highest integer value in range (inclusive)
 */
Enemy.prototype.getRandomIntInclusive = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
 * Update the enemy's position, required method for game
 * @param dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // Check if collided with enemy
    if( Math.round(this.y) === player.y && Math.round(this.x) === player.x) {
        player.collision();
    }

    // Reset the position if needed
    if(Math.floor(this.x) >= config.MAX_X + 1) {
        this.x = -1;
        // Randomize the y position
        this.y = this.getRandomIntInclusive(1, 3);
    }

    // Multiply enemy movement by dt parameter
    this.x += this.speed * dt * (Math.floor((player.score + 1)/50) + 1);

    this.render();
};

/*
 * Draw the enemy on the screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 
        this.x * config.MOVE_X_STEP, 
        this.y * config.MOVE_Y_STEP);
};

/*
 * Our player class
 */
var Player = function(){
    // Player sprite image
    this.sprite = 'images/char-horn-girl.png';
    // Assign starting values
    this.init();
};

/*
 * Initializes our player
 */
Player.prototype.init = function(){
    // Init variables
    this.x_start = 2;
    this.y_start = config.MAX_Y;
    this.score_step = 10;

    // Assign init position
    this.x = this.x_start;
    this.y = this.y_start;

    // Assign init score
    this.score = 0;
};

/*
 * Collision deducts the score and resets the player
 */
Player.prototype.collision = function(){
    // Reduce score penalty
    this.score -= this.score_step / 5;
    // Reset the player
    this.reset();
};

/*
 * Scored increments the score and resets the player
 */
Player.prototype.scored = function(){
    // Augment the score
    this.score += this.score_step;
    // Reset the player
    this.reset();
};

/*
 * Resets the player's starting position
 */
Player.prototype.reset = function(){
    this.x = this.x_start;
    this.y = this.y_start;
};

/*
 * Check if Player has touched an Enemy or the Goal
 */
Player.prototype.update = function() {
    // Check if scored
    if( this.y === 0 ) {
        this.scored();
    }

    // Player must stay inside the board
    if(this.x > config.MAX_X) {
        this.x = config.MAX_X;
    }
    if(this.y > config.MAX_Y) {
        this.y = config.MAX_Y;
    }
    if(this.x < 0) {
        this.x = 0;
    }
    if(this.y < 0) {
        this.y = 0;
    }

    this.render();
};

/*
 * Draw the player on the screen
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 
        this.x * config.MOVE_X_STEP, 
        this.y * config.MOVE_Y_STEP);
    // Update score
    document.getElementById('score').innerHTML = this.score;
};

/*
 * Update the player's position, call update()
 */
Player.prototype.handleInput = function(move) {
    // Adjust the player's position values
    switch (move) {
        case 'left':
            this.x -= 1; break;
        case 'right':
            this.x += 1; break;
        case 'up':
            this.y -= 1; break;
        case 'down':
            this.y += 1; break;
    }
    this.update();
};


/*
 * Instantiate player and enemies.
 * All enemy objects are in <array> allEnemies
 * The player object is var player
 */
var allEnemies = [];
// Create arbitrary number of enemies
for (var i = 0; i < 6; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();

/*
 * Listens for key presses and sends the keys to Player.handleInput()
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
