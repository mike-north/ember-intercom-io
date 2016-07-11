'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    intercom: {
      appId: null,
      userProperties: {
        nameProp: 'name',
        emailProp: 'email',
        idProp: 'id',
        hashProp: 'hmacToken',
        createdAtProp: 'createdAt'
      }
    }
  };
};
