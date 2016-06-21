(function() {
  /* globals define, Intercom */
  'use strict';

  function l(config) {
    let i = function() {
      i.c(arguments);
    };
    i.q = [];
    i.c = function(args) {
      i.q.push(args);
    };

    window.Intercom = i;

    let d = document;
    let s = d.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = `https://widget.intercom.io/widget/${config.intercom.appId}`;
    let x = d.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  }

  let ic = window.Intercom;
  if (typeof ic === 'function') {
    ic('reattach_activator');
    ic('update', {});
  }

  function generateModule(name, values) {
    define(name, [], function() {
      'use strict';

      return values;
    });
  }

  generateModule('intercom', {
    default() {
      return window.Intercom.apply(this, arguments);
    },
    _setup: l
  });
})();
