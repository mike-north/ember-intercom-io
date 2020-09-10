import { get } from '@ember/object';
import IntercomService from 'ember-intercom-io/services/intercom';
import cfg from '../config/environment';

export default IntercomService.extend({
  config: get(cfg, 'intercom') ?? {}
});
