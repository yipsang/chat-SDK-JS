'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.afterMessageSent = afterMessageSent;
exports.afterMessageUpdated = afterMessageUpdated;
exports.afterMessageDeleted = afterMessageDeleted;
exports.typingStarted = typingStarted;
exports.afterConversationCreated = afterConversationCreated;
exports.afterConversationUpdated = afterConversationUpdated;
exports.afterConversationDeleted = afterConversationDeleted;
exports.afterUsersAddedToConversation = afterUsersAddedToConversation;
exports.afterUsersRemovedFromConversation = afterUsersRemovedFromConversation;
/**
 * Copyright 2017 Oursky Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var skygearCloud = require('skygear/cloud');
var skygear = require('skygear');
var Conversation = skygear.Record.extend('conversation');
var User = skygear.Record.extend('user');
var Message = skygear.Record.extend('message');
var container = new skygearCloud.CloudCodeContainer();
container.apiKey = skygearCloud.settings.apiKey;
container.endPoint = skygearCloud.settings.skygearEndpoint + '/';

function chatHook(name, func) {
  skygearCloud.op('chat:' + name + '_hook', function (param, options) {
    var context = { userId: options.context.user_id };
    func(param.args, context);
    return { status: 'ok' };
  }, {
    userRequired: true,
    keyRequired: true
  });
}

/**
 * After message sent hook.
 *
 * This hook will be triggered once a message is sent by an user.
 *
 * @example
 * const hook = require('skygear-chat/hook');
 * hook.afterMessageSent((message, conversation, participants, context) => {
 *   const title = conversation.title;
 *   const participantIds = participants.map((p) => p._id && p._id != context.userId);
 *   const currentUser = participants.find((p) => p._id == context.userId);
 *   let body = '';
 *   if (message.body) {
 *     body = currentUser.username + ": " + message.body;
 *   } else {
 *     body = currentUser.username + ":" + "sent you a file.";
 *   }
 *   const payload = {'gcm': {'notification': {'title': title, 'body': body}}}
 *   container.push.sendToUser(participantIds, payload);
 * });
 *
 * @param {function(message:Record, conversation:Record, participants:Record[], context:Object)} func - function to be registered
 */

function afterMessageSent(func) {
  chatHook('after_message_sent', function (args, context) {
    var message = new Message(args.message);
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    func(message, conversation, participants, context);
  });
}

/**
 * After message updated hook.
 *
 * This hook will be triggered once a message is updated.
 *
 *
 * @param {function(message:Record, conversation:Record, participants:Record[], context:Object)} func - function to be registered
 */

function afterMessageUpdated(func) {
  chatHook('after_message_updated', function (args, context) {
    var message = new Message(args.message);
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    func(message, conversation, participants, context);
  });
}

/**
 * After message deleted hook.
 *
 * This hook will be triggered once a message is deleted.
 *
 * @param {function(message:Record, conversation:Record, participants:Record[], context:Object)} func - function to be registered
 */

function afterMessageDeleted(func) {
  chatHook('after_message_deleted', function (args, context) {
    var message = new Message(args.message);
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    func(message, conversation, participants, context);
  });
}

/**
 * Typing started hook.
 *
 * This hook will be triggered once an user starts typing.
 *
 * @param {function(conversation:Record, participants:Record[], event:Object, context: Object)} func - function to be registered
 */

function typingStarted(func) {
  chatHook('typing_started', function (args, context) {
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    func(conversation, participants, args.events, context);
  });
}

/**
 * After conversation created hook.
 *
 * This hook will be triggered once a conversation is created.
 *
 * @param {function(conversation:Record, participants:Record[], context:Object)} func - function to be registered
 */

function afterConversationCreated(func) {
  chatHook('after_conversation_created', function (args, context) {
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    func(conversation, participants, context);
  });
}

/**
 * After conversation updated hook.
 *
 * This hook will be triggered once a conversation is updated.
 *
 * @param {function(conversation:Record, participants:Record[], context:Object)} func - function to be registered
 */

function afterConversationUpdated(func) {
  chatHook('after_conversation_updated', function (args, context) {
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    func(conversation, participants, context);
  });
}

/**
 * After conversation deleted hook.
 *
 * This hook will be triggered once a conversation is deleted.
 *
 * @param {function(conversation:Record, participants:Record[], context:Object)} func - function to be registered
 */

function afterConversationDeleted(func) {
  chatHook('after_conversation_deleted', function (args, context) {
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    func(conversation, participants, context);
  });
}

/**
 * After user added to conversation hook.
 *
 * This hook will be triggered once one or more users are added to a conversation.
 *
 * @param {function(conversation:Record, participants:Record[], newUsers:Record[], context:Object)} func - function to be registered
 */

function afterUsersAddedToConversation(func) {
  chatHook('after_users_added_to_conversation', function (args, context) {
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    var newUsers = args.new_users.map(function (p) {
      return new User(p);
    });
    func(conversation, participants, newUsers, context);
  });
}

/**
 * After user removed from conversation hook.
 *
 * This hook will be triggered once one or more users are removed from a conversation.
 *
 * @param {function(conversation:Record, participants:Record[], oldUsers:Record[], context:Object)} func - function to be registered
 */

function afterUsersRemovedFromConversation(func) {
  chatHook('after_users_removed_from_conversation', function (args, context) {
    var conversation = new Conversation(args.conversation);
    var participants = args.participants.map(function (p) {
      return new User(p);
    });
    var oldUsers = args.old_users.map(function (p) {
      return new User(p);
    });
    func(conversation, participants, oldUsers, context);
  });
}