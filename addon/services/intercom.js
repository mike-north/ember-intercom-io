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
    return get(this, `user.${get(this, 'config.userProperties.nameProp')}`);
  }),

  _userEmailProp: computed('config.userProperties.emailProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.emailProp')}`);
  }),

  _userHashProp: computed('config.userProperties.hashProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.hashProp')}`);
  }),

  _userCreatedAtProp: computed('config.userProperties.createdAtProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.createdAtProp')}`);
  }),

  user: {
    name: null,
    email: null,
    hash: null
  },

  _hasUserContext: computed('user', '_userNameProp', '_userEmailProp', '_userCreatedAtProp', function() {
    return !!get(this, 'user')
           && !!get(this, '_userNameProp')
           && !!get(this, '_userEmailProp');
  }),

  _intercomBootConfig: computed('_hasUserContext', function() {
    let appId = get(this, 'config.appId');
    assert('You must supply an "ENV.intercom.appId" in your "config/environment.js" file.', appId);

    let obj = {
      app_id: appId // eslint-disable-line
    };

    if (get(this, '_hasUserContext')) {
      obj.name = get(this, '_userNameProp');
      obj.email = get(this, '_userEmailProp');
      if (get(this, '_userHashProp')) {
        // eslint-disable-next-line
        obj.user_hash = get(this, '_userHashProp');
      }
      if (get(this, '_userCreatedAtProp')) {
        // eslint-disable-next-line
        obj.created_at = get(this, '_userCreatedAtProp');
      }
    }
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
