(function (){

  angular.module('dropdowns').factory('showDropdownChoices', [
    'getComponentMetadata',
    'renderImminentChoice',
    function (getComponentMetadata, renderImminentChoice) {

    /**
     * showDropdownChoices()
     *
     * Show the choices of the dropdown with the specified DOM id.
     *
     * --------------------------------------------------------------------------------------------
     * @required {String}  domId
     * @optional {Boolean} focus
     *                     Whether or not to focus the dropdown's hidden textarea.
     * --------------------------------------------------------------------------------------------
     */
    return function showDropdownChoices (options) {

      var metadata = getComponentMetadata({ domId: options.domId });

      // Set the `choicesVisible` flag on the metadata.
      metadata.choicesVisible = true;

      // Set the max-height for the dropdown choices:
      //
      // • Get the window height and the position of the select element.
      var windowHeight = $(window).height();
      var selectYPos = $('#'+options.domId).offset().top - $(window).scrollTop();
      var $restingState = $('[is="dropdown-resting-state"]');
      var selectBottomYPos = selectYPos + $restingState.height();
      var spaceBeneath = windowHeight - selectBottomYPos - 35;
      // • Assuming there's enough space, set the max height to be the amount of available space.
      // (if there isn't, set it  to be 100px)
      if(spaceBeneath >= 100) {
        $('#'+options.domId).find('[is="inner-options-container"]').css('max-height', spaceBeneath+'px');
      }
      else {
        $('#'+options.domId).find('[is="inner-options-container"]').css('max-height', '100px');
      }

      // Show the dropdown choices.
      $('#'+options.domId).find(metadata.choiceContainerSelector).show();

      // If the `focus` option is enabled, focus the hidden textarea.
      if(options.focus) {
        $('#'+options.domId).find('textarea[is="offscreen"]').focus();
      }

      // Reset the imminent choice to the selected index (if there is one) or
      // default to the first choice in the list.
      if (_.isUndefined(metadata.selectedChoiceIndex)) {
        metadata.imminentChoiceIndex = 0;
      }
      else {
        metadata.imminentChoiceIndex = metadata.selectedChoiceIndex;
      }
      // Then render the new imminent choice.
      renderImminentChoice({
        domId: options.domId,
        choiceSelector: metadata.choiceSelector
      });

      // Trigger the 'dropdown:opened' event.
      $('#'+metadata.domId).trigger('dropdown:opened');

    };
  }]);

})();
