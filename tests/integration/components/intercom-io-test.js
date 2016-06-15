import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import intercomSvc from '../../../services/intercom';

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
      createdAtProp: 'createdAt'
    },
    appId: '1'
  }
};

moduleForComponent('intercom-io', 'Integration | Component | intercom io', {
  integration: true,

  beforeEach() {
    this.register('service:config', mockConfig, { instantiate: false });
    this.register('service:intercom-instance', intercomStub, { instantiate: false });

    this.register('service:intercom', intercomSvc);
    this.inject.service('intercom');
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
