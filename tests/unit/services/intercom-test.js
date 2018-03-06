import { run } from '@ember/runloop';
import { set } from '@ember/object';
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
  let actualUser = {
    id: 'fooUserId',
    name: 'foo',
    email: 'foo@foo.com',
    hash: 'fakeIntercomSecureUserHash',
    createdAt: new Date(),
    custom: 'my-custom-property'
  };

  let service = this.subject();

  set(service.user, 'id', actualUser.id);
  set(service.user, 'email', actualUser.email);
  set(service.user, 'name', actualUser.name);
  set(service.user, 'hash', actualUser.hash);
  set(service.user, 'createdAt', actualUser.createdAt);

  run(() =>
    service.start({
      custom: actualUser.custom
    })
  );

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  let expectedBootConfig = {
    app_id: mockConfig.intercom.appId, //eslint-disable-line
    name: actualUser.name,
    email: actualUser.email,
    user_hash: actualUser.hash,
    user_id: actualUser.id,
    created_at: actualUser.createdAt, //eslint-disable-line
    custom: actualUser.custom
  };
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  assert.equal(!!intercomStub.calledOnce, true, 'it called the intercom module');
  sinon.assert.calledWith(intercomStub, 'boot', expectedBootConfig);
});
