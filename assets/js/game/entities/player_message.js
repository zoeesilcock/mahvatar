game.PlayerMessage = game.PlayerMessage || {};
game.PlayerMessage.Container = me.Container.extend({
  init: function(playerEntity) {
    this._super(me.Container, 'init');
    this.floating = true;
    this.z = Infinity;
    this.player = playerEntity;
    this.timeout = null;

    this.messages = [];
    this.keys = [];

    this.messageLabel = new game.PlayerMessage.Label(0, -50);
    this.messageBackground = new game.PlayerMessage.Background(this.pos.x, this.pos.y, 0, 0);

    this.firebase = new Firebase(FIREBASE_URL + '/users/' + this.player.userId + '/messages');
    this.firebase.on('child_added', function(messageSnapshot) {
      this.messages.push(messageSnapshot.val());
      this.keys.push(messageSnapshot.key());
    });
  },

  draw: function(renderer) {
    if (!this.currentMessage && this.messages && this.messages.length > 0) {
      this.currentMessage = this.messages.shift();
      this.currentMessageKey = this.keys.shift();
    }

    if (this.currentMessage && this.currentMessage.length > 0) {
      var labelSize = this.messageLabel.label.measureText(renderer, this.currentMessage);

      this.pos.x = this.player.pos.x + 64;
      this.pos.y = this.player.pos.y;
      this.messageBackground.width = labelSize.width + 10;
      this.messageBackground.height = labelSize.height + 15;
      this.messageLabel.message = this.currentMessage;

      this.messageBackground.draw(renderer, this.pos.x - 5, this.pos.y - 5);
      this.messageLabel.draw(renderer, this.pos.x, this.pos.y);

      if (!this.timeout) {
        this.timeout = window.setTimeout(function() {
          this.firebase.child(this.currentMessageKey).set(null);
          this.currentMessage = null;
          this.timeout = null;
        }, 5000);
      }
    }
  }
});

game.PlayerMessage.Label = me.Renderable.extend({
  init: function(x, y) {
    this._super(me.Renderable, 'init', [ x, y, 0, 14 ]);
    this.label = new me.Font('Verdana', 12, 'black');
  },

  draw: function(renderer, x, y) {
    this.label.draw(renderer, this.message, x, y);
  }
});

game.PlayerMessage.Background = me.Renderable.extend({
  init: function(x, y, w, h) {
    this._super(me.Renderable, "init", [x, y, w, h]);
    this.color = new me.Color(255, 255, 255);
    this.z = 0;
  },

  draw: function(renderer, x, y) {
    renderer.setColor(this.color);
    renderer.fillRect(x, y, this.width, this.height);
  }
});
