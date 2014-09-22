/**
 * Hayfever for Harvest
 * Background Application Module
 */

/* global chrome */

(function(window, undefined) {

  'use strict';

  var storage = require('../../lib/storage');
  var BackgroundApplication = require('./lib/background-application');

  storage.get(['subdomain', 'authString']).then(function(items) {
    if (items.subdomain && items.authString) {
      window.application = new BackgroundApplication(items.subdomain, items.authString);
    } else {
      window.application = new BackgroundApplication(false, false);
      chrome.browserAction.setBadgeText({ text: '!!!' });
      console.error('Error initializing Hayfever. Please visit options page.');
    }
  });


})(window);
