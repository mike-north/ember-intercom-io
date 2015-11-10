import Ember from 'ember';
import config from '../config/environment';

const { Service, computed, run: { next, scheduleOnce } } = Ember;

const USER_NAME_PROP = `user.${Ember.get(config, 'intercom.userProperties.nameProp')}`;
const USER_EMAIL_PROP = `user.${Ember.get(config, 'intercom.userProperties.emailProp')}`;
const USER_CREATED_AT_PROP = `user.${Ember.get(config, 'intercom.userProperties.createdAtProp')}`;

export default Service.extend({
  user: {
    name: null,
    email: null
  },

  _hasUserContext: computed('user', USER_NAME_PROP, USER_EMAIL_PROP, USER_CREATED_AT_PROP, function() {
    return !!this.get('user')
      && !!this.get(USER_NAME_PROP)
      && !!this.get(USER_EMAIL_PROP)
  }),

  _intercomBootConfig: computed('_hasUserContext', function() {
    let obj = {
      app_id: Ember.get(config, 'intercom.appId')
    };

    if (this.get('_hasUserContext')) {
      obj.name = this.get(USER_NAME_PROP);
      obj.email = this.get(USER_EMAIL_PROP);
      if (this.get(USER_CREATED_AT_PROP)) {
        obj.created_at = this.get(USER_CREATED_AT_PROP);
      }
    }

    return obj;
  }),

  start() {
    scheduleOnce('afterRender', () => {
      window.Intercom('boot', this.get('_intercomBootConfig'));
    });
  },

  stop() {
    scheduleOnce('afterRender', () => {
      window.Intercom('shutdown');
    });
  },

  update() {
    scheduleOnce('afterRender', () => {
      window.Intercom('update');
    });
  }
});
