import Ember from 'ember';

const { inject } = Ember;

export default Ember.Component.extend({
  intercom: inject.service(),
  didInsertElement() {
    this._super(...arguments);
    this.get('intercom').start();
  },
  willDestroyElement() {
    this._super(...arguments);
    this.get('intercom').stop();
  }
});
