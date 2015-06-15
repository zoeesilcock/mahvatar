game.PlayerEntity = me.Entity.extend({
  init: function(x, y, settings) {
    this._super(me.Entity, 'init', [ x, y, settings ]);

    this.stateDuration = settings.waitTime;
    this.setUserDetails(settings.userDetails);

    this.state = 'will_join';
    this.velocity = 0;

    this.alwaysUpdate = true;
    this.renderable.addAnimation('stand', [ 1 ]);
    this.renderable.setCurrentAnimation('stand');

    var size = this.body.getBounds().width;
    this.body.addShape(new me.Rect(0, 0, size, size));

    this.nameContainer = new game.PlayerName.Container(this);
    me.game.world.addChild(this.nameContainer, 5);

    this.messageContainer = new game.PlayerMessage.Container(this);
    me.game.world.addChild(this.messageContainer, 5);
  },

  setUserDetails: function(details) {
    oldHead = this.headPath;

    this.userId = details.id;
    this.userName = details.name;
    this.headPath = details.head;
    this.messages = details.messages;

    if (oldHead != this.headPath) {
      if (this.headPath && this.headPath.length) {
        // this.loadHeadResource();
        this.createHeadEntity('default_head');
      } else {
        this.createHeadEntity('default_head');
      }
    }
  },

  loadHeadResource: function() {
    imageName = 'custom_head_' + this.userId;

    me.loader.load({
      name: imageName,
      type: 'image',
      src: this.headPath
    }, function() {
      this.createHeadEntity(imageName);
    });
  },

  createHeadEntity: function(imageName) {
    if (this.headEntity) {
      me.game.world.removeChild(this.headEntity);
    }

    this.headEntity = new game.HeadEntity(this.x, this.y, { playerEntity: this, image: imageName });
    me.game.world.addChild(this.headEntity, 5);
  },

  update: function(dt) {
    this.stateDuration -= dt;

    if (this.state == 'will_join' && this.stateDuration <= 0) {
      this.join();
    }

    if (this.state == 'joining' && this.stateDuration <= 0) {
      this.idle();
    }

    if (this.state == 'idle' && this.stateDuration <= 0) {
      this.walk();
    }

    if (this.state == 'walking' && this.stateDuration <= 0) {
      this.idle();
    }

    if ((this.leavingLeftSide() || this.leavingRightSide()) && (this.state != 'joining' && this.state != 'leaving')) {
      // Don't leave the edge of the area.
      this.velocity = -this.velocity;
    }

    if (this.state == 'leaving' && this.pos.x < -128) {
      me.game.world.removeChild(this);
      delete(game.players[this.userId]);
    }

    this.body.vel.x = (this.velocity * dt) / 10;

    this.body.update(dt);
    me.collision.check(this);
    this._super(me.Entity, 'update', [dt]);

    return true;
  },

  leavingLeftSide: function() {
    return this.pos.x < 0 && this.velocity < 0;
  },

  leavingRightSide: function() {
    return this.pos.x > (me.game.viewport.width - this.body.getBounds().width) && this.velocity > 0;
  },

  join: function() {
    this.state = 'joining';
    this.stateDuration = Number.prototype.random(1000, 2000);
    this.velocity = 2;
  },

  idle: function() {
    this.state = 'idle';
    this.stateDuration = Number.prototype.random(2000, 8000);
    this.velocity = 0;
  },

  walk: function() {
    this.state = 'walking';
    this.velocity = Number.prototype.random(-15, 15) / 10;
    this.stateDuration = Number.prototype.random(3000, 6000);
  },

  leave: function() {
    this.velocity = -3;
    this.state = 'leaving';
  },

  onCollision: function(response, other) {
    other.name == 'Player' ? false : true
  }
});
