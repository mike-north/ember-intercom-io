import Ember from 'ember';
import intercom from 'intercom';

const {
  get,
  merge,
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

function normalizeIntercomMetadata(data) {
  let result = {};
  keys(data).forEach((key) => {
    if (typeOf(data[key]) === 'object') {
      result[underscore(key)] = normalizeIntercomMetadata(data[key])
    }else{
      result[underscore(key)] = data[key]
    }
  })
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
   */
  autoUpdate: true,

  user: {
    email: null,
    name: null,
    createdAt: null,
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
    let config = merge(get(this, '_intercomBootConfig'), bootConfig);
    return this.boot(config);
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
      debugger
      intercom[methodName].apply(intercom, args);
    });
  },

  userDataDidChange: observer('user.@each', function() {
    if (this.get('autoUpdate')) {
      this.update(this.get('user'));
    }
  }),

  _userNameProp: computed('config.userProperties.nameProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.nameProp')}`);
  }),

  _userEmailProp: computed('config.userProperties.emailProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.emailProp')}`);
  }),

  _userCreatedAtProp: computed('config.userProperties.createdAtProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.createdAtProp')}`);
  }),

  _hasUserContext: computed('user', '_userNameProp', '_userEmailProp', '_userCreatedAtProp', function() {
    return !!get(this, 'user') &&
           !!get(this, '_userNameProp') &&
           !!get(this, '_userEmailProp');
  }),

  _intercomBootConfig: computed('_hasUserContext', function() {
    let appId = get(this, 'config.appId');
    assert('You must supply an "ENV.intercom.appId" in your "config/environment.js" file.', appId);

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    let obj = {
      app_id: appId
    };

    if (get(this, '_hasUserContext')) {
      obj.name = get(this, '_userNameProp');
      obj.email = get(this, '_userEmailProp');
      if (get(this, '_userCreatedAtProp')) {
        obj.created_at = get(this, '_userCreatedAtProp');
      }
    }
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    return obj;
  }),
});
