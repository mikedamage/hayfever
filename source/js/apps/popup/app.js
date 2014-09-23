/**
 * Hayfever for Harvest
 * Popup Application Module
 */

(function(window, undefined) {

  'use strict';

  var $ = require('jquery');
  var angular = require('angular');

  console.log(angular);

  angular.module('hayfever.Popup', [])
    //.config(require('./config'))
    .constant('version', require('../../../../package.json').version);

  $(function() {
    var appElement = angular.element(document.documentElement);
    angular.bootstrap(appElement, [ 'hayfever.Popup' ]);
  });

})(window);
