import Ember from 'ember';

const {
  assign,
  get,
  Service,
  computed,
  assert,
  typeOf,
  inject,
  run: { scheduleOnce }
} = Ember;

export default Service.extend({
  intercom: inject.service('intercom-instance'),
  config: inject.service(),

  _userNameProp: computed('config.intercom.userProperties.nameProp', function() {
    return get(this, `user.${get(this, 'config.intercom.userProperties.nameProp')}`);
  }),

  _userEmailProp: computed('config.intercom.userProperties.emailProp', function() {
    return get(this, `user.${get(this, 'config.intercom.userProperties.emailProp')}`);
  }),

  _userCreatedAtProp: computed('config.intercom.userProperties.createdAtProp', function() {
    return get(this, `user.${get(this, 'config.intercom.userProperties.createdAtProp')}`);
  }),

  user: {
    name: null,
    email: null
  },

  _hasUserContext: computed('user', '_userNameProp', '_userEmailProp', '_userCreatedAtProp', function() {
    return !!get(this, 'user') &&
           !!get(this, '_userNameProp') &&
           !!get(this, '_userEmailProp');
  }),

  _intercomBootConfig: computed('_hasUserContext', function() {
    let appId = get(this, 'config.intercom.appId');
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

  start(bootConfig = {}) {
    let _bootConfig = get(this, '_intercomBootConfig');

    // Handle multi browser support for Ember 2.4+
    if (typeOf(Object.assign) === 'function') {
      Object.assign(_bootConfig, bootConfig);
    } else {
      assign(_bootConfig, bootConfig);
    }

    scheduleOnce('afterRender', () => get(this, 'intercom')('boot', _bootConfig));
  },

  stop() {
    scheduleOnce('afterRender', () => get(this, 'intercom')('shutdown'));
  },

  update(properties = {}) {
    scheduleOnce('afterRender', () => get(this, 'intercom')('update', properties));
  }
});
