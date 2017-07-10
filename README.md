# ember-intercom-io

[![Greenkeeper badge](https://badges.greenkeeper.io/mike-north/ember-intercom-io.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/mike-north/ember-intercom-io.svg?branch=master)](https://travis-ci.org/mike-north/ember-intercom-io)
[![Code Climate](https://codeclimate.com/github/mike-north/ember-intercom-io/badges/gpa.svg)](https://codeclimate.com/github/mike-north/ember-intercom-io)
[![Dependency Status](https://david-dm.org/mike-north/ember-intercom-io.svg)](https://david-dm.org/mike-north/ember-intercom-io)
[![devDependency Status](https://david-dm.org/mike-north/ember-intercom-io/dev-status.svg)](https://david-dm.org/mike-north/ember-intercom-io#info=devDependencies)
[![Ember Observer Score](http://emberobserver.com/badges/ember-intercom-io.svg)](http://emberobserver.com/addons/ember-intercom-io)

[Intercom.io](http://intercom.io) for Ember.js apps.

This README outlines the details of collaborating on this Ember addon.

## Setup

**Install this addon with ember-cli** `ember install ember-intercom-io`

**Add the `{{intercom-io}}` component to one of your templates`**
The chat widget will appear whenever this component has been rendered, and should disappear whenever it's destroyed.

### Configuration

**In your `config/environment.js` file, you must provide your `appId`**

```js

module.exports = function(environment) {
  ...
  intercom: {
    appId: null, // <-- REPLACE WITH YOUR INTERCOM.IO app_id
    enabled: true, // <-- Setting to false in your testing environment prevents unneccessary network requests (true by default)
  },
  ...
};

```

**Configure Route Mixin**

Add the `IntercomRoute` Mixin to your router.

```js
// app/router.js
import Ember from 'ember';
import IntercomRoute from 'ember-intercom-io/mixins/intercom-route';

const Router = Ember.Router.extend(IntercomRoute, {
  ...
});

Router.map(function() {
  ...
};

export default Router;

```

**Identity Verification**

If you're looking to enable identify verification, follow the [documentation located here](https://docs.intercom.com/configure-intercom-for-your-product-or-site/staying-secure/enable-identity-verification-on-your-web-product)
and simply add the `user_hash` to the intercom service's `user` property. 

## API

The `intercom` service exposes several public API methods that match Intercom.com's
existing Javascript API. For full details on the client API, [read the Intercom docs.](https://developers.intercom.com/v2.0/docs/intercom-javascript#section-intercomonhide)

### Properties

|    Name      |      Type         |
| autoUpdate   | Boolean           |
| hideDefaultLauncher | Boolean    |
| isOpen       | Boolean           |
| isBooted     | Boolean           |
| unreadCount  | Integer           |
| user         | Object            |

### Methods

The following intercom methods are implemented. See `services/intercom.js` for full
details.

`boot()`

`update()`

`shutdown()`

`hide()`

`show()`

`showMessages()`

`showNewMessage()`

`trackEvent()`

`getVisitorId()` Returns the current id of the logged in user.

### Events

Subscribe to events in your app with event listeners:

```js
//fancy-component.js

...

intercom: Ember.inject.service(),
newMessageAlert: Ember.on('intercom.unreadCountChange', function() {
    alert('Unread Count Changed!');
}),

...

```

**Available Events**

(Read the Intercom documentation for full details)[https://developers.intercom.com/v2.0/docs/intercom-javascript#section-intercomonhide]

| Ember Event | Intercom Event |
| hide        | `onHide`       |
| show        | `onShow`       |
| unreadCountChange | `onUnreadCountChange` |



## Installation

* `git clone` this repository
* `npm install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

Copyright (c) 2015 Levanto Financial
