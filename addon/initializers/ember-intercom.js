import { setupIntercom } from 'ember-intercom-io';

export function initialize(application) {
  if (typeof FastBoot === 'undefined') {
    let config;

    if (application.resolveRegistration) {
      config = application.resolveRegistration('config:environment');
    } else {
      config = application.registry.resolve('config:environment');
    }

    setupIntercom(config);
  }
}

export default {
  name: 'ember-intercom',
  initialize
};
