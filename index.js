/* eslint-disable */
'use strict';

var path = require('path');
module.exports = {
  name: 'ember-intercom-io',

  included: function(app) {
    this._super.included(app);
    app.import('vendor/intercom-shim.js');
  },

  treeForVendor: function() {
    return path.join(__dirname, 'client');
  }
};
