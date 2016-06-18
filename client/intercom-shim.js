(function() {
  /* globals define, Intercom */

  function generateModule(name, values) {
    define(name, [], function() {
      'use strict';

      return values;
    });
  }

  var w = window;
  var ic = w.Intercom;
  if (typeof ic === "function") {
    ic('reattach_activator');
    ic('update', intercomSettings);
  } else {
    var d = document;
    var i = function() {
      i.c(arguments)
    };
    i.q = [];
    i.c = function(args) {
      i.q.push(args)
    };
    w.Intercom = i;

    function l(config) {
      var s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://widget.intercom.io/widget/' + config.intercom.appId;
      var x = d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }

  }

  generateModule('intercom', {
    default: w.Intercom,
    _setup: l
  });
})();
