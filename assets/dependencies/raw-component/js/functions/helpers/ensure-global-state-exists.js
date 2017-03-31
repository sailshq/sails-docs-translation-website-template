(function (){

  angular.module('raw-component').factory('rawComponent_ensureGlobalStateExists', [
    function () {

    /**
     * rawComponent_ensureGlobalStateExists()
     *
     * Makes sure that the `window[WINDOW_NAMESPACE]` dictionary exists
     * and is ready to use.
     *
     * ------------------------------------------------------------------------
     * @required {String} namespace
     *           the name of the variable on the `window` where metadata about
     *           the specific raw component of interest is/will be housed.
     * ------------------------------------------------------------------------
     *
     * For example, `window[WINDOW_NAMESPACE]` might be:
     * ```
     * {
     *   nextIdSeed: 7,
     *   onScreen: [{domId: 'x...'}, {domId: 'y...'}]
     * }
     * ```
     */
    return function ensureGlobalStateExists(options) {
      if (!_.isObject(options) || !options.namespace) {
        throw new Error('Trying to ensure global state (`rawComponent_ensureGlobalStateExists`) but no valid namespace was provided.');
      }

      // Ensure `window[WINDOW_NAMESPACE]` exists as a global.
      if (!_.isObject(window[options.namespace])) {
        window[options.namespace] = {};
      }

      // Ensure `window[options.namespace].nextIdSeed` exists, and initialize it
      // if it does not.  `nextIdSeed` is how we keep track of the seed that will
      // be used to generate the unique DOM id for the next component that's created.
      if (!_.isNumber(window[options.namespace].nextIdSeed)) {
        window[options.namespace].nextIdSeed = 1;
      }

      // Ensure `window[options.namespace].onScreen` exists, and set it up
      // as an empty array if it doesn't.
      // `onScreen` is an array of dictionaries. Each has:
      //   • a unique (per page) DOM id
      //   • usually other stuff
      if (!_.isArray(window[options.namespace].onScreen)) {
        window[options.namespace].onScreen = [];
      }

    };
  }]);

})();
