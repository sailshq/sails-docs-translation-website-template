(function (){

  angular.module('raw-component').factory('getComponentMetadata', [
    'rawComponent_ensureGlobalStateExists',
    function (rawComponent_ensureGlobalStateExists) {

    /**
     * getComponentMetadata()
     *
     * Look up metadata for the component w/ the specified id.
     *
     * @required {String} domId
     *
     * @returns {===} direct reference to stored metadata dictionary for the component.
     * @throws {Error} If no component exists with the given id
     */
    return function getComponentMetadata (options) {
      if (_.isUndefined(options.domId)) {
        throw new Error('Usage error: no `domId` was provided to getComponentMetadata().');
      }

      // Get namespace from dom id
      // (the `namespace` is the name of the property on the `window` global where metadata
      //  about this specific raw component is housed)
      var namespace = options.domId.match(/(.+)--/)[1];

      // Ensure global state exists.
      rawComponent_ensureGlobalStateExists({namespace: namespace});

      // Look up the metadata for this component using the `domId` that was provided.
      var metadata = _.find(window[namespace].onScreen, {domId: options.domId});
      if (!metadata) {
        var dneErr = new Error('Internal error: No known `'+namespace+'` component on page w/ domId: `'+options.domId+'`');
        dneErr.code = 'doesNotExist';
        throw dneErr;
      }

      return metadata;

    };
  }]);

})();
