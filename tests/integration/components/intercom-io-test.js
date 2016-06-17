import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import intercomSvc from '../../../services/intercom';

const { run } = Ember;

let intercomCommandArgs = { };

let intercomStub = function(command, arg) {
  if (!intercomCommandArgs[command]) {
    intercomCommandArgs[command] = [];
  }
  intercomCommandArgs[command].push(arg || null);
};

let _oldIntercom = null;

moduleForComponent('intercom-io', 'Integration | Component | intercom io', {
  integration: true,

  beforeEach() {
    _oldIntercom = window.Intercom;
    window.Intercom = intercomStub;
    this.register('service:intercom', intercomSvc);
    this.inject.service('intercom');
  },
  afterEach() {
    window.Intercom = _oldIntercom || function() {};
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
