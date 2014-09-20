/**
 * Hayfever for Harvest
 * Background Application Module
 */

(function(window, undefined) {

  'use strict';

  var $ = require('jquery');
  var angular = require('angular');

  angular.module('hayfever.Background', [])
    //.config(require('./config'))
    .constant('version', require('../../../../package.json').version);

  $(function() {
    var appElement = angular.element(document.documentElement);
    angular.bootstrap(appElement, [ 'hayfever.Background' ]);
  });

})(window);
