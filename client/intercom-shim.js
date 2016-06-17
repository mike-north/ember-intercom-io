(function() {
  /* globals define, Intercom */

  function generateModule(name, values) {
    define(name, [], function() {
      'use strict';

      return values;
    });
  }

  generateModule('intercom', { 'default': window.Intercom || null });
})();
