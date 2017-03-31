(function (){

  angular.module('dropdowns').factory('setDropdownValue', [
    'getComponentMetadata',
    'renderSelectedChoice',
    function (getComponentMetadata, renderSelectedChoice) {

    /**
     * setDropdownValue()
     *
     * Set the value (i.e. selected choice) of this dropdown
     * to the specified index within the array of choices.
     *
     * --------------------------------------------------------------------------------------------
     * @required  {String} domId
     * @required  {Number} selectedIndex
     * --------------------------------------------------------------------------------------------
     */
    return function setDropdownValue (options) {

      // Look up our component metadata.
      var metadata = getComponentMetadata({ domId: options.domId });

      // Set the `selectedChoice` in our internal metadata.
      metadata.selectedChoiceIndex = options.selectedIndex;

      // Now locate the set of all choice elements inside of our dropdown.
      var $choices = $('#'+metadata.domId).find(metadata.choiceSelector);

      // If there is a placeholder, then re-render it to reflect the change.
      if(!_.isUndefined(metadata.placeholderSelector)) {
        renderSelectedChoice({
          domId: options.domId,
          label: $choices.eq(options.selectedIndex).text()
        });
      }

    };
  }]);

})();
