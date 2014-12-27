var Block = function(x, y) {
    this.position = { x: x, y: y};

    this.txBody = new Image();
    this.txBody.src = 'assets/textures/brickwall.png';

    this.draw = function(ctx) {
        ctx.drawImage(this.txBody, 0, 0, 16, 16, this.position.x, this.position.y, 16, 16);
    };

    this.update = function() {

    };
};