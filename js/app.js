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
    this.highestScore = 0;
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
 * Increments the score and resets the player
 * @param value - the amount to add to player's score
 * @param reset - boolean, whether to reset player
 */
Player.prototype.scored = function(value, reset){
    // Augment the score
    this.score += value;
    if (this.score > this.highestScore) {
        this.highestScore = this.score;
    }
    // Check for special
    var pts = this.score - (this.score % 10);
    special.activate(pts);

    if (reset) { this.reset(); }
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
        this.scored(this.score_step, true);
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
    document.getElementById('highest').innerHTML = this.highestScore;
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
 * A special bonus point
 */
var Special = function(){
    // Not active to start
    this.active = false;
    // Sprite image
    this.sprite = 'images/Star.png';
    // The amount added to player's score
    this.value = 25;
    // Initial position
    this.x = -1;
    this.y = Enemy.prototype.getRandomIntInclusive(1, 3);
    // Initial speed
    this.speed = Math.random() * 0.5 + 0.1;
    // Tracks special milestones
    this.milestones = [];
};

/*
 * Activate a bonus star when a score is divisible by 100
 * @param pts - the player's score when invoked
 */
Special.prototype.activate = function(pts){
    // Reject if pts is zero
    if (pts === 0) { return; }
    // Reject if not divisible by 100
    if (pts % 100 !== 0) { return; }
    // Reject if score has alread received special
    if (this.milestones.indexOf(pts) !== -1) { return; }
    // Generate a new special
    this.active = true;
    // Prevents special from re-appearing for given score
    this.milestones.push(pts);
};

/*
 * Resets the special
 */
Special.prototype.reset = function(){
    this.active = false;
    this.x = -1;
    // Randomize the y position for next time
    this.y = Enemy.prototype.getRandomIntInclusive(1, 3);
    // Randomize the speed again with scalar multiplier
    this.speed = Math.random() * 0.5 + 0.1 * this.milestones.length;
};

/*
 * Updates the special's state and location
 * @param dt - a time delta between ticks
 */
Special.prototype.update = function(dt){
    if (this.active) {
        // if special was earned
        if( Math.round(this.y) === player.y && Math.round(this.x) === player.x) {
            this.reset();
            player.scored(this.value);
        }

        // if special left the game board
        if(Math.floor(this.x) >= config.MAX_X + 1) {
            this.reset();
        }

        // Multiply star movement by dt parameter
        this.x += this.speed * dt;

        this.render();
    }
};

/*
 * Render the special's position
 */
Special.prototype.render = function(){
    if (this.active) {
        ctx.drawImage(Resources.get(this.sprite), 
            this.x * config.MOVE_X_STEP, 
            this.y * config.MOVE_Y_STEP);
    }
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
var special = new Special();
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
