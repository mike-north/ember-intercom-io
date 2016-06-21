import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const {
  run
} = Ember;

moduleForAcceptance('Acceptance | intercom icon');

test('visiting /help renders the intercom icon', function(assert) {
  assert.expect(1);
  visit('/help');

  andThen(() => {
    run.later(() => {
      assert.equal($('#intercom-container').length, 1);
    }, 1000);

  });
});
