(function (){

  angular.module('dropdowns').factory('renderSelectedChoice', [
    'getComponentMetadata',
    function (getComponentMetadata) {

    /**
     * renderSelectedChoice()
     *
     * Render the specified label as the placeholder for this dropdown.
     * (should only be called if dropdown is using a `placeholderSelector`).
     *
     * @required {String} domId
     * @required {String} label
     *
     */
    return function renderSelectedChoice (options) {

      // Look up our internal metadata.
      var metadata = getComponentMetadata({ domId: options.domId, namespace: 'dropdowns' });

      if (_.isUndefined(metadata.placeholderSelector)) {
        throw new Error('Consistency violation: Should never call renderSelectedChoice if a `placeholderSelector` is not being used for this dropdown.');
      }

      // Re-render the selected choice to reflect the change.
      $('#'+options.domId).find(metadata.placeholderSelector).text(options.label);

    };
  }]);

})();
