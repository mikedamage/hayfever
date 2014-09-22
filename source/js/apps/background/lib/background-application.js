/**
 * Hayfever for Harvest
 * Background Application Module
 */

(function(window, undefined) {

  'use strict';

  var logger = require('bragi-browser');
  var Harvest = require('../../../lib/harvest');

  var BackgroundApplication = function BackgroundApplication(subdomain, authString) {
    // Force single instance per runtime
    if (BackgroundApplication.prototype._singletonInstance) {
      return BackgroundApplication.prototype._singletonInstance;
    }

    BackgroundApplication.prototype._singletonInstance = this;

    // Private vars
    var self        = this;
    var _subdomain  = String(subdomain);
    var _authString = String(authString);

    // Public properties
    this.client = new Harvest(_subdomain, _authString);

    // this.subdomain getter + setter
    Object.defineProperty(this, 'subdomain', {
      enumerable: true,
      get: function() {
        return _subdomain;
      },
      set: function(val) {
        _subdomain = String(val);
        logger.log('bgApp:properties', 'Subdomain changed. Reinitializing Harest API instance.');
        self.client = new Harvest(_subdomain, self.authString);
        return _subdomain;
      }
    });

    // this.authString getter + setter
    Object.defineProperty(this, 'authString', {
      enumerable: true,
      get: function() {
        return _authString;
      },
      set: function(val) {
        _authString = String(val);
        logger.log('bgApp:properties', 'Auth String changed. Reinitializing the Harvest API instance.');
        self.client = new Harvest(self.subdomain, _authString);
        return _authString;
      }
    });


    logger.log('bgApp:startup', 'Background app instance initialized');
  };

  module.exports = BackgroundApplication;

})(window);
