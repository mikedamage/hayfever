/**
 * Hayfever for Harvest
 * Slug Manipulation Functions
 */

(function(window, undefined) {
  
  'use strict';

  var isString = require('lodash.isstring');

  var slugger = {
    slugify: function(str) {
      if (!isString(str)) {
        return '';
      }

      var replacePattern = /[^a-zA-Z0-9\s\-\_]/g;
      return str.replace(replacePattern, '').toLowerCase().replace(/\s/g, '_');
    }
  };

  module.exports = slugger;

})(window);
