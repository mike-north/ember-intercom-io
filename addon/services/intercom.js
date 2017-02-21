import Ember from 'ember';
import intercom from 'intercom';

const {
  get,
  isPresent,
  Service,
  computed,
  observer,
  assert,
  run,
  run: { scheduleOnce },
  Evented,
  RSVP: { Promise },
  String: { underscore },
  typeOf
} = Ember;

const { keys } = Object;

/**
 * Normalization function for converting intercom data to a consistent format.
 *
 * Changes:
 * - underscore keys
 * - convert dates to unix timestamps
 *
 * @param  {Object} data
 *
 * @private
 * @return {Object}
 */
function normalizeIntercomMetadata(data) {
  let result = {};
  let val;
  keys(data).forEach((key) => {
    val = data[key];
    if (typeOf(val) === 'object') {
      result[underscore(key)] = normalizeIntercomMetadata(val);
    } else {
      if (typeOf(val) === 'date') {
        val = val.valueOf();
      }
      result[underscore(key)] = val;
    }
  });

  return result;
}

export default Service.extend(Evented, {
  api: intercom,

  /**
   * Indicates the open state of the Intercom panel
   *
   * @public
   * @type {Boolean}
   */
  isOpen: false,

  /**
   * Indicates whether the Intercom boot command has been called.
   *
   * @public
   * @readonly
   * @type {Boolean}
   */
  isBooted: false,

  /**
   * Reports the number of unread messages
   *
   * @public
   * @type {Number}
   */
  unreadCount: 0,

  /**
   * If true, will automatically update intercom when changes to user object are made.
   *
   * @type {Boolean}
   * @public
   */
  autoUpdate: true,

  /**
   * Hide the default Intercom launcher button
   *
   * @public
   * @type {Boolean}
   */
  hideDefaultLauncher: false,

  /**
   * The user data to send to Intercom.
   *
   * @public
   * @type {Object}
   */
  user: {
    email: null,
    name: null,
    createdAt: null
  },

  boot(config = {}) {
    this._addEventHandlers();
    this._callIntercomMethod('boot', normalizeIntercomMetadata(config));
  },

  update(config = {}) {
    this._callIntercomMethod('update', normalizeIntercomMetadata(config));
  },

  shutdown() {
    this._callIntercomMethod('shutdown');
  },

  show() {
    return this._wrapIntercomCallInPromise('show', 'show');
  },

  hide() {
    return this._wrapIntercomCallInPromise('hide', 'hide');
  },

  toggleOpen() {
    this.get('isOpen') ? this.hide() : this.show();
  },

  /**
   * Opens the message window with the message list visible.
   *
   * @public
   * @return {Promise}
   */
  showMessages() {
    return this._wrapIntercomCallInPromise('showMessages', 'show');
  },

  /**
   * Opens the message window with the new message view.
   *
   * @public
   * @return {Promise}
   */
  showNewMessage(initialText) {
    return this._wrapIntercomCallInPromise('showNewMessage', 'show', initialText);
  },

  /**
   * You can submit an event using the trackEvent method.
   * This will associate the event with the currently logged in user and
   * send it to Intercom.
   *
   * The final parameter is a map that can be used to send optional
   * metadata about the event.
   *
   * @param {String} eventName
   * @param {Object} metadata
   * @public
   */
  trackEvent() {
    this._callIntercomMethod('trackEvent', ...arguments);
  },

  /**
   * A visitor is someone who goes to your site but does not use the messenger.
   * You can track these visitors via the visitor user_id. This user_id
   * can be used to retrieve the visitor or lead through the REST API.
   *
   * @public
   * @return {String} The visitor ID
   */
  getVisitorId() {
    return this.get('api')('getVisitorId');
  },

  start(bootConfig = {}) {
    let config = get(this, '_intercomBootConfig');
    return this.boot({ ...config, ...bootConfig });
  },

  stop() {
    return this.shutdown();
  },

  _onHide() {
    this.set('isOpen', false);
    this.trigger('hide');
  },

  _onShow() {
    this.set('isOpen', true);
    this.trigger('show');
  },

  _onUnreadCountChange(count) {
    this.set('unreadCount', parseInt(count, 10));
  },

  _addEventHandlers() {
    if (this._hasEventHandlers) {
      return;
    }
    this._callIntercomMethod('onHide', () => run(this, this._onHide));
    this._callIntercomMethod('onShow', () => run(this, this._onShow));
    this._callIntercomMethod('onUnreadCountChange', (count) => run(this, this._onUnreadCountChange, count));
    this._hasEventHandlers = true;
  },

  _wrapIntercomCallInPromise(intercomMethod, eventName, ...args) {
    return new Promise((resolve) => {
      let isOpen = this.get('isOpen');
      if (eventName === 'show' && isOpen
          || eventName === 'hide' && !isOpen) {
        run.next(this, resolve);
      } else {
        this.one(eventName, resolve);
      }
      this._callIntercomMethod(intercomMethod, ...args);
    });
  },

  _callIntercomMethod(methodName, ...args) {
    scheduleOnce('afterRender', () => {
      let intercom = this.get('api');
      intercom(methodName, ...args);
    });
  },

  userDataDidChange: observer('user.@each', function() {
    if (this.get('autoUpdate')) {
      let user = this.get('user');
      let config = { ...user };
      this.update(config);
    }
  }),

  _hasUserContext: computed('user', function() {
    let user = get(this, 'user');
    return isPresent(user.email) || isPresent(user.userId);
  }),

  _intercomBootConfig: computed(function() {
    let appId = get(this, 'config.appId');
    let user = get(this, 'user');
    let _hasUserContext = get(this, '_hasUserContext');
    let hideDefaultLauncher = get(this, 'hideDefaultLauncher');

    assert('You must supply an "ENV.intercom.appId" in your "config/environment.js" file.', appId);

    let obj = { appId };

    if (hideDefaultLauncher) {
      obj.hideDefaultLauncher = true;
    }

    if (_hasUserContext) {
      obj = { ...obj, ...user };
    }

    return obj;
  })
});
