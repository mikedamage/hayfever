/**
 * Hayfever for Harvest
 * Clock Module - Time Manipulation Functions
 */

(function(window, undefined) {

  'use strict';

  var moment   = require('moment');
  var isNumber = require('lodash.isnumber');

  var clock = {
    harvestDateFormat: 'ddd, DD MM YYYY',
    dateToHarvest: function(date) {
      if (typeof date === 'undefined') {
        date = new Date();
      }

      date = moment(date);
      return moment.format(this.harvestDateFormat);
    },
    numToClock: function(num) {
      if (num === 0 || !isNumber(num)) {
        return '0:00';
      }

      var stringVal    = num.toFixed(2);
      var decimalSplit = stringVal.split('.');
      var hours        = parseInt(decimalSplit[0], 10);
      var minutes      = parseFloat('0.' + decimalSplit[1]);
      minutes          = parseInt(minutes * 60, 10);

      if (minutes < 10) {
        return '' + hours + ':0' + minutes;
      }

      return '' + hours + ':' + minutes;
    }
  };

  module.exports = clock;

})(window);
