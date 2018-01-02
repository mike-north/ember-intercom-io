import { getWithDefault } from '@ember/object';
import IntercomService from 'ember-intercom-io/services/intercom';
import cfg from '../config/environment';

export default IntercomService.extend({
  config: getWithDefault(cfg, 'intercom', {})
});
