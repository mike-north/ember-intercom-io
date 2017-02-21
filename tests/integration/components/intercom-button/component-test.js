import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

moduleForComponent('intercom-button', 'Integration | Component | intercom button', {
  integration: true,

  beforeEach() {
    let mockIntercom = sinon.stub({
      unreadCount: 1
    });

    this.register('service:intercom', mockIntercom, { instantiate: false });
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{intercom-button}}`);

  assert.equal(this.$().text().trim(), 'Support (1)');
});
