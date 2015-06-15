var expect = require('chai').expect;
var SlackBot = require('../lib/slack_bot');

describe('SlackBot', function() {
  it('can be instatiated', function() {
    var bot = new SlackBot();
    expect(bot).to.not.be.undefined;
  });
});
