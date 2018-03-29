import { run } from '@ember/runloop';
import { setProperties } from '@ember/object';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import sinon from 'sinon';

const mockConfig = {
  intercom: {
    userProperties: {
      nameProp: 'name',
      emailProp: 'email',
      userHashProp: 'hash',
      userIdProp: 'id',
      createdAtProp: 'createdAt'
    },
    appId: '1'
  }
};

let intercomStub = null;

moduleFor('service:intercom', 'Unit | Service | intercom', {
  beforeEach() {
    this.register('service:config', mockConfig, { instantiate: false });

    intercomStub = sinon.stub();

    this.subject().set('api', intercomStub);
    this.subject().set('config', mockConfig.intercom);
  }
});

test('it adds the correct user context to the boot config', function(assert) {
  let now = new Date();
  let actualUser = {
    id: 'fooUserId',
    name: 'foo',
    email: 'foo@foo.com',
    hash: 'fakeIntercomSecureUserHash',
    createdAt: now,
    custom: 'my-custom-property',
    shouldBeUnderScored: 'myThing',
    company: {
      id: 'companyId',
      nestedUnderscore: 'custom-nested'
    }
  };

  let service = this.subject();
  setProperties(service.user, actualUser);
  run(() =>
    service.start()
  );

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  let expectedBootConfig = {
    app_id: mockConfig.intercom.appId, //eslint-disable-line
    name: actualUser.name,
    email: actualUser.email,
    user_hash: actualUser.hash,
    user_id: actualUser.id,
    created_at: actualUser.createdAt.valueOf(), //eslint-disable-line
    custom: actualUser.custom,
    should_be_under_scored: actualUser.shouldBeUnderScored,
    company: {
      id: 'companyId',
      nested_underscore: actualUser.company.nestedUnderscore
    }
  };
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
  assert.deepEqual(intercomStub.firstCall.args, ['boot', expectedBootConfig], 'it called the intercom module with boot');
  sinon.assert.calledWith(intercomStub, 'boot', expectedBootConfig);
  assert.equal(intercomStub.calledWith('onHide'), true, 'it called the intercom module with onHide');
  assert.equal(intercomStub.calledWith('onShow'), true, 'it called the intercom module with onShow');
  assert.equal(intercomStub.calledWith('onUnreadCountChange'), true, 'it called the intercom module with onUnreadCountChange');
});

test('update gets called when user properties change', function(assert) {
 let service = this.subject();

 let expectedConfig = {
   name: 'Bobby Tables',
   email: 'user@example.com',
   app_id: mockConfig.intercom.appId, //eslint-disable-line
 };

 run(() => {
   service.boot();
   service.setProperties({
     user: {
       name: 'Bobby Tables',
       email: 'user@example.com'
     }
   });
 });

 assert.deepEqual(intercomStub.lastCall.args, ['update', expectedConfig], 'it called the intercom module with update');
});

test('Track events in intercom', function(assert) {
 let service = this.subject();
 /* eslint-disable camelcase */
 let eventName = 'invited-friend';
 let metadata = {
   friend_name: 'bobby tables',
   friend_email: 'bobby@tables.com'
 };
 /* eslint-enable camelcase */

 run(() => {
   service.boot();
   service.trackEvent(eventName, metadata);
 });

 assert.equal(intercomStub.calledWith('trackEvent'), true, 'Intercom track event method called');
 sinon.assert.calledWith(intercomStub, 'trackEvent', eventName, metadata);
});
