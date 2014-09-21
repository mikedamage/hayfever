/**
 * Hayfever for Harvest
 * Background Application Module
 */

(function(window, undefined) {

  'use strict';

  var BackgroundApplication = function BackgroundApplication(subdomain, authString) {
  
    this.subdomain  = subdomain;
    this.authString = authString;

  };

  module.exports = BackgroundApplication;

})(window);
