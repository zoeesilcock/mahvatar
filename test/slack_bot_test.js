var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').expect;
var Slack = require('slack-client');
var SlackBot = require('../lib/slack_bot');

chai.use(sinonChai);

describe('SlackBot', function() {
  before(function() {
    sinon.stub(Slack.prototype, 'login');
  });

  beforeEach(function() {
    this.bot = new SlackBot();
  });

  describe('constructor', function() {
    it('can be instatiated', function() {
      expect(this.bot).to.be.an.instanceof(SlackBot);
    });

    it('connects to the slack api', function() {
      expect(this.bot.slack).to.be.an.instanceof(Slack);
      expect(this.bot.slack.login).to.have.been.called;
    });
  });

  describe('identifyChannel', function() {
    it('extracts the channel ID from the slack data', function() {
      var testData = {
        'my super sweet test id': { name: 'mahvatar' },
        'some other id': { name: 'who cares' }
      };

      expect(this.bot.identifyChannel(testData)).to.equal('my super sweet test id');
    });
  });
});
