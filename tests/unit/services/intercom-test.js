import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { setProperties } from '@ember/object';
import { settled } from '@ember/test-helpers';

const mockConfig = {
  intercom: {
    userProperties: {
      nameProp: 'name',
      emailProp: 'email',
      userHashProp: 'hash',
      userIdProp: 'id',
      createdAtProp: 'createdAt'
    },
    appId: '1',
    languageOverride: null
  }
};
let intercomStub;

module('Unit | Service | intercom', function(hooks) {

  setupTest(hooks);
  hooks.beforeEach(function() {
    this.owner.register('service:config', mockConfig, { instantiate: false });

    let service = this.owner.lookup('service:intercom');

    intercomStub = sinon.stub();

    service.set('api', intercomStub);
    service.set('config', mockConfig.intercom);
  });


  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:intercom');
    assert.ok(service);
  });

  test('it adds the correct user context to the boot config', async function(assert) {
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
    let service = this.owner.lookup('service:intercom');

    setProperties(service.user, actualUser);

    service.start();

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    let expectedBootConfig = {
      app_id: mockConfig.intercom.appId, //eslint-disable-line
      language_override: mockConfig.intercom.languageOverride,
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
    await settled();
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    assert.deepEqual(
      intercomStub.firstCall.args,
      ['boot', expectedBootConfig],
      'it called the intercom module with boot'
      );
      sinon.assert.calledWith(intercomStub, 'boot', expectedBootConfig);
    await settled();
    assert.equal(intercomStub.calledWith('onHide'), true, 'it called the intercom module with onHide');
    assert.equal(intercomStub.calledWith('onShow'), true, 'it called the intercom module with onShow');
    assert.equal(intercomStub.calledWith('onUnreadCountChange'), true, 'it called the intercom module with onUnreadCountChange');
  });

  test('update gets called when user properties change', function(assert) {
    let service = this.owner.lookup('service:intercom');

    let expectedConfig = {
      name: 'Bobby Tables',
      email: 'user@example.com',
      app_id: mockConfig.intercom.appId, //eslint-disable-line
      language_override: mockConfig.intercom.languageOverride
    };

    service.boot();

    service.setProperties({
      user: {
        name: 'Bobby Tables',
        email: 'user@example.com'
      }
    });

    assert.deepEqual(
      intercomStub.lastCall.args,
      ['update', expectedConfig],
      'it called the intercom module with update'
    );
  });

  test('Track events in intercom', function(assert) {
    let service = this.owner.lookup('service:intercom');
    /* eslint-disable camelcase */
    let eventName = 'invited-friend';
    let metadata = {
      friend_name: 'bobby tables',
      friend_email: 'bobby@tables.com'
    };
    /* eslint-enable camelcase */

    service.boot();
    service.trackEvent(eventName, metadata);

    assert.equal(intercomStub.calledWith('trackEvent'), true, 'Intercom track event method called');
    sinon.assert.calledWith(intercomStub, 'trackEvent', eventName, metadata);
  });

  test('Calls out to methods in intercom API', function(assert) {
    let service = this.owner.lookup('service:intercom');
    let methods = ['getVisitorId', 'show', 'hide', 'showMessages'];

    service.boot();
    methods.forEach(method => {
      service[method]();
      assert.equal(intercomStub.calledWith(method), true, `Intercom method called -- ${method}`);
    });

    service.startTour(123);
    assert.equal(intercomStub.calledWith('startTour'), true, 'Intercom method called -- startTour');
    sinon.assert.calledWith(intercomStub, 'startTour', 123);
  });
});
