import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import sinon from 'sinon';

const {
  run,
  set
} = Ember;

moduleFor('service:intercom', 'Unit | Service | intercom');

const mockConfig = {
  intercom: {
    userProperties: {
      nameProp: 'name',
      emailProp: 'email',
      createdAtProp: 'createdAt'
    },
    appId: '1'
  }
};

test('it adds the correct user context to the boot config', function(assert) {
  let actualUser = {
    name: 'foo',
    email: 'foo@foo.com',
    createdAt: new Date(),
    custom: 'my-custom-property'
  };

  let intercomStub = sinon.stub();

  let service = this.subject({
    config: mockConfig,
    intercom: intercomStub
  });

  set(service.user, 'email', actualUser.email);
  set(service.user, 'name', actualUser.name);
  set(service.user, 'createdAt', actualUser.createdAt);

  run(() => service.start({
    custom: actualUser.custom
  }));

  let expectedBootConfig = {
    app_id: mockConfig.intercom.appId,
    name: actualUser.name,
    email: actualUser.email,
    created_at: actualUser.createdAt,
    custom: actualUser.custom
  };

  assert.ok(intercomStub.calledOnce, 'it called the intercom module');
  sinon.assert.calledWith(intercomStub, 'boot', expectedBootConfig);
});
