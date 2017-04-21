import Ember from 'ember';

const { Mixin, on, get, assert, inject: { service } } = Ember;

export default Mixin.create({
  intercom: service(),

  /**
   * push page changes to intercom
   * @public
   */
  submitRouteChange: on('didTransition', function() {
    let intercom = get(this, 'intercom');

    assert('Could not find property configured intercom instance', intercom);

    intercom.update();
  })
});
