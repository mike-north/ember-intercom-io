/* jshint node: true */
'use strict';

let path = require('path');

module.exports = {
  name: 'ember-intercom-io',

  included(app) {
    this._super.included(app);
    if (process.env.EMBER_CLI_FASTBOOT !== 'true') {
      app.import('vendor/intercom-shim.js');
    }
  },

  treeForVendor() {
    return path.join(__dirname, 'client');
  }
};
