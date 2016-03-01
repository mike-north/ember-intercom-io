import config from '../config/environment';

function setupIntercom() {
  (function() {
    const ic = window.Intercom;
    if (typeof ic === "function") {
      ic('reattach_activator');
      ic('update', {});
    } else {
      const d = document;
      const i = function() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args)
      };
      window.Intercom = i;

      const s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://widget.intercom.io/widget/${Ember.get(config, 'intercom.appId')}`;
      const x = d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);

    }
  })();
}

export function initialize( /* container, application */ ) {
  setupIntercom();
}

export default {
  name: 'ember-intercom',
  initialize: initialize
};
