'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _skygear = require('skygear');

var _skygear2 = _interopRequireDefault(_skygear);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserChannel = _skygear2.default.Record.extend('user_channel');

/**
 * SkygearChatPubsub is a class for dsipatching the message from user_channel
 * to the coorrect handler according to the event type and registeration
 */

var SkygearChatPubsub = function () {
  function SkygearChatPubsub(container) {
    _classCallCheck(this, SkygearChatPubsub);

    this.pubsub = container.pubsub;
    this.userChannel = null;
    this.dispatch = this.dispatch.bind(this);
    this.getUserChannel().then(this.subscribeDispatch.bind(this));
    this.typingHandler = {};
    this.allTypingHandler = [];
    this.messageHandler = [];
  }

  _createClass(SkygearChatPubsub, [{
    key: 'subscribeDispatch',
    value: function subscribeDispatch(channel) {
      this.pubsub.on(channel.name, this.dispatch);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(payload) {
      if (payload.event === 'typing') {
        this.dispatchTyping(payload.data);
      } else {
        this.dispatchUpdate(payload.data);
      }
    }
  }, {
    key: 'dispatchUpdate',
    value: function dispatchUpdate(data) {
      var obj = {
        record_type: data.record_type,
        event_type: data.event_type
      };
      obj.record = new _skygear2.default.Record(data.record_type, data.record);
      if (data.original_record) {
        obj.original_record = new _skygear2.default.Record(data.record_type, data.original_record);
      }
      _underscore2.default.forEach(this.messageHandler, function (handler) {
        handler(obj);
      });
    }
  }, {
    key: 'dispatchTyping',
    value: function dispatchTyping(data) {
      _underscore2.default.forEach(this.allTypingHandler, function (ah) {
        ah(data);
      });
      _underscore2.default.forEach(data, function (t, conversationID) {
        var handlers = this.typingHandler[conversationID];
        _underscore2.default.forEach(handlers, function (h) {
          h(t);
        });
      }.bind(this));
    }
  }, {
    key: 'sendTyping',
    value: function sendTyping(conversation, state) {
      _skygear2.default.lambda('chat:typing', [conversation._id, state, new Date()]);
    }
  }, {
    key: 'subscribeAllTyping',
    value: function subscribeAllTyping(handler) {
      this.allTypingHandler.push(handler);
    }
  }, {
    key: 'subscribeTyping',
    value: function subscribeTyping(conversation, handler) {
      if (!this.typingHandler[conversation.id]) {
        this.typingHandler[conversation.id] = [];
      }
      this.typingHandler[conversation.id].push(handler);
    }
  }, {
    key: 'unsubscribeTyping',
    value: function unsubscribeTyping(conversation, handler) {
      var conversationHandler = this.typingHandler[conversation.id];
      if (!conversationHandler) {
        return;
      }
      var index = conversationHandler.indexOf(handler);
      if (!handler || index === -1) {
        this.typingHandler[conversation.id] = [];
      } else {
        conversationHandler.splice(index, 1);
      }
    }
  }, {
    key: 'subscribeMessage',
    value: function subscribeMessage(handler) {
      this.messageHandler.push(handler);
    }
  }, {
    key: 'unsubscribeMessage',
    value: function unsubscribeMessage(handler) {
      var index = this.messageHandler.indexOf(handler);
      if (!handler || index === -1) {
        this.messageHandler = [];
      } else {
        this.messageHandler.splice(index, 1);
      }
    }
  }, {
    key: 'getUserChannel',
    value: function getUserChannel() {
      if (this.userChannel) {
        return Promise.resolve(this.userChannel);
      }
      var query = new _skygear2.default.Query(UserChannel);
      return _skygear2.default.privateDB.query(query).then(function (records) {
        if (records.length > 0) {
          this.userChannel = records[0];
          return this.userChannel;
        }
        return null;
      }.bind(this)).then(function (record) {
        if (record === null) {
          var channel = new UserChannel();
          channel.name = _uuid2.default.v4();
          return _skygear2.default.privateDB.save(channel);
        }
        this.userChannel = record;
        return this.userChannel;
      }.bind(this));
    }
  }]);

  return SkygearChatPubsub;
}();

exports.default = SkygearChatPubsub;