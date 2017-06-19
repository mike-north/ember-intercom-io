'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    intercom: {
      appId: null,
      userProperties: {
        nameProp: 'name',
        emailProp: 'email',
        hashProp: 'hash',
        createdAtProp: 'createdAt'
      }
    }
  };
};
