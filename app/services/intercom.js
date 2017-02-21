import Ember from 'ember';
import IntercomService from 'ember-intercom-io/services/intercom';
import cfg from '../config/environment';

const { getWithDefault } = Ember;

export default IntercomService.extend({
  config: getWithDefault(cfg, 'intercom', {})
});
