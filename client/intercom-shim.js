(function() {
  /* globals define, Intercom */
  'use strict';

  function l(config) {
    if (config.intercom.enabled === false) {
      return;
    }

    var d = w.document;
    var s = d.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://widget.intercom.io/widget/' + config.intercom.appId;
    var x = d.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  }

  function generateModule(name, values) {
    define(name, [], function() {
      'use strict';

      return values;
    });
  }

  var w = window;
  var ic = w.Intercom;
  if (typeof ic === 'function') {
    ic('reattach_activator');
    ic('update', intercomSettings);
  } else {
    var i = function() {
      i.c(arguments);
    };
    i.q = [];
    i.c = function(args) {
      i.q.push(args);
    };
    w.Intercom = i;
  }

  generateModule('intercom', {
    default: w.Intercom,
    _setup: l
  });
})();
