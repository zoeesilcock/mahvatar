window.game = {
  data: {},
  score: 0,
  firebase: null,
  players: {},

  onload: function() {
    // Initialize the video.
    if (!me.video.init(1440, 128, { wrapper: 'screen', transparent: true, scale: 1})) {
      alert('Your browser does not support HTML5 canvas.');
      return;
    }

    // Initialize the audio.
    me.audio.init('mp3,ogg');
    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);
    // Load the resources.
    me.loader.preload(game.resources);

    // add "//debug" to the URL to enable the debug Panel
    if (document.location.hash == '//debug') {
      window.onReady(function() {
        me.plugin.register.defer(this, me.debug.Panel, 'debug', me.input.KEY.V);
        return;
      });
    }

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);

    this.lastJoin = 0;
  },

  loaded: function() {
    me.state.set(me.state.PLAY, new game.PlayScreen());
    me.pool.register('Player', game.PlayerEntity);

    // Start the game.
    me.state.change(me.state.PLAY);

    this.firebase = new Firebase(FIREBASE_URL + '/users');

    this.firebase.on('child_added', this.userAdded);
    this.firebase.on('child_changed', this.userChanged);
    this.firebase.on('child_removed', this.userRemoved);
  },

  userAdded: function(userSnapshot) {
    var user = userSnapshot.val();
    user.id = userSnapshot.key();

    if (user.status == 'active') {
      game.addPlayer(user);
    }
  },

  userChanged: function(userSnapshot) {
    var user = userSnapshot.val();
    user.id = userSnapshot.key();

    if (user.status == 'active') {
      if (game.players[user.id]) {
        game.players[user.id].setUserDetails(user);
      } else {
        game.addPlayer(user);
      }
    } else {
      game.removePlayer(user);
    }
  },

  userRemoved: function(userSnapshot) {
    var user = userSnapshot.val();
    user.id = userSnapshot.key();

    game.removePlayer(user);
  },

  joiningPlayerCount: function() {
    var count = 0;

    for (var id in game.players) {
      var player = game.players[id];

      if (player.state == 'will_join') {
        count += 1;
      }
    }

    return count;
  },

  addPlayer: function(user) {
    var joinTime = 2000 * this.joiningPlayerCount();

    var player = new game.PlayerEntity(-128, -64, {
      name: 'Player',
      height: 64,
      width: 64,
      image: 'spritesheet',
      userDetails: user,
      waitTime: ((Date.now() - this.lastJoin) < joinTime) ? joinTime : 0
    });

    this.lastJoin = Date.now();
    me.game.world.addChild(player, 3);
    game.players[user.id] = player;
  },

  removePlayer: function(user) {
    var player = game.players[user.id];

    if (player) {
      player.leave();
    }
  }
};
