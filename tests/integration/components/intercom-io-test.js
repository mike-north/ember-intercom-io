import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let intercomCommandArgs = {};

let intercomStub = function(command, arg) {
  if (!intercomCommandArgs[command]) {
    intercomCommandArgs[command] = [];
  }
  intercomCommandArgs[command].push(arg || null);
};

const mockConfig = {
  intercom: {
    userProperties: {
      nameProp: 'name',
      emailProp: 'email',
      userHashProp: 'hash',
      userIdProp: 'id',
      createdAtProp: 'createdAt'
    },
    appId: '1'
  }
};

module('Integration | Component | intercom-io', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.owner.register('service:config', mockConfig, { instantiate: false });
    this.set('intercom', this.owner.lookup('service:intercom'));
    this.set('intercom.api', intercomStub);
    assert.expect(2);
    let oldStartCount = (intercomCommandArgs.boot || []).length;

    await render(hbs`{{intercom-io}}`);

    assert.equal(this.element.textContent.trim(), '');
    assert.equal(intercomCommandArgs.boot.length - oldStartCount, 1, 'Intercom service "start" was invoked');
  });
});
