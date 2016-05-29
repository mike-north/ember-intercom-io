import Ember from 'ember';

const {
  Component,
  get,
  inject
} = Ember;

export default Component.extend({
  intercom: inject.service(),
  didInsertElement() {
    this._super(...arguments);
    get(this, 'intercom').start();
  },
  willDestroyElement() {
    this._super(...arguments);
    get(this, 'intercom').stop();
  }
});
