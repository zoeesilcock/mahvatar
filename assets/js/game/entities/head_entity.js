game.HeadEntity = me.Entity.extend({
  init: function(x, y, settings) {
    settings.height = 32;
    settings.width = 32;

    this._super(me.Entity, 'init', [ x, y, settings ]);

    this.alwaysUpdate = true;
    this.player = settings.playerEntity;

    this.renderable.addAnimation('face', [ 0 ]);
    this.renderable.setCurrentAnimation('face');
  },

  update: function(dt) {
    this.pos.x = this.player.pos.x + (32 / 2);
    this.pos.y = this.player.pos.y;
  }
});
