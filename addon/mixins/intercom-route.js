import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import { get } from '@ember/object';
import { assert } from '@ember/debug';

export default Mixin.create({
  intercom: service(),
  /**
   * push page changes to intercom
   * @private
   * @on didTransition
   */
  submitRouteChange: on('didTransition', function() {
    let intercom = get(this, 'intercom');

    assert('Could not find property configured intercom instance', intercom);

    if (get(intercom, 'isBooted')) {
      intercom.update();
    }
  })
});
