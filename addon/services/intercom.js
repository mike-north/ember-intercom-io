import { merge } from '@ember/polyfills';
import Service from '@ember/service';
import { computed, get, set } from '@ember/object';
import { assert } from '@ember/debug';
import { scheduleOnce } from '@ember/runloop';
import intercom from 'intercom';

export default Service.extend({
  init() {
    this._super(...arguments);
    set(this, "user", { email: null, name: null, hash: null, user_id: null });
  },

  api: intercom,

  _userHashProp: computed('config.userProperties.userHashProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.userHashProp')}`);
  }),

  _userIdProp: computed('config.userProperties.userIdProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.userIdProp')}`);
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

  user: null,

  _hasUserContext: computed('user', '_userNameProp', '_userEmailProp', '_userCreatedAtProp', function() {
    return !!get(this, 'user') && !!get(this, '_userNameProp') &&
      (!!get(this, '_userEmailProp') || !!get(this, "_userIdProp"));
  }),

  _intercomBootConfig: computed('_hasUserContext', function() {
    let appId = get(this, 'config.appId');
    assert('You must supply an "ENV.intercom.appId" in your "config/environment.js" file.', appId);

    let obj = {
      app_id: appId // eslint-disable-line
    };

    if (get(this, '_hasUserContext')) {
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

  start(bootConfig = {}) {
    let _bootConfig = merge(get(this, '_intercomBootConfig'), bootConfig);
    scheduleOnce('afterRender', () => this.get('api')('boot', _bootConfig));
  },

  stop() {
    scheduleOnce('afterRender', () => this.get('api')('shutdown'));
  },

  update(properties = {}) {
    scheduleOnce('afterRender', () => this.get('api')('update', properties));
  },

  trackEvent(name, metaData = {}) {
    scheduleOnce('afterRender', () => this.get('api')('trackEvent', name, metaData));
  }
});
