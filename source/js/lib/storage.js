/**
 * Hayfever for Harvest
 * Promise-based Chrome Storage Module
 */

/* global chrome */

(function(window, undefined) {

  'use strict';

  var Q = require('q');

  var storage = {
    get: function get(keys) {
      var deferred = Q.defer();

      chrome.storage.local.get(keys, function(vals) {
        deferred.resolve(vals);
      });

      return deferred.promise;
    },

    set: function set(vals) {
      var deferred = Q.defer();

      chrome.storage.local.set(vals, function() {
        deferred.resolve(vals);
      });

      return deferred.promise;
    },

    getBytes: function getBytes(keys) {
      var deferred = Q.defer();

      chrome.storage.local.getBytesInUse(keys, function(bytes) {
        return deferred.resolve(bytes);
      });

      return deferred.promise;
    },

    remove: function remove(keys) {
      var deferred = Q.defer();

      chrome.storage.local.remove(keys, function() {
        deferred.resolve(keys);
      });

      return deferred.promise;
    }
  };

  module.exports = storage;

})(window);
