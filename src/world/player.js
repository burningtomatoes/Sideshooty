var Player = function() {
    this.position = { x: 20, y: 20};
    this.movementSpeed = 1;

    this.texture = new Image();
    this.texture.src = 'assets/steve.png';

    this.draw = function(ctx) {
        ctx.drawImage(this.texture, 0, 0, 15, 20, this.position.x, this.position.y, 15, 20);
    };

    this.update = function() {
        if (Keyboard.isKeyDown(KeyEvent.DOM_VK_LEFT)) {
            this.position.x -= this.movementSpeed;
        }

        if (Keyboard.isKeyDown(KeyEvent.DOM_VK_RIGHT)) {
            this.position.x += this.movementSpeed;
        }
    };
};