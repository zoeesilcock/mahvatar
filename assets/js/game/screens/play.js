game.PlayScreen = me.ScreenObject.extend({
  onResetEvent: function() {
    game.data.score = 0;

    me.levelDirector.loadLevel('map');
  },

  onDestroyEvent: function() {
    me.game.world.removeChild(this.HUD);
  }
});
