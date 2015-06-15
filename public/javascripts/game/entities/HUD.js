game.HUD = game.HUD || {};
game.HUD.Container = me.Container.extend({
  init: function() {
    // call the constructor
    this._super(me.Container, 'init');
    // persistent across level change
    this.isPersistent = true;
    // make sure we use screen coordinates
    this.floating = true;
    // make sure our object is always draw first
    this.z = Infinity;
    // give a name
    this.name = 'HUD';
    // add our child score object at the top left corner
    this.addChild(new game.HUD.ScoreItem(5, 5));
  }
});

game.HUD.ScoreItem = me.Renderable.extend({
  init: function(x, y) {
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, 'init', [ x, y, 10, 10 ]);
    // local copy of the global score
    this.score = -1;
    this.nameLabel = new me.Font('Verdana', 32, 'white');
    this.name = game.data.name;
  },

  update: function() {
    if (this.name != game.data.name) {
      this.name = game.data.name;
      return true;
    }

    return false;
  },

  draw: function(renderer) {
    this.nameLabel.draw(renderer, this.name, this.pos.x, this.pos.y);
  }
});
