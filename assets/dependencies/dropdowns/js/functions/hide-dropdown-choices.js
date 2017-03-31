(function (){

  angular.module('dropdowns').factory('hideDropdownChoices', [
    'getComponentMetadata',
    function (getComponentMetadata) {

    /**
     * hideDropdownChoices()
     *
     * Hide the choices of the dropdown with the specified DOM id.
     *
     * --------------------------------------------------------------------------------------------
     * @required {String} domId
     * --------------------------------------------------------------------------------------------
     */
    return function hideDropdownChoices (options) {

      var metadata = getComponentMetadata({ domId: options.domId });

      // Set the `choicesVisible` flag on the metadata.
      metadata.choicesVisible = false;

      // Hide the dropdown choices.
      $('#'+options.domId).find(metadata.choiceContainerSelector).hide();

      // Trigger the 'dropdown:closed' event.
      $('#'+metadata.domId).trigger('dropdown:closed');

    };
  }]);

})();
