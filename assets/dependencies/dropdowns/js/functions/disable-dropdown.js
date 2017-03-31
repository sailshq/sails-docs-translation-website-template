(function (){

  angular.module('dropdowns').factory('disableDropdown', [
    'getComponentMetadata',
    function (getComponentMetadata) {

    /**
     * disableDropdown()
     *
     * Disable the dropdown with the specified id,  adding its 'dropdown-disabled' class.
     * (And close it if it's open.)
     *
     * --------------------------------------------------------------------------------------------
     * @required {String} domId
     * --------------------------------------------------------------------------------------------
     */
    return function disableDropdown (options) {

      var metadata = getComponentMetadata({ domId: options.domId });

      // Set the `disabled` flag in the metadata.
      metadata.disabled = true;

      // Hide the options container.
      $('#'+options.domId).find(metadata.choiceContainerSelector).hide();

      // Add the disabled class.
      $('#'+options.domId).addClass('dropdown-disabled');

    };
  }]);

})();
