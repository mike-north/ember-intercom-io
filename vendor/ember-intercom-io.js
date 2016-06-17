(function() {
  /* globals define, Intercom */

  function generateModule(name, values) {
    define(name, [], function() {
      'use strict';

      return values;
    });
  }

  function setupIntercom(config) {
    var ic = window.Intercom || null;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', {});
    } else {
      var d = document;
      var i = function() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args);
      };
      window.Intercom = i;

      var s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://widget.intercom.io/widget/${Ember.get(config, 'intercom.appId')}`;
      var [x] = d.getElementsByTagName('script');
      x.parentNode.insertBefore(s, x);
    }
  }

  generateModule('ember-intercom-io', {
    'setupIntercom': setupIntercom
  });
})();
