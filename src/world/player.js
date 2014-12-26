var Player = function() {
    this.position = { x: 25, y: 25};
    this.movementSpeed = 1;

    this.txBody = new Image();
    this.txBody.src = 'assets/steve.png';

    this.draw = function(ctx) {
        ctx.drawImage(this.txBody, 0, 0, 15, 20, this.position.x, this.position.y, 15, 20);
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