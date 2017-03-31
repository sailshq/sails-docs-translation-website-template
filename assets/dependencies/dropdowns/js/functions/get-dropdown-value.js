(function (){

  angular.module('dropdowns').factory('getDropdownValue', [
    'getComponentMetadata',
    function (getComponentMetadata) {

    /**
     * getDropdownValue()
     *
     * Get the value (i.e. selected choice) of the dropdown with the specified DOM id.
     *
     * --------------------------------------------------------------------------------------------
     * @required {String} domId
     *
     * @returns {Dictionary} - the selected choice
     * --------------------------------------------------------------------------------------------
     */
    return function getDropdownValue (options) {

      var metadata = getComponentMetadata({ domId: options.domId });

      return metadata.choices[metadata.selectedChoiceIndex];

    };
  }]);

})();
