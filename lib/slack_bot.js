'use strict';

var Slack = require('slack-client');

class SlackBot {
  constructor() {
    this.slack = new Slack(process.env.SLACK_API_TOKEN, true, true);
    this.slack.on('open', this.onOpen.bind(this));
    this.slack.login();
  }
  onOpen() {
    this.channelId = this.identifyChannel(this.slack.channels);
  }
  identifyChannel(channels) {
    for (var id in channels) {
      if (channels.hasOwnProperty(id) && channels[id].name == process.env.SLACK_CHANNEL) {
        return id;
      }
    }
  }
};

module.exports = SlackBot;
