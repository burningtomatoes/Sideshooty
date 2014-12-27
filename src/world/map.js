var Map = {
    loaded: false,
    name: null,
    data: null,
    height: 0,
    width: 0,
    entities: [],

    setData: function(data) {
        Map.name = data.title;
        Map.data = data.data;
        Map.height = data.height;
        Map.width = data.width;

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