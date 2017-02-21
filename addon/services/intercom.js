import Ember from 'ember';
import intercom from 'intercom';

const {
  get,
  merge,
  Service,
  computed,
  assert,
  run: { scheduleOnce },
  Evented
} = Ember;

export default Service.extend(Evented, {
  api: intercom,

  _userNameProp: computed('config.userProperties.nameProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.nameProp')}`);
  }),

  _userEmailProp: computed('config.userProperties.emailProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.emailProp')}`);
  }),

  _userCreatedAtProp: computed('config.userProperties.createdAtProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.createdAtProp')}`);
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

  start(bootConfig = {}) {
    let _bootConfig = merge(get(this, '_intercomBootConfig'), bootConfig);
    scheduleOnce('afterRender', () => this.get('api')('boot', _bootConfig));
  },

  stop() {
    scheduleOnce('afterRender', () => this.get('api')('shutdown'));
  },

  update(properties = {}) {
    scheduleOnce('afterRender', () => this.get('api')('update', properties));
  }
});
