(function (){

  angular.module('raw-component').factory('replaceWithComponent',
  [
  'rawComponent_ensureGlobalStateExists',
  function (rawComponent_ensureGlobalStateExists) {

    /**
     * replaceWithComponent()
     *
     * Replace an existing DOM element with a new raw component with the specified template,
     * metadata, and DOM event handlers-- specifically, replace an existing element
     * identified by the specified `domNode`. Also register it--
     * meaning we allocate some window-global memory as an internal representation
     * of its state.
     *
     * Note that this function generates a unique DOM id for the component.
     * This unique id is how the component should be addressed in calls to other
     * functions in this module (i.e. `removeComponent` and `getComponentMetadata`).
     *
     * Also note that if the node being replaces happens to be a raw component,
     * it won't be cleaned up automatically. Take care of that beforehand.
     *
     * --------------------------------------------------------------------------------------------
     * @required {DomNode} domNode
     *           the DOM node to replace.
     *
     * @required {String} namespace
     *           the name of the variable on the `window` where metadata about the specific raw component of interest is/will be housed.
     *
     * @required {String|JQueryElement} html
     *           the base HTML template string for this component.
     *           (alternatively, a jQuery element that is not-yet-appended to the DOM can be provided)
     *
     * @optional {Dictionary} metadata - a dictionary of intial metadata for this component
     *                   (should not contain a "domId" property-- that will be added by
     *                    this function)
     *
     * @optional {Array} events - a list of DOM event specifications for this component
     *           @of {Dictionary}
     *               @property {String} on - the name of the DOM event, e.g. "click".  May also include a space followed by more specifics (e.g. "keydown <LEFT_ARROW>")
     *               @property {¿String?} selector - the selector to delegate (leave undefined to bind the event on the top-level)
     *               @property {¿Boolean?} stopPropagation - if set, `e.stopPropagation()` will be called before the `fn` handler is called
     *               @property {¿Boolean?} preventDefault - if set, `e.preventDefault()` will be called before the `fn` handler is called
     *               @property {Function} fn
     *                         @param {Event} e - the raw DOM event
     *
     * --------------------------------------------------------------------------------------------
     * @return {String} the DOM id for the new component
     */
    return function (options) {

      // Validate required options.
      if (!_.isObject(options) || !options.namespace) {
        throw new Error('Trying to append component (in `replaceWithComponent`) but no valid namespace was provided.');
      }
      if (!options.domNode) {
        throw new Error('Trying to append component (in `replaceWithComponent`) but no valid `domNode` was provided.');
      }
      if (!options.html) {
        throw new Error('Trying to append component (in `replaceWithComponent`) but no valid `html` template was provided.');
      }

      // Set up an entry in our internal metadata for the new component
      // (note that this is what assigns it a unique-on-this-page id)
      ////////////////////////////////////////////////////////////////////////////////////////

      // Ensure global state exists
      rawComponent_ensureGlobalStateExists({namespace: options.namespace});

      // Build new metadata
      var newMetadata = {

        // The `domId` is a unique string which can be used to address
        // this component on the page.  In other words, this is the
        // "id" attribute of the HTML element which is the embodiment
        // of this editor.
        //
        // For example, one could select the component's top-level element
        // from the DOM using, e.g.:
        // ```
        // $('#'+domId)
        // ```
        domId: options.namespace+'--'+window[options.namespace].nextIdSeed

      };


      // If additional metadata was provided (which it almost always is), store it
      // and ensure we're working with a deep-cloned copy.
      if (options.metadata) {
        newMetadata = _.cloneDeep(_.extend(options.metadata, newMetadata));
      }

      // Push new component metadata into our `onScreen` array
      window[options.namespace].onScreen.push(newMetadata);

      // Increment `nextIdSeed`
      window[options.namespace].nextIdSeed++;


      // Build a jQuery element for the component.
      ////////////////////////////////////////////////////////////////////////////////////////
      var HTML_TEMPLATE = options.html;
      var $component = $(HTML_TEMPLATE);


      // Bind DOM events
      ////////////////////////////////////////////////////////////////////////
      _.each(options.events||[], function (eventRoute) {

        // Parse advanced event routing syntax if it was used.
        var pieces = eventRoute.on.split(/\s+/);
        // The `eventType` (e.g. "click") is always the first part of
        // the event address.
        var eventType = pieces.shift();
        // The `eventArgs` (e.g. ["<LEFT_ARROW>"]) are the remaining
        // non-whitespace/non-empty whitespace-delimited substrings from
        // the event address.
        var eventArgs = _.reduce(pieces, function (memo, piece){
          if (piece.match(/[^\s]+/)) {
            memo.push(piece);
          }
          return memo;
        }, []);
        // ------------------------------------------------------------------------
        // NOTE: I put this stuff ^^^^ on hold for now-- better to keep things simple
        // and explicit unless stuff gets utterly unmaintainable in userland.
        // ------------------------------------------------------------------------

        // Build interceptor function to process stopPropagation/preventDefault
        // notation, as well as advanced event routing syntax.
        var interceptorFn = function(e){
          if (eventRoute.stopPropagation) {
            e.stopPropagation();
          }
          if (eventRoute.preventDefault) {
            e.preventDefault();
          }
          if (eventRoute.fn) {
            return eventRoute.fn(e);
          }
        };

        // Now bind the appropriate DOM event
        if (eventRoute.selector) {
          $component.on(eventType, eventRoute.selector, interceptorFn);
        }
        else {
          $component.on(eventType, interceptorFn);
        }
      });



      // Render
      ////////////////////////////////////////////////////////////////////////

      // Set the `id` attribute of the component's DOM element
      // to the `domId` we stored in our metadata.
      $component.attr('id', newMetadata.domId);

      // Now append our new editor element to the container element
      // (this actually puts it in the DOM)
      $(options.domNode).replaceWith($component);

      // Return the DOM id of our new component.
      return newMetadata.domId;
    };
  }]);

})();



