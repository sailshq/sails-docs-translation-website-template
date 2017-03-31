(function (){

  angular.module('sails').factory('resizeCustomSelect', [
    function () {

    /**
     * resizeCustomSelect()
     *
     * Set the max-height & position of a custom select element.
     *
     * @required {String} domId
     *
     */
    return function resizeCustomSelect (options) {

      // Get the window height and the position of the select element.
      var windowHeight = $(window).height();
      console.log('window height:',windowHeight);
      var selectYPos = $('#'+options.domId).offset().top - $(window).scrollTop();

      var $restingState = $('[is="dropdown-resting-state"]');
      var selectBottomYPos = selectYPos + $restingState.height();
      console.log('top:',selectYPos);
      console.log('bottom:',selectBottomYPos);

      var spaceBeneath = windowHeight - selectBottomYPos - 35;
      console.log('space spaceBeneath',spaceBeneath);

      if(spaceBeneath >= 100) {
        $('#'+options.domId).find('[is="inner-options-container"]').css('max-height', spaceBeneath+'px');
      }
      else {
        $('#'+options.domId).find('[is="inner-options-container"]').css('max-height', '100px');
      }
    };
  }]);

})();
