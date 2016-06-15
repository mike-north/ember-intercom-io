import Ember from 'ember';

const {
  get
} = Ember;

function setupIntercom(config) {
  (function() {
    let ic = window.Intercom;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', {});
    } else {
      let d = document;
      let i = function() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args);
      };
      window.Intercom = i;

      let s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://widget.intercom.io/widget/${get(config, 'intercom.appId')}`;
      let [x] = d.getElementsByTagName('script');
      x.parentNode.insertBefore(s, x);

    }
  })();
}

export function initialize(application) {
  if (typeof FastBoot === 'undefined') {
    let config;

    if (application.resolveRegistration) {
      config = application.resolveRegistration('config:environment');
    } else {
      config = application.registry.resolve('config:environment');
    }

    setupIntercom(config);

    application.register('service:intercom-instance', window.Intercom, { instantiate: false });
  }
}

export default {
  name: 'ember-intercom',
  initialize
};
