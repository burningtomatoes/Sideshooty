/**
 * The main game class, which is responsible for managing the update/draw loop.
 * Other components are responsible for actually putting things on the screen.
 */
var Renderer = {
    $canvas: null,
    canvas: null,
    context: null,

    /**
     * Binds to the canvas element on the page, configures it and begins the update/render loop.
     * NB: This function should normally only be called once (when the game is starting).
     */
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

        // Begin the loop
        var loop = function() {
            window.requestAnimationFrame(loop);

            Renderer.update();
            Renderer.draw();
        };

        loop();
    },

    /**
     * Loads a specific map to be the current game map.
     *
     * @param mapId The filename of the map
     * @param callback The callback to be invoked when the map is fully loaded and ready to render
     */
    loadMap: function(mapId, callback) {
        if (callback == null) {
            callback = function() { };
        }

        console.info('[Maps] Loading map', mapId);

        var doDownload = function() {
            Map.clear();

            $.get('assets/maps/' + mapId + '.json')
                .success(function(data) {
                    Map.setData(data);
                    console.info('[Maps] Successfully loaded map from file, fading in...');
                    Renderer.$canvas.fadeIn(function() {
                        $('#hud').show();
                    });
                    callback(true);
                })
                .error(function() {
                    console.error('[Maps] Could not load map due to a network error', mapId);
                    callback(false);
                });
        };

        // If the canvas element is visible, fade it out and then download.
        // If it is not visible (e.g. the game is starting, begin download immediately).
        if (Renderer.$canvas.is(':visible')) {
            Renderer.$canvas.fadeOut('slow', doDownload);
            $('#hud').hide();
        } else {
            doDownload();
        }
    },

    /**
     * Updates all entities on the screen.
     * This function is responsible for performing all calculations, before the frame is drawn.
     */
    update: function() {
        // Process the map and the entities on it
        Map.update();
        // Update input
        Keyboard.update();
    },

    /**
     * Renders one frame to the render context.
     * This function is responsible for drawing everything, based on the states set in the update function.
     */
    draw: function() {
        // Clear the screen with a solid color
        Renderer.context.fillStyle = "#086A87";
        Renderer.context.fillRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);
        // Render map entities on top
        Map.draw(Renderer.context);
    }
};