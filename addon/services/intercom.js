import Service from '@ember/service';
import { computed, get, observer, set } from '@ember/object';
import { assert, warn } from '@ember/debug';
import { scheduleOnce } from '@ember/runloop';
import intercom from 'intercom';
import { run } from '@ember/runloop';
import { typeOf } from "@ember/utils";
import { underscore } from "@ember/string"	;
import Evented from '@ember/object/evented';
import { alias } from '@ember/object/computed';

const WarnOption = {
  id: 'ember-intercom-io.missing-data'
}

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
  Object.keys(data).forEach((key) => {
    val = data[key];
    if (typeOf(val) === 'object') {
      result[underscore(key)] = normalizeIntercomMetadata(val);
    } else {
      if (typeOf(val) === 'date') {
        val = val.valueOf();
      }
      if (typeOf(val) !== 'undefined') {
        result[underscore(key)] = val;
      }
    }
  });

  return result;
}

export default Service.extend(Evented, {
  init() {
    this._super(...arguments);
    set(this, 'user', {email: null, name: null, hash: null, user_id: null});
  },

  api: intercom,
  user: null,
  /**
   * [description]
   * @return {[type]} [description]
   */
  _userHashProp: computed('user', 'config.userProperties.userHashProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.userHashProp')}`);
  }),

  _userIdProp: computed('user', 'config.userProperties.userIdProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.userIdProp')}`);
  }),

  _userNameProp: computed('user', 'config.userProperties.nameProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.nameProp')}`);
  }),

  _userEmailProp: computed('user', 'config.userProperties.emailProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.emailProp')}`);
  }),

  _userCreatedAtProp: computed('user', 'config.userProperties.createdAtProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.createdAtProp')}`);
  }),

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
   * @private
   * alias for appId
   * @type {[type]}
   */
  appId: alias('config.appId'),



  /**
   * Boot intercom window
   * @param  {Object} [config={}] [description]
   * @public
   */
  boot(config = {}) {
    this._callIntercomMethod('boot', normalizeIntercomMetadata(config));
    this._addEventHandlers();
    this.set('isBooted', true);
  },

  /**
   * Update intercom data
   * @param  {Object} [config={}] [description]
   * @public
   */
  update(config = {}) {
    if (!this.get('isBooted')) {
        warn('Cannot call update before boot', WarnOption);
      return;
    }

    let _hasUserContext = this.get('_hasUserContext');
    if (_hasUserContext) {
      this._callIntercomMethod('update', normalizeIntercomMetadata(config));
    } else {
      warn('Refusing to send update to Intercom because user context is incomplete. Missing userId or email', WarnOption);
    }
  },

  /**
   * shutdown Intercom window
   * @public
   */
  shutdown() {
    this.set('isBooted', false);
    this._hasEventHandlers = false;
    this._callIntercomMethod('shutdown');
  },

  /**
   * Show intercom window
   * @public
   */
  show() {
    return this._wrapIntercomCallInPromise('show', 'show');
  },

  /**
  * hide intercom window
  * @public
  */
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
    bootConfig = {...bootConfig, ...config}
    return this.boot(bootConfig);
  },

  stop() {
    return this.shutdown();
  },

  /**
   * Private on hide
   * @private
   * @return {[type]} [description]
   */
  _onHide() {
    this.set('isOpen', false);
    this.trigger('hide');
  },

  /**
   * handle onShow events
   * @private
   */
  _onShow() {
    this.set('isOpen', true);
    this.trigger('show');
  },

  /**
  * Handle onUnreadCountChange Events
  * @param  {[type]} count [description]
  * @private
  */
  _onUnreadCountChange(count) {
    this.set('unreadCount', Number(count));
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
    if (this.get('autoUpdate') && this.get('isBooted')) {
      let user = this.get('_computedUser');
      let appId = this.get('appId')
      let config = {appId, ...user };
      this.update(config);
    }
  }),

  /**
   * Alias for computed user data with app-provided config values
   * @private
   * @type {[type]}
   */
  _computedUser: computed('user.@each', 'user', '_userHashProp', '_userIdProp',
    '_userNameProp', '_userEmailProp', '_userCreatedAtProp', function () {
      assert('You must supply an "ENV.intercom.appId" in your "config/environment.js" file.', this.get('appId'));

      let obj = {}
      if (this.get('user')) {
        let userProps = Object.values(get(this, 'config.userProperties')),
          user = get(this, 'user'),
          userKeys = Object.keys(user);

        userKeys.forEach(k => {
          if (!userProps.includes(k) && !obj.hasOwnProperty(k)) {
            obj[k] = user[k];
          }
        });

        obj.user_hash = get(this, '_userHashProp');
        obj.user_id = get(this, '_userIdProp');
        obj.name = get(this, '_userNameProp');
        obj.email = get(this, '_userEmailProp');
        if (get(this, '_userCreatedAtProp')) {
          // eslint-disable-next-line
          obj.created_at = get(this, '_userCreatedAtProp');
        }
      }
      return obj;
    }),

  _hasUserContext: computed('user', 'user.@each', '_userNameProp', '_userEmailProp', '_userCreatedAtProp', function() {
    return !!get(this, 'user') && !!get(this, '_userNameProp') &&
      (!!get(this, '_userEmailProp') || !!get(this, '_userIdProp'));
  }),

  _intercomBootConfig: computed('config','user.@each', '_hasUserContext', 'hideDefaultLauncher', function() {
    let appId = get(this, 'config.appId');
    let user = get(this, '_computedUser');
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
