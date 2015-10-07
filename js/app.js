// Environment config variables
var config = {
    move_x_step: 101,
    move_y_step: 86,
    max_x: 4,
    max_y: 6,
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.move_step = 101;
    // Assign random x and y starting positions
    this.x = Math.random() * 5;
    this.y = Math.random() * 3;
    // Assign random speed
    this.speed = Math.random() * 5;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    // Reset the position if needed
    if(this.x >= config.max_x) {
        this.x -= config.max_x;
    }
    if(this.y >= config.max_y) {
        this.y -= config.max_y;
    }

    this.render();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 
        this.x * config.move_x_step, 
        this.y * config.move_y_step);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    // Init variables
    this.sprite = 'images/char-horn-girl.png';
    this.move_x_step = 101;
    this.move_y_step = 86;
    this.x_start = 2;
    this.y_start = 3;
    this.x = this.x_start;
    this.y = this.y_start;
    this.score = 0;
    this.score_step = 10;
}

// Check if Player has touched an Enemy or the Goal
Player.prototype.update = function() {
    // Check if collided with enemy
    allEnemies.forEach(function(en){
        if( en.x === this.x && en.y === this.y ) {
            // We're dead
            this.x = this.x_start;
            this.y = this.y_start;
            this.score -= this.score_step / 5;
        }
    });

    // Check if scored
    if( this.y === 1 ) {
        this.x = this.x_start;
        this.y = this.y_start;
        this.score += this.score_step;
    }

    this.render();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 
        this.x * config.move_x_step, 
        this.y * config.move_y_step);
};

// Update the player's position, call update()
Player.prototype.handleInput = function(move) {
    switch (move) {
        case 'left':
            this.x -= 1;
            break;
        case 'right':
            this.x += 1;
            break;
        case 'up':
            this.y -= 1;
            break;
        case 'down':
            this.y += 1;
            break;
    }
    this.update();
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 5; i++) {
    allEnemies.push(new Enemy());
};
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
