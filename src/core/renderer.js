var Renderer = {
    $canvas: null,
    canvas: null,
    context: null,

    entities: [],

    start: function() {
        console.info('[Renderer] Game is starting, starting loop.');

        // Find the Canvas element we will be drawing to and retrieve the drawing context
        Renderer.$canvas = $('#game');
        Renderer.canvas = Renderer.$canvas[0];
        Renderer.context = Renderer.canvas.getContext('2d');

        console.info('[Renderer] Canvas resolution is ' + Renderer.canvas.width + 'x' + Renderer.canvas.height + '.');

        // Try to disable the "smooth" (stretched becomes blurry) scaling on the Canvas element
        // Instead, we want a "pixelated" effect (nearest neighbor scaling)
        Renderer.canvas.mozImageSmoothingEnabled = false;
        Renderer.canvas.webkitImageSmoothingEnabled = false;
        Renderer.canvas.msImageSmoothingEnabled = false;
        Renderer.canvas.imageSmoothingEnabled = false;

        // Load map
        Renderer.loadMap();

        // Begin the loop
        var loop = function() {
            window.requestAnimationFrame(loop);

            Renderer.update();
            Renderer.draw();
        };

        loop();

        // Fade in the canvas
        Renderer.$canvas.fadeIn();
    },

    loadMap: function() {
        Renderer.entities.push(new Player());
    },

    update: function() {
        // Update everything
        for (var i = 0; i < Renderer.entities.length; i++) {
            var entity = Renderer.entities[i];
            entity.update();
        }
    },

    draw: function() {
        // Draw everything
        Renderer.context.fillStyle = "#086A87";
        Renderer.context.fillRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);

        for (var i = 0; i < Renderer.entities.length; i++) {
            var entity = Renderer.entities[i];
            entity.draw(Renderer.context);
        }
    }
};