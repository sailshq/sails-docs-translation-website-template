(function (){

  angular.module('dropdowns').factory('enableDropdown', [
    'getComponentMetadata',
    function (getComponentMetadata) {

    /**
     * enableDropdown()
     *
     * Enable the dropdown with the specified id, allowing it to be opened again and removing its
     * 'dropdown-disabled' class.
     *
     * --------------------------------------------------------------------------------------------
     * @required {String} domId
     * --------------------------------------------------------------------------------------------
     */
    return function enableDropdown (options) {

      var metadata = getComponentMetadata({ domId: options.domId });

      // Set the `disabled` flag to false in the metadata.
      metadata.disabled = false;

      // Remove the disabled class.
      $('#'+options.domId).removeClass('dropdown-disabled');

    };
  }]);

})();
