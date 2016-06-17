import Ember from 'ember';

const { Component, inject } = Ember;

export default Component.extend({
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
