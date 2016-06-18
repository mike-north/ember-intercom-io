import Ember from 'ember';
import { _setup } from 'intercom';

const { getWithDefault } = Ember;

export function initialize(application) {
  if (typeof FastBoot === 'undefined') {
    let config;

    if (application.resolveRegistration) {
      config = application.resolveRegistration('config:environment');
    } else {
      config = application.registry.resolve('config:environment');
    }
    let deferUntilLoaded = getWithDefault(config, 'intercom.deferReadinessUntilLoaded', false);
    if (deferUntilLoaded) {
      application.deferReadiness();
    }
    let p = _setup(config);
    if (deferUntilLoaded) {
      p.then(() => {
        application.advanceReadiness();
      });
    }
  }
}

export default {
  name: 'ember-intercom',
  initialize
};
