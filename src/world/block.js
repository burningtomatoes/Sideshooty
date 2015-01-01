var Block = function(x, y) {
    this.position = { x: x, y: y};

    this.txBody = new Image();
    this.txBody.src = 'assets/textures/brickwall.png';
    this.renderSize = { w: 16, h: 16 };

    this.isBlock = true;
    this.collisionStatus = 'none';

    this.draw = function(ctx) {
        ctx.drawImage(this.txBody, 0, 0, this.renderSize.w, this.renderSize.h, Camera.translateX(this.position.x),
            Camera.translateY(this.position.y), this.renderSize.w, this.renderSize.h);

        if (window.DEBUG_PROJECTILES) {
            var sq = this.getRect();

            ctx.beginPath();
            ctx.rect(Camera.translateX(sq.left), Camera.translateY(sq.top), sq.width, sq.height);
            ctx.lineWidth = 1;

            if (this.collisionStatus == 'none') {
                ctx.strokeStyle = 'green';
            } else if (this.collisionStatus == 'intersects') {
                ctx.strokeStyle = 'blue';
            } else if (this.collisionStatus == 'blocks') {
                ctx.strokeStyle = 'red';
            } else {
                ctx.strokeStyle = 'brown';
            }

            ctx.stroke();
        }
    };

    this.update = function() {

    };

    this.getRect = function() {
        return {
            top: this.position.y,
            left: this.position.x,
            height: this.renderSize.h,
            width: this.renderSize.w,
            bottom: this.position.y + this.renderSize.h,
            right: this.position.x + this.renderSize.w
        };
    };
};