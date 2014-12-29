var Map = {
    loaded: false,
    name: null,
    data: null,
    height: 0,
    width: 0,
    entities: [],
    gravity: 0,

    setData: function(data) {
        Map.name = data.title;
        Map.data = data.data;
        Map.height = data.height;
        Map.width = data.width;

        if (data.gravity) {
            Map.gravity = parseFloat(data.gravity);
        } else {
            Map.gravity = 0.5;
        }

        var x = 0;
        var y = 0;

        for (var i = 0; i < Map.data.length; i++) {
            if (x == Map.width) {
                x = 0;
                y++;
            }

            var tid = Map.data[i];

            if (tid == '1') {
                Map.add(new Block(x * 16, y * 16));
            }

            x++;
        }

        for (var i = 0; i < 10; i++) {
            Map.add(new Enemy());
        }

        Map.add(new Player());
    },

    clear: function() {
        Map.loaded = false;
        Map.entities = [];
        Map.data = null;
        Map.name = '';
    },

    add: function(entity) {
        Map.entities.push(entity);
    },

    remove: function(entity) {
        var index = Map.entities.indexOf(entity);

        if (index >= 0) {
            Map.entities.splice(index, 1);
            return true;
        }

        return false;
    },

    draw: function(ctx) {
        for (var i = 0; i < Map.entities.length; i++) {
            var entity = Map.entities[i];
            entity.draw(ctx);
        }
    },

    update: function() {
        for (var i = 0; i < Map.entities.length; i++) {
            var entity = Map.entities[i];
            entity.update();
        }
    }
};