(function (){

  angular.module('sails').factory('setHomepageBottomPadding', [
    function () {

    /**
     * setHomepageBottomPadding()
     *
     * Set the homepage's bottom padding to the height of the footer.
     *
     */
    return function setHomepageBottomPadding (options) {
      var footerHeight = $('#footer').height();
      $('#sails-page_homepage').css('padding-bottom', footerHeight+'px');
    };
  }]);

})();
