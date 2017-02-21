import Ember from 'ember';
import layout from './template';
const { computed, inject: { service } } = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'button',
  intercom: service(),

  classNames: ['IntercomButton'],
  classNameBindings: ['isOpen:active'],

  unreadCount: computed.reads('intercom.unreadCount'),
  isOpen: computed.reads('intercom.isOpen'),

  hasUnread: computed.gt('unreadCount', 0),

  label: 'Support',

  click() {
    this.get('intercom').toggleOpen();
  }
});
