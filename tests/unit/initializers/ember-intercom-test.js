import Ember from 'ember';
import EmberIntercomInitializer from 'dummy/initializers/ember-intercom';
import { module, test } from 'qunit';

const {
  Application,
  run
} = Ember;

let application;

/* eslint-disable camelcase */
const mockConfig = {
  intercom: {
    app_id: '1'
  }
};
/* eslint-enable camelcase */

module('Unit | Initializer | ember intercom', {
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
  EmberIntercomInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
