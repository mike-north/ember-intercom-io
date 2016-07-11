import Ember from 'ember';
import intercom from 'intercom';

const {
  get,
  merge,
  Service,
  computed,
  assert,
  run: { scheduleOnce }
} = Ember;

export default Service.extend({
  api: intercom,

  _userNameProp: computed('config.userProperties.nameProp', function() {
    return `user.${get(this, 'config.userProperties.nameProp')}`;
  }),

  _userEmailProp: computed('config.userProperties.emailProp', function() {
    return `user.${get(this, 'config.userProperties.emailProp')}`;
  }),

  _userCreatedAtProp: computed('config.userProperties.createdAtProp', function() {
    return `user.${get(this, 'config.userProperties.createdAtProp')}`;
  }),

  _userIdProp: computed('config.userProperties.idProp', function() {
    return `user.${get(this, 'config.userProperties.idProp')}`;
  }),

  _userHashProp: computed('config.userProperties.hashProp', function() {
    return `user.${get(this, 'config.userProperties.hashProp')}`;
  }),

  user: {
    name: null,
    email: null
  },

  _hasUserContext: computed('user', '_userNameProp', '_userEmailProp', '_userCreatedAtProp', function() {
    return !!get(this, this.get('_userEmailProp'));
  }),

  clearUser() {
    this.set('user', {});
    if (window) {
      window.intercomSettings = {};
    }
  },

  _intercomBootConfig: computed('_hasUserContext', 'user', function() {
    let appId = get(this, 'config.appId');
    assert('You must supply an "ENV.intercom.appId" in your "config/environment.js" file.', appId);

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    let obj = {
      app_id: appId
    };

    if (get(this, '_hasUserContext')) {
      obj.name = get(this, this.get('_userNameProp'));
      obj.email = get(this, this.get('_userEmailProp'));
      if (get(this, '_userIdProp') && get(this, this.get('_userIdProp'))) {
        obj.user_id = get(this, this.get('_userIdProp'));
      }
      if (get(this, '_userHashProp') && get(this, this.get('_userHashProp'))) {
        obj.user_hash = get(this, this.get('_userHashProp'));
      }
      if (get(this, '_userCreatedAtProp')) {
        obj.created_at = get(this, this.get('_userCreatedAtProp'));
      }
    }
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    return obj;
  }),

  start(bootConfig = {}) {
    let _bootConfig = merge(get(this, '_intercomBootConfig'), bootConfig);
    console.log('_booting with ', _bootConfig);
    if (window) {
      window.intercomSettings = _bootConfig;
    }
    window.Intercom('boot', _bootConfig);
  },

  stop() {
    window.Intercom('shutdown');
  },

  reboot(forceReboot = false) {
    if (window.Intercom.booted || forceReboot) {
      this.stop();
      this.start();
    }
  },

  update(properties = {}) {
    scheduleOnce('afterRender', () => this.get('api')('update', properties));
  }
});
