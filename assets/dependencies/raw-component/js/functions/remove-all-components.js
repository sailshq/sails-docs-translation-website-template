(function (){

  angular.module('raw-component').factory('removeAllComponents', [
    'rawComponent_ensureGlobalStateExists',
    'removeComponent',
    function (rawComponent_ensureGlobalStateExists, removeComponent) {

    /**
     * removeAllComponents()
     *
     * Remove all components under the given namespace from the DOM,
     * and free the memory associated w/ their internal representation.
     *
     * @required {String} namespace
     */
    return function removeAllComponents (options) {

      // Ensure global state exists.
      rawComponent_ensureGlobalStateExists({namespace: options.namespace});

      // Loop over each on-screen component that belong to the given namespace
      // and remove each one-- both from the DOM and our internal representation.
      _.each(window[options.namespace].onScreen, function (metadata){
        removeComponent({
          domId: metadata.domId,
          namespace: options.namespace
        });
      });

    };
  }]);

})();
