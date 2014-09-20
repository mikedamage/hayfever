/**
 * Hayfever for Harvest
 * Harvest API Interface
 */

(function(window, undefined) {

  'use strict';

  var moment      = require('moment');
  var clock       = require('./clock');
  var slugger     = require('./slugger');
  var forEach     = require('lodash.foreach');
  var isObject    = require('lodash.isobject');
  var isUndefined = require('lodash.isundefined');

  var isInvalidOpts = function(obj) {
    return isUndefined(obj) || !isObject(obj);
  };

  var validateOpts = function(obj) {
    return (isInvalidOpts(obj) ? {} : obj);
  };

  var Harvest = function Harvest(subdomain, authString) {

    this.subdomain    = subdomain;
    this.authString   = authString;
    this.fullURL      = 'https://' + this.subdomain + '.harvestapp.com';
    this.ajaxDefaults = {
      type: 'GET',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': 'Basic ' + this.authString,
        'Accept': 'application/json'
      }
    };

  };

  Harvest.authString = function(username, password) {
    var authString = '' + username + ':' + password;
    return btoa(authString);
  };

  Harvest.prototype._buildURL = function() {
    var url = this.fullURL; 

    forEach(arguments, function(arg) {
      url += '/' + arg;
    });

    return url + '.json';
  };

  Harvest.prototype._buildAjaxOpts = function(opts) {
    if (isInvalidOpts(opts)) {
      opts = {};
    }
    return $.extend(this.ajaxOpts, opts);
  };

  Harvest.prototype.rateLimitStatus = function(opts) {
    opts = validateOpts(opts);
    opts = this._buildAjaxOpts(opts);
    var url = this._buildURL('account', 'rate_limit_status');
    return $.ajax(url, opts);
  };

  Harvest.prototype.getDay = function(date, opts) {
    var now     = moment();
    date        = isUndefined(date) ? now : moment(date);
    opts        = validateOpts(opts);
    opts        = this._buildAjaxOpts(opts);
    var isToday = date.isSame(moment(), 'day');
    var dayURL  = isToday ? this._buildURL('daily') : this._buildURL('daily', date.format('DDD'), date.format('YYYY'));

    return $.ajax(dayURL, opts);
  };

  Harvest.prototype.getToday = function(opts) {
    return this.getDay(moment(), opts);
  };

  Harvest.prototype.getEntry = function(eid, opts) {
    opts    = validateOpts(opts);
    opts    = this._buildAjaxOpts(opts);
    var url = this._buildURL('daily', 'show', eid);

    return $.ajax(url, opts);
  };

  Harvest.prototype.toggleTimer = function(eid, opts) {
    opts = validateOpts(opts);
    var url = this._buildURL('daily', 'timer', String(eid));

    return $.ajax(url, opts);
  };

  Harvest.prototype.addEntry = function(props, opts) {
    opts = validateOpts(opts);
    opts = this._buildAjaxOpts($.extend(opts, {
      type: 'POST',
      data: props
    }));
    var url = this._buildURL('daily', 'add');

    return $.ajax(url, opts);
  };

  Harvest.prototype.deleteEntry = function(eid, opts) {
    opts = validateOpts(opts);
    opts = this._buildAjaxOpts($.extend(opts, {
      type: 'DELETE'
    }));
    var url = this._buildURL('daily', 'delete', String(eid));

    return $.ajax(url, opts);
  };

  Harvest.prototype.updateEntry = function(eid, props, opts) {
    opts = validateOpts(opts);
    opts = this._buildAjaxOpts($.extend(opts, {
      type: 'POST',
      data: props
    }));
    var url = this._buildURL('daily', 'update', String(eid));

    return $.ajax(url, opts);
  };

  module.exports = Harvest;

})(window);
