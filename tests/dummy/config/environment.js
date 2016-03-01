/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dummy',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    contentSecurityPolicy: {
      'connect-src': [
        'https://api-iam.intercom.io',
        'https://api-ping.intercom.io',
        'https://nexus-websocket-a.intercom.io',
        'https://nexus-websocket-b.intercom.io',
        'wss://nexus-websocket-a.intercom.io',
        'wss://nexus-websocket-b.intercom.io'].join(' '),
      'img-src': [
        'data:',
        'http://localhost:4200',
        'https://static.intercomcdn.com',
        'https://js.intercomcdn.com'].join(' '),
      'default-src': 'http://localhost:4200',
      'script-src': [
        'http://localhost:4200',
        'https://widget.intercom.io',
        'https://js.intercomcdn.com'].join(' '),
      'media-src': [
        'https://js.intercomcdn.com'].join(' '),
      'style-src': [
        'http://localhost:4200',
        '\'unsafe-inline\''].join(' ')
    },
    intercom: {
      appId: 'e8moi2hb'
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    ENV.EmberENV.RAISE_ON_DEPRECATION = !process.env['ALLOW_DEPRECATIONS'];

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
