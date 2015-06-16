var expect = require('chai').expect;

describe('PlayerEntity', function() {
  before(function() {
    this.player = new game.PlayerEntity(0, 0, {
      name: 'Player',
      height: 64,
      width: 64,
      image: 'spritesheet',
      userName: 'Ricky',
      userId: '123',
      waitTime: 0
    });
  });

  describe('#init()', function() {
    it('starts with the will_join state', function() {
      expect(this.player.state).to.equal('will_join');
    });

    it('stores the users name', function() {
      expect(this.player.userName).to.equal('Ricky');
    });

    it('stores the users id', function() {
      expect(this.player.userId).to.equal('123');
    });
  });

  describe('#update()', function() {
    it('subtracts the delta time from the stateDuration', function() {
      this.player.stateDuration = 100;
      this.player.update(50);
      expect(this.player.stateDuration).to.equal(50);
    });

    context('when the stateDuration is zero or less', function() {
      beforeEach(function() {
        this.player.stateDuration = 0;
      });

      it('goes from will_join state to join state', function() {
        this.player.state = 'will_join';
        this.player.update(1);
        expect(this.player.state).to.equal('joining');
      });

      it('goes from joining state to idle state', function() {
        this.player.state = 'joining';
        this.player.update(1);
        expect(this.player.state).to.equal('idle');
      });

      it('goes from idle state to walking state', function() {
        this.player.state = 'idle';
        this.player.update(1);
        expect(this.player.state).to.equal('walking');
      });

      it('goes from walking state to idle state', function() {
        this.player.state = 'walking';
        this.player.update(1);
        expect(this.player.state).to.equal('idle');
      });
    });

    context('when not joining or leaving', function() {
      it('turns around when it reaches the left edge of the screen', function() {
        this.player.velocity = -3;
        this.player.pos.x = -1;
        this.player.state = 'walking';
        this.player.update(1);
        expect(this.player.velocity).to.equal(3);
      });

      it('turns around when it reaches the right edge of the screen', function() {
        this.player.velocity = 3;
        this.player.pos.x = 1920;
        this.player.state = 'walking';
        this.player.update(1);
        expect(this.player.velocity).to.equal(-3);
      });
    });
  });

  describe('#join()', function() {
    before(function() {
      this.player.join();
    });

    it('sets the state to joining', function() {
      expect(this.player.state).to.equal('joining');
    });

    it('sets the player x velocity to a positive number', function() {
      expect(this.player.velocity).to.be.above(0);
    });
  });

  describe('#idle()', function() {
    before(function() {
      this.player.idle();
    });

    it('sets the state to idle', function() {
      expect(this.player.state).to.equal('idle');
    });

    it('sets the player x velocity to zero', function() {
      expect(this.player.velocity).to.equal(0);
    });
  });

  describe('#walk()', function() {
    before(function() {
      this.previousVelocity = this.player.velocity;
      this.player.walk();
    });

    it('sets the state to walking', function() {
      expect(this.player.state).to.equal('walking');
    });

    it('changes the player x velocity', function() {
      expect(this.player.velocity).to.not.equal(this.previousVelocity);
    });
  });

  describe('#leave()', function() {
    before(function() {
      this.player.leave();
    });

    it('sets the state to leaving', function() {
      expect(this.player.state).to.equal('leaving');
    });

    it('sets the player x velocity to a negative number', function() {
      expect(this.player.velocity).to.be.below(0);
    });
  });
});
