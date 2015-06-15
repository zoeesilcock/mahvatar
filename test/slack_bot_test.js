var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').expect;

var SlackBot = require('../lib/slack_bot');
var Slack = require('slack-client');

chai.use(sinonChai);

describe('SlackBot', function() {
  before(function() {
    this.firebaseStub = {
      update: sinon.stub()
    };

    sinon.stub(Slack.prototype, 'login');
    sinon.stub(SlackBot.prototype, 'firebaseRef').returns(this.firebaseStub);
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

  describe('updateUserPresence', function() {
    it('sends user data to firebase', function() {
      var testUsers = ['userid'];
      var testUser = {
        name: 'some great person',
        presence: true
      };
      sinon.stub(Slack.prototype, 'getUserByID').returns(testUser);

      this.bot.updateUserPresence(testUsers);
      expect(this.firebaseStub.update).to.be.calledWith({
        name: testUser.name,
        status: testUser.presence
      });
    });
  });
});
