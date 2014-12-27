var Player = function() {
    this.position = { x: 25, y: 155};
    this.movementSpeed = 1;

    this.velocity = { x: 0, y: 0 };

    this.txBody = new Image();
    this.txBody.src = 'assets/textures/steve.png';

    this.draw = function(ctx) {
        ctx.drawImage(this.txBody, 0, 0, 15, 20, Math.round(this.position.x), Math.round(this.position.y), 15, 20);
    };

    this.update = function() {
        if (Keyboard.isKeyDown(KeyEvent.DOM_VK_LEFT)) {
            this.position.x -= this.movementSpeed;
        }

        if (Keyboard.isKeyDown(KeyEvent.DOM_VK_RIGHT)) {
            this.position.x += this.movementSpeed;
        }

        if (Keyboard.wasKeyPressed(32)) {
            console.log('jump');
            this.velocity.y = (Math.random() * -10) - 5;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += Map.gravity;

        var bounds = this.getRect();

        if (bounds.bottom > Renderer.canvas.height) {
            this.velocity.y = 0;
            this.position.y = Renderer.canvas.height - bounds.height;
        }
    };

    this.getRect = function() {
        return {
            top: this.position.y,
            left: this.position.x,
            height: 20,
            width: 15,
            bottom: this.position.y + 20,
            right: this.position.x + 15
        };
    };
};