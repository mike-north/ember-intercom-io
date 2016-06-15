export function initialize(application) {
  if (arguments[1]) { // Ember < 2.1
    application = arguments[1];
  }

  let config = application.resolveRegistration('config:environment');
  application.register('service:config', config, { instantiate: false });
}

export default {
  name: 'config',
  initialize
};
