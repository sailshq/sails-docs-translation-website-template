(function (){

  angular.module('raw-component').factory('removeComponent', [
    'rawComponent_ensureGlobalStateExists',
    function (rawComponent_ensureGlobalStateExists) {

    /**
     * removeComponent()
     *
     * Remove the component with the given unique ID from the DOM,
     * and free the memory associated w/ its internal representation.
     *
     * @required {String} domId
     *
     * @returns {Dictionary} [internal metadata for removed component]
     */
    return function removeComponent (options) {

      // Get namespace from dom id
      var namespace = options.domId.match(/(.+)--/)[1];

      //  ┌─┐┌─┐┬─┐┌─┐┌─┐┌┬┐  ┌─┐┌─┐┌┬┐┌─┐┌─┐┌┐┌┌─┐┌┐┌┌┬┐
      //  ├┤ │ │├┬┘│ ┬├┤  │   │  │ ││││├─┘│ ││││├┤ │││ │
      //  └  └─┘┴└─└─┘└─┘ ┴   └─┘└─┘┴ ┴┴  └─┘┘└┘└─┘┘└┘ ┴
      //
      // Ensure this is a component that exists, and is under our management,
      // then look up its metadata (while simultaneously removing it from the
      // `window` global.) This frees the memory associated w/ the component
      // w/ the given unique DOM id.

      // Ensure global state exists.
      rawComponent_ensureGlobalStateExists({namespace: namespace});

      // Ensure this is a component that exists, and is under our management,
      // then look up its metadata (while simultaneously destroying it.)
      var found = _.remove( window[namespace].onScreen, {domId: options.domId} );
      if (!_.isArray(found) || !_.isObject(found[0])) {
        // If metadata is missing, that's pretty weird.
        throw new Error('Consistency violation: Trying to remove component, but internal metadata for `'+namespace+'` component (DOM id: '+options.domId+') is missing!');
      }

      // If an `onRemove` notifier function was provided, call it now,
      // providing the component metadata as the first argument.
      if (_.isObject(found[0]._notifiers) && found[0]._notifiers.onRemove) {
        found[0]._notifiers.onRemove(found[0]);
      }


      //  ┬─┐┌─┐┌┬┐┌─┐┬  ┬┌─┐  ┌┬┐┌─┐┌─┐   ┬ ┬  ┬┬
      //  ├┬┘├┤ ││││ │└┐┌┘├┤    │ │ │├─┘───│ └┐┌┘│
      //  ┴└─└─┘┴ ┴└─┘ └┘ └─┘   ┴ └─┘┴     ┴─┘└┘ ┴─┘
      //  ┌─┐┬  ┌─┐┌┬┐┌─┐┌┐┌┌┬┐  ┌─┐┬─┐┌─┐┌┬┐  ╔╦╗╔═╗╔╦╗
      //  ├┤ │  ├┤ │││├┤ │││ │   ├┤ ├┬┘│ ││││   ║║║ ║║║║
      //  └─┘┴─┘└─┘┴ ┴└─┘┘└┘ ┴   └  ┴└─└─┘┴ ┴  ═╩╝╚═╝╩ ╩

      // Now look up and remove the editor from the DOM
      var $component = $('#'+options.domId);
      if ($component.length === 0) {
        // If zero component elements are matched, that's ok-- we just won't try and remove anything.
        return;
      }
      if ($component.length > 1) {
        // If multiple component elements are matched, that's weird.
        // We'll just remove them all (but we will log a warning)
        console.warn('WARNING: Trying to remove component, but the DOM id ('+options.domId+') provided matches more than one `'+namespace+'` element on the page.  Removed them all.');
      }
      $component.remove();

      // Return the metadata of the deleted component.
      return found[0];

    };
  }]);

})();
