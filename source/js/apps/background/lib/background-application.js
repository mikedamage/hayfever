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

    this._registerListeners();

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

    var self = this;
    var deferred = Q.defer();

    // [todo] - resolve w/ object that has the following properties:
    // + authorized
    // + projects
    // + clients
    // + timers
    // + totalHours
    // + currentHours
    // + currentTask
    // + harvestURL
    // + preferences

    return deferred.promise;
  };

  BackgroundApplication.prototype._registerListeners = function _registerListeners() {
    logger.log('bgApp:listeners', 'Registering async message listeners');

    var self = this;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      var methods = {
        refreshHours: function() {
          return self.refreshHours().then(sendResponse);
        },
        getEntries: function() {
          return sendResponse(self.getEntries());
        },
        addTimer: function() {
          var result;

          if (request.activeTimerID !== 0) {
            result = self.updateEntry(request.activeTimerID, request.task);
          } else {
            result = self.addEntry(request.task);
          }

          return result.then(sendResponse);
        }
      };

      logger.log('bgApp:messages', 'Got message: %O', request);

      if (methods.hasOwnProperty(request.method)) {
        methods[request.method].call(self);
        return true;
      }

      logger.log('bgApp:messages', 'Unknown method %s. Ignoring.', request.method);
      return false;
    });
  };

  module.exports = BackgroundApplication;

})(window);
