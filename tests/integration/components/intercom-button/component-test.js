import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const { set, run } = Ember;

let mockIntercom;

moduleForComponent('intercom-button', 'Integration | Component | intercom button', {
  integration: true,

  beforeEach() {
    mockIntercom = sinon.stub({
      unreadCount: 1,
      isOpen: true,
      toggleOpen() {}
    });

    this.register('service:intercom', mockIntercom, { instantiate: false });
  }
});

test('it renders with unread count', function(assert) {
  this.render(hbs`{{intercom-button label="Help and Support"}}`);

  assert.equal(this.$().text().trim(), 'Help and Support 1');

  run(() => {
    set(mockIntercom, 'unreadCount', 0);
  });
  assert.equal(this.$().text().trim(), 'Help and Support');
});

test('it sends toggle to intercom', function(assert) {
  this.render(hbs`{{intercom-button}}`);
  this.$('button').click();
  assert.deepEqual(mockIntercom.toggleOpen.calledOnce, true, 'toggle was called');
});

test('it has .active class when intercom is open', function(assert) {
  this.render(hbs`{{intercom-button}}`);
  assert.equal(this.$('button').hasClass('active'), true, 'has active class');
  run(() => {
    set(mockIntercom, 'isOpen', false);
  });
  assert.equal(this.$('button').hasClass('active'), false, 'has active class');
});
