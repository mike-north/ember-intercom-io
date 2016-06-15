import Ember from 'ember';
import ConfigInitializer from 'dummy/initializers/config';
import { module, test } from 'qunit';

const {
  Application,
  run
} = Ember;

let application;

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const mockConfig = {
  intercom: {
    app_id: '1'
  }
};
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

module('Unit | Initializer | config', {
  beforeEach() {
    run(() => {
      application = Application.create();
      application.register('config:environment', mockConfig, { instantiate: false });
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ConfigInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
