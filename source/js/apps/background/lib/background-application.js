/**
 * Hayfever for Harvest
 * Background Application Module
 */

/* global chrome */

(function(window, undefined) {

  'use strict';

  var logger      = require('bragi-browser');
  var Harvest     = require('../../../lib/harvest');
  var manifest    = require('../../../../manifest.json');

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
    this.version       = manifest.version;
    this.intervals     = {
      refresh: 0,
      badge: 0
    };
    this.authorized    = false;
    this.client        = new Harvest(_subdomain, _authString);
    this.totalHours    = 0.0;
    this.currentHouse  = 0.0;
    this.currentTask   = null;
    this.refreshTime   = 36e3;
    this.todaysEntries = [];
    this.projects      = [];
    this.timerRunning  = false;

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

    chrome.browserAction.setTitle({ title: 'Hayfever for Harvest' });

    if (_subdomain && _authString) {
      this.start();
    }

    logger.log('bgApp:startup', 'Background app instance initialized');
  };

  BackgroundApplication.prototype.start = function start() {
    if (this.intervals.refresh) {
      logger.log('bgApp:intervals', 'Clearing previous refresh interval');
      window.clearInterval(this.intervals.refresh);
      this.intervals.refresh = 0;
    }

    logger.log('bgApp:intervals', 'Setting refresh interval to every %d ms', this.refreshTime);

    this.intervals.refresh = window.setInterval(this.refreshHours, this.refreshTime);
  };

  BackgroundApplication.prototype.refreshHours = function refreshHours() {
    logger.log('bgApp:refresh', 'Refreshing data from Harvest API');
  };

  module.exports = BackgroundApplication;

})(window);
