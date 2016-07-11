import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import sinon from 'sinon';

const {
  run
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
let oldIntercom = window.Intercom;
moduleFor('service:intercom', 'Unit | Service | intercom', {
  beforeEach() {
    this.register('service:config', mockConfig, { instantiate: false });

    intercomStub = sinon.stub();
    window.Intercom = intercomStub;
    // this.subject().set('api', intercomStub);
    this.subject().set('config', mockConfig.intercom);
  },
  afterEach() {
    window.Intercom = oldIntercom;
  }
});

test('it adds the correct user context to the boot config', function(assert) {
  let actualUser = {
    name: 'foo',
    email: 'foo@foo.com',
    createdAt: new Date(),
    custom: 'my-custom-property'
  };

  let service = this.subject();

  service.set('user', actualUser);

  run(() => {
    service.start({
      custom: actualUser.custom
    });
  });

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  let expectedBootConfig = {
    app_id: mockConfig.intercom.appId,
    name: actualUser.name,
    email: actualUser.email,
    created_at: actualUser.createdAt,
    custom: actualUser.custom
  };
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  assert.ok(intercomStub.calledOnce, 'it called the intercom module');
  sinon.assert.calledWith(intercomStub, 'boot', expectedBootConfig);
});
