'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTypingDetector = createTypingDetector;

var _container = require('./container.js');

var _container2 = _interopRequireDefault(_container);

var _skygear = require('skygear');

var _skygear2 = _interopRequireDefault(_skygear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Detects whether the user is typing in an input field and send typing events to the server.
 *
 * @example
 * <script>
 *  var typing = createTypingDetector(conversation);
 * </script>
 * <input type=text oninput="typing()" />
 *
 * @param {Conversation} conversation - send typing events to this conversation.
 * @param {Object} [options]
 * @param {number} [options.debounceTime = 3000] - interger of miliseconds to debounce calls
 * @return {function}
 */
function createTypingDetector(conversation) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$debounceTime = _ref.debounceTime,
      debounceTime = _ref$debounceTime === undefined ? 3000 : _ref$debounceTime;

  if (!(conversation instanceof _skygear2.default.Record && conversation.recordType === 'conversation')) {
    throw new Error('TypingDetector expects Conversation, instead got ' + conversation + '.');
  }
  var debounceTimer = null;
  function stopTyping() {
    _container2.default.sendTypingIndicator(conversation, 'finished');
    debounceTimer = null;
  }
  function startTyping() {
    _container2.default.sendTypingIndicator(conversation, 'begin');
    debounceTimer = setTimeout(stopTyping, debounceTime);
  }
  function resetTimer() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(stopTyping, debounceTime);
  }
  return function () {
    if (debounceTimer) {
      resetTimer();
    } else {
      startTyping();
    }
  };
}