import { _setup } from 'intercom';

export function initialize(application) {
  if (typeof FastBoot === 'undefined') {
    let config;

    if (application.resolveRegistration) {
      config = application.resolveRegistration('config:environment');
    } else {
      config = application.registry.resolve('config:environment');
    }

    _setup(config);
  }
}

export default {
  name: 'ember-intercom',
  initialize
};
