game.PlayerName = game.PlayerName || {};
game.PlayerName.Container = me.Container.extend({
  init: function(playerEntity) {
    this._super(me.Container, 'init');
    this.floating = true;
    this.z = Infinity;
    this.player = playerEntity;

    this.nameLabel = new game.PlayerName.Label(0, -50);
    this.nameBackground = new game.PlayerName.Background(this.pos.x, this.pos.y, 0, 20);
  },

  draw: function(renderer) {
    labelSize = this.nameLabel.label.measureText(renderer, this.player.userName);
    this.pos.x = this.player.pos.x + 32 - (labelSize.width / 2);
    this.pos.y = this.player.pos.y + 64;
    this.nameBackground.width = labelSize.width + 10;
    this.nameLabel.userName = this.player.userName;

    this.nameBackground.draw(renderer, this.pos.x - 5, this.pos.y);
    this.nameLabel.draw(renderer, this.pos.x, this.pos.y);
  }
});

game.PlayerName.Label = me.Renderable.extend({
  init: function(x, y) {
    this._super(me.Renderable, 'init', [ x, y, 0, 14 ]);
    this.label = new me.Font('Verdana', 14, 'black');
  },

  draw: function(renderer, x, y) {
    this.label.draw(renderer, this.userName, x, y);
  }
});

game.PlayerName.Background = me.Renderable.extend({
  init: function(x, y, w, h) {
    this._super(me.Renderable, "init", [x, y, w, h]);
    this.color = new me.Color(167, 183, 229);
    this.z = 0;
  },

  draw: function(renderer, x, y) {
    renderer.setColor(this.color);
    renderer.fillRect(x, y, this.width, this.height);
  }
});
