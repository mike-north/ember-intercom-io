import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import sinon from 'sinon';

const {
  run,
  set
} = Ember;

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
    name: 'foo',
    userId: '1',
    email: 'foo@foo.com',
    createdAt: now,
    custom: 'my-custom-property'
  };

  let service = this.subject();

  set(service.user, 'email', actualUser.email);
  set(service.user, 'name', actualUser.name);
  set(service.user, 'userId', actualUser.userId);
  set(service.user, 'createdAt', actualUser.createdAt);

  run(() => service.start({
    custom: actualUser.custom
  }));

  /* eslint-disable camelcase */
  let expectedBootConfig = {
    app_id: mockConfig.intercom.appId, //eslint-disable-line
    name: actualUser.name,
    user_id: actualUser.userId,
    email: actualUser.email,
    created_at: actualUser.createdAt.valueOf(),
    custom: actualUser.custom
  };
  /* eslint-enable camelcase */

  assert.equal(intercomStub.calledWith('boot'), true, 'it called the intercom module');
  sinon.assert.calledWith(intercomStub, 'boot', expectedBootConfig);
});

test('normalizing meta data', function(assert) {
  let now = new Date();

  let service = this.subject();
  service.set('user.createdAt', now);
  service.set('user.userId', '1');
  service.set('user.email', 'user@example.com');
  service.set('user.name', 'Bobby Tables');
  service.set('user.fullName', 'Bobby Tables');

  run(() => service.start());

  /* eslint-disable camelcase */
  let expectedBootConfig = {
    app_id: mockConfig.intercom.appId,
    name: 'Bobby Tables',
    full_name: 'Bobby Tables',
    email: 'user@example.com',
    created_at: now.valueOf(),
    user_id: '1'
  };
  /* eslint-enable camelcase */

  assert.deepEqual(intercomStub.firstCall.args, ['boot', expectedBootConfig], 'it called the intercom module with boot');
  assert.equal(intercomStub.calledWith('onHide'), true, 'it called the intercom module with onHide');
  assert.equal(intercomStub.calledWith('onShow'), true, 'it called the intercom module with onShow');
  assert.equal(intercomStub.calledWith('onUnreadCountChange'), true, 'it called the intercom module with onUnreadCountChange');
});

test('autoUpdate', function(assert) {
  let service = this.subject();

  let expectedConfig = {
    name: 'Bobby Tables',
    email: 'user@example.com'
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