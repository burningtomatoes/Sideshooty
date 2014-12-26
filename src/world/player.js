var Player = function() {
    this.position = { x: 0, y: 0};

    this.texture = new Image();
    this.texture.src = 'assets/steve.png';

    this.draw = function(ctx) {
        ctx.drawImage(this.texture, 0, 0, 15, 20, 50, 50, 15, 20);
    };

    this.update = function() {

    };
};