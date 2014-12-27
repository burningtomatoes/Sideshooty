var Player = function() {
    this.position = { x: 25, y: 155};
    this.movementSpeed = 1;

    this.velocity = { x: 0, y: 0 };
    this.velocity.y = (Math.random() * -10) - 5; // random velocity to test gravity

    this.txBody = new Image();
    this.txBody.src = 'assets/textures/steve.png';

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

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += Map.gravity;
    };
};