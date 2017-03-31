(function (){

  angular.module('raw-component').factory('appendComponent',
  [
  'rawComponent_ensureGlobalStateExists',
  function (rawComponent_ensureGlobalStateExists) {

    /**
     * appendComponent()
     *
     * Append a raw component to the DOM with the specified template, metadata, and
     * DOM event handlers-- specifically, append it within the container element
     * identified by the specified `containerSelector`. Also register it--
     * meaning we allocate some window-global memory as an internal representation
     * of its state.
     *
     * Note that this function generates a unique DOM id for the component.
     * This unique id is how the component should be addressed in calls to other
     * functions in this module (i.e. `removeComponent` and `getComponentMetadata`).
     *
     * --------------------------------------------------------------------------------------------
     * @requires
     *   @either {String} containerSelector
     *            a DOM selector which uniquely identifies the container element
     *            that the new component should be appended to.
     *   @or {String} $container
     *            a jQuery element which the new component should be appended to.
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
     * @optional {Boolean} dontCloneMetadata
     *            If set, the provided metadata will not be deep-cloned.
     *            Good for huge objects (like the `library` or wet objects (like a JS library).
     *            Deafults to false.
     *
     * @optional {Function} onRemove
     *           a notifier function that, if provided, will be called automatically
     *           when this component is being removed.  Since a component can only be
     *           removed once, you can rest assured this function will only be called
     *           one time.
     *           @param {Dictionary} metadata
     *                  the metadata for the component being removed is provided as the
     *                  first argument.
     *
     * --------------------------------------------------------------------------------------------
     * @return {String} the DOM id for the new component
     */
    return function appendComponent (options) {

      // Validate options.
      if (!_.isObject(options) || !options.namespace) {
        throw new Error('Trying to append component (in `appendComponent`) but no valid namespace was provided.');
      }
      if (!options.containerSelector && !options.$container) {
        throw new Error('Trying to append component (in `appendComponent`) but no valid `containerSelector` or `$container` was provided.');
      }
      if (!options.html) {
        throw new Error('Trying to append component (in `appendComponent`) but no valid `html` template was provided.');
      }
      if (options.onRemove && !_.isFunction(options.onRemove)) {
        throw new Error('Trying to append component (in `appendComponent`) but the provided `onRemove` notifier is not a function (it\'s a `'+(typeof options.onRemove)+'`).');
      }
      if (options.namespace.match(/--/)){
        throw new Error('Trying to append component (in `appendComponent`) but the provided namespace is invalid because it contains two subsequent dashes (`--`).');
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
        //
        // (Also note that we replace any occurences of `--` in the namespace with "-"
        //  to avoid issues when inferring the namespace later)
        domId: options.namespace+'--'+window[options.namespace].nextIdSeed,

      };


      // If additional metadata was provided (which it almost always is), store it
      // and ensure we're working with a deep-cloned copy.
      if (options.metadata) {
        if (options.dontCloneMetadata) {
          newMetadata = _.extend(options.metadata, newMetadata);
        }
        else {
          newMetadata = _.cloneDeep(_.extend(options.metadata, newMetadata));
        }
      }

      // Note:
      // The `_notifiers` dictionary is used to store special notifier functions
      // that are triggered as part of the component lifecycle.  It should not
      // be accessed or modified by userland code.

      // If an `onRemove` notifier was provided, store it with the other
      // userland metadata as `_notifiers.onRemove`.
      if (options.onRemove) {
        newMetadata._notifiers = newMetadata._notifiers || {};
        newMetadata._notifiers.onRemove = options.onRemove;
      }

      // Push new component metadata into our `onScreen` array
      window[options.namespace].onScreen.push(newMetadata);

      // Increment `nextIdSeed`
      window[options.namespace].nextIdSeed++;




      // Build a jQuery element for the component.
      ////////////////////////////////////////////////////////////////////////////////////////
      var HTML_TEMPLATE = options.html;
      var $component = $(HTML_TEMPLATE);

      // Look up the specified container element in the DOM.
      // (new editors are always appended to an existing container element)
      var $container;
      if (options.containerSelector) {
        $container = $(options.containerSelector);
      }
      // (otherwise if `$container` was explicitly specified, use it)
      else {
        $container = options.$container;
      }
      if ($container.length === 0) {
        throw new Error('In `appendComponent`: the `containerSelector` or `$container` provided doesn\'t match any elements.');
      }
      if ($container.length > 1) {
        throw new Error('In `appendComponent`: the `containerSelector` or `$container` provided matches more than one element.');
      }


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
        // var eventArgs = _.reduce(pieces, function (memo, piece){
        //   if (piece.match(/[^\s]+/)) {
        //     memo.push(piece);
        //   }
        //   return memo;
        // }, []);
        // ------------------------------------------------------------------------
        // NOTE: I put this stuff ^^^^ on hold for now-- better to keep things simple
        // and explicit unless stuff gets utterly unmaintainable in userland.
        // ------------------------------------------------------------------------

        // Build interceptor function to process stopPropagation/preventDefault
        // notation, as well as advanced event routing syntax.
        var interceptorFn = function( /* ... */ ){
          var args = Array.prototype.slice.call(arguments);

          // `e`, the DOM event object, is always the first argument.
          var e = args[0];

          if (eventRoute.stopPropagation) {
            e.stopPropagation();
          }
          if (eventRoute.preventDefault) {
            e.preventDefault();
          }
          if (eventRoute.fn) {
            if (!_.isFunction(eventRoute.fn)) {
              throw new Error('Invalid usage: Only functions may be passed to appendComponent as `fn`s (event handlers).');
            }
            // Note that there may be other arguments,
            // so we just send the whole pasture down there.
            return eventRoute.fn.apply(this, args);

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
      $container.append($component);

      // Return the DOM id of our new component.
      return newMetadata.domId;
    };
  }]);

})();



