import config from '../config/environment';
import Intercom from 'intercom';
import { setupIntercom } from 'ember-intercom-io';

export function initialize(/* container, application */) {
  if (typeof FastBoot === 'undefined') {
    setupIntercom(config);
  }
}

export default {
  name: 'ember-intercom',
  initialize: initialize
};
