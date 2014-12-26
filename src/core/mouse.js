var Mouse = {
    currentPos: { x: 0, y: 0 },
    lastPos: { x: 0, y: 0 },

    clear: function() {
        Mouse.currentPos = { x: 0, y: 0 };
        Mouse.lastPos = { x: 0, y: 0 };
    },

    bind: function() {
        Mouse.clear();

        $(window).mousemove(function(e) {
            Mouse.currentPos = { x: e.pageX, y: e.pageY }
        });
    },

    update: function() {
        Mouse.lastPos = { x: Mouse.currentPos.x, y: Mouse.currentPos.y };
    }
};