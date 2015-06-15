'use strict';

var Slack = require('slack-client');
var Firebase = require('firebase');

class SlackBot {
  constructor() {
    this.slack = new Slack(process.env.SLACK_API_TOKEN, true, true);
    this.slack.on('open', this.onOpen.bind(this));
    this.slack.on('presenceChange', this.onUserChange.bind(this));
    this.slack.on('userChange', this.onUserChange.bind(this));
    this.slack.login();
  }
  // Listener methods for the RTM API.
  onOpen() {
    this.channelId = this.identifyChannel(this.slack.channels);
    this.channel = this.slack.channels[this.channelId];
    this.updateUserPresence(this.channel.members);
  }
  onUserChange(user) {
    this.updateUserPresence(this.channel.members);
  }
  // Data extraction.
  identifyChannel(channels) {
    for (var id in channels) {
      if (channels.hasOwnProperty(id) && channels[id].name == process.env.SLACK_CHANNEL) {
        return id;
      }
    }
  }
  updateUserPresence(members) {
    for (var userId of members) {
      var user = this.slack.getUserByID(userId);
      var dataRef = this.firebaseRef('users/' + userId);

      dataRef.update({ name: user.name, status: user.presence });
    }
  }
  // Utilities.
  firebaseRef(url) {
    return new Firebase(process.env.FIREBASE_URL + url);
  }
};

module.exports = SlackBot;
