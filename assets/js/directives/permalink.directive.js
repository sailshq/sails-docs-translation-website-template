angular.module('sails')
.directive('permalink', [

/**
 * Dependencies
 */


function() {


  /**
   * permalink
   *
   * @class        {angular.directive}
   * @module       Sails
   * @type         {Function}
   * @description  Adds a little deal that you can click to build a permalink to
   *               a particular heading within a page on the site.
   *
   * ---------------------------------------------------------
   * Usage:
   *
   * <h1 permalink="want-to-learn-kungfu">Want to learn Kung.Fu?</h1>
   *
   */

  function render (scope, $el, attrs) {

    var linkName = _.kebabCase(attrs.permalink);
    var link = '#?'+ linkName;

    var $ = angular.element;
    var html = '<a href="'+ link +'" name="'+linkName+'" class="permalink-thing" id="'+ linkName +'">#</a>';
    $el.after(html);
  }

  // exports
  return {
    link: function(scope, element, attrs) {
      render(scope,element,attrs);
    }
  };

}]);


