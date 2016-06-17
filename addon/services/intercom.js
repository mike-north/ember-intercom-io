import Ember from 'ember';
import Intercom from 'intercom';

const {
  get,
  Service,
  assign: emberAssign,
  computed,
  assert,
  typeOf,
  getOwner,
  run: { scheduleOnce }
} = Ember;

// Handle multi browser support for Ember 2.4+
const assign = Object.assign || emberAssign;

export default Service.extend({
  // intercom: computed(function() {
  //   return new Intercom();
  // }),
  config: computed(function() {
    if (typeOf(getOwner) === 'function') {
      return getOwner(this).resolveRegistration('config:environment');
    } else {
      // Handle Ember < 2.3
      // http://emberjs.com/deprecations/v2.x/#toc_id-ember-application-injected-container
      return this.container.lookupFactory('config:environment');
    }
  }),

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
    assign(_bootConfig, bootConfig);

    debugger;
    scheduleOnce('afterRender', () => Intercom('boot', _bootConfig));
  },

  stop() {
    scheduleOnce('afterRender', () => Intercom('shutdown'));
  },

  update(properties = {}) {
    scheduleOnce('afterRender', () => Intercom('update', properties));
  }
});
