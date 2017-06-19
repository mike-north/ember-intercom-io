import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const {
  run
} = Ember;

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
      hashProp: 'hash',
      createdAtProp: 'createdAt'
    },
    appId: '1'
  }
};

moduleForComponent('intercom-io', 'Integration | Component | intercom io', {
  integration: true,

  beforeEach() {
    this.register('service:config', mockConfig, { instantiate: false });
    this.inject.service('intercom');
    this.set('intercom.api', intercomStub);
  }
});

test('it renders', function(assert) {
  assert.expect(2);
  let oldStartCount = (intercomCommandArgs.boot || []).length;
  this.render(hbs`{{intercom-io}}`);

  assert.equal(this.$().text().trim(), '');
  run.next(() => {
    assert.equal(intercomCommandArgs.boot.length - oldStartCount, 1, 'Intercom service "start" was invoked');
  });

});
