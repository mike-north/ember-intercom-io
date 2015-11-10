# ember-intercom-io

[![Build Status](https://travis-ci.org/Levanto-Financial/ember-intercom-io.svg?branch=master)](https://travis-ci.org/Levanto-Financial/ember-intercom-io)
[![Code Climate](https://codeclimate.com/github/Levanto-Financial/ember-intercom-io/badges/gpa.svg)](https://codeclimate.com/github/Levanto-Financial/ember-intercom-io)
[![Dependency Status](https://david-dm.org/Levanto-Financial/ember-intercom-io.svg)](https://david-dm.org/Levanto-Financial/ember-intercom-io)
[![devDependency Status](https://david-dm.org/Levanto-Financial/ember-intercom-io/dev-status.svg)](https://david-dm.org/Levanto-Financial/ember-intercom-io#info=devDependencies)

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
    appId: null // <-- REPLACE WITH YOUR INTERCOM.IO app_id
  },
  ...
};

```


#### Users vs Leads

In the intercom.io world, a lead is a visitor to your site or app, without an email or name associated with them. A user has a name and email, and is a good construct for tracking the history of all interactions w/ a single person.

You can make `ember-intercom` aware of a "user" context (shifting into "users" mode instead of "leads" mode) by adding an object to the `intercom` service (i.e., your user authentication service).

**app/services/authentication.js**
```js
import Ember from 'ember';

const { inject } = Ember;

export default Ember.Service.extend({
  intercom: inject.service(), // the intercom service
  didLogin(user) {
    ...
    this.get('intercom').set('user.name', 'Joe Username');
    this.get('intercom').set('user.email', 'joe@example.com');
    this.get('intercom').set('user.createdAt', 1447135065173);
  }
});

```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

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
