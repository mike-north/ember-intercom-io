'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    intercom: {
      appId: process.env.INTERCOM_APP_ID | null,
      userProperties: {
        createdAtProp: 'createdAt',
        emailProp: 'email',
        nameProp: 'name',
        userHashProp: 'hash',
        userIdProp: 'id'
      }
    }
  };
};
