angular.module('dropdowns')
.factory('appendDropdown', [
  'negotiateKeyboardEvent',
  'appendComponent',
  'getComponentMetadata',
  'renderSelectedChoice',
  'renderImminentChoice',
  'setDropdownValue',
  'showDropdownChoices',
  'hideDropdownChoices',
  function(negotiateKeyboardEvent, appendComponent, getComponentMetadata, renderSelectedChoice, renderImminentChoice, setDropdownValue, showDropdownChoices, hideDropdownChoices) {

  /**
   * appendDropdown()
   *
   * Append a custom dropdown to the DOM within the specified `containerSelector`.
   *
   * --------------------------------------------------------------------------------------------
   * @required {Array} choices
   *           e.g. [{id: 2385235, name: \'Turtle Ship\'}, ...]
   *
   * @required {String} containerSelector
   *            a DOM selector which uniquely identifies the
   *            container element the new component should be appended to.
   *
   * @required {String} html
   *           The HTML template for the dropdown
   *
   * @required {String} choiceContainerSelector
   *           The selector for the dropdown choice container that is shown and hidden.
   *           Note that choices are not appended here automatically-- that's up to you
   *           in the provided template.
   *           e.g. "div.outer-container"
   *
   * @required {String} choiceSelector
   *           The selector to use for obtaining the list of dropdown choice elements.
   *           e.g. "li"
   *
   * @optional {String} placeholderSelector
   *           The selector for the dropdown's placeholder text
   *           (aka the selected choice/resting state before anything is selected)
   *
   * @optional {Function} onRemove
   *           a function to call when this dropdown is removed
   *           @param {Dictionary} metadata
   *
   * @optional {Number} selectedIndex
   *           e.g. 3
   *           the index of the choice to select by default
   *
   * @optional {Array} customEvents
   *           Any extra events tied to this dropdown that aren't included in the default events.
   *           (i.e. if you want to update a placeholder icon/class/etc. on select, so we don't
   *           have to deal with updating aesthetic things about the dropdown in other files' events.)
   *
   * --------------------------------------------------------------------------------------------
   * @return {String} DOM id of the new component
   *
   * --------------------------------------------------------------------------------------------
   *
   * @event dropdown:select
   *        triggered when a selection is made from the dropdown
   *
   * @event dropdown:cancel
   *        triggered when the dropdown is canceled without making a selection.
   *
   */
  return function appendDropdown (options) {


    // Validate options
    // ==================================================

    // If no `choices` array has been provided,
    // throw an error.
    if (!options.choices) {
      throw new Error('`No `choices` array was provided to `appendDropdown()`!');
    }


    // Default `customEvents` to an empty array.
    if(!_.isArray(options.customEvents)) {
      options.customEvents = [];
    }


    // Build and append the component to the DOM.
    // (`newDropdownDomId` will be set to the unique DOM id of this UI component on the page.)
    var newDropdownDomId = appendComponent({

      // The namespace on the `window` object where the global state for this TYPE OF component should live.
      namespace: 'dropdowns',

      // The initial state
      metadata: {

        // Remember whether choices are currently visible.
        choicesVisible: false,

        // The index of the currently-selected choice
        selectedChoiceIndex: undefined,

        // The array of choices
        choices: options.choices,

        // The selector for the container that hides/shows when the dropdown is opened or closed.
        choiceContainerSelector: options.choiceContainerSelector,

        // The selector for the individual options in the dropdown
        choiceSelector: options.choiceSelector,

        // The selector for the dropdown's placeholder (i.e. empty state)
        placeholderSelector: options.placeholderSelector,

        // The index of the so-called "imminent" choice
        // (i.e. where the user has most-recently hovered or keyed around)
        // Defaults to 0, the index of the first choice.
        imminentChoiceIndex: 0,

        // When a dropdown is disabled, it can't be opened.
        disabled: false

      },

      // If a custom `onRemove` was provided, call it.
      onRemove: function(metadata) {
        if(options.onRemove) {
          options.onRemove(metadata);
        }
      },

      // The selector for the container wherein this component will be appended.
      containerSelector: options.containerSelector,

      // The HTML template for the component.
      html: options.html,

      // DOM events to bind for the component.
      events: [

        // When anywhere in the dropdown is clicked, either hide or show the list of options...
        {
          on: 'mousedown',
          // Prevent default behavior of mousedown
          // (i.e. blurring selected form fields)
          preventDefault: true,
          fn: function (e) {
            // Get access to the component metadata
            var metadata = getComponentMetadata({ domId: newDropdownDomId });

            // If dropdown is disabled, don't expand it when it is focused.
            if (metadata.disabled) {
              return;
            }

            // Look up the jQuery element that contains our dropdown's choices.
            var $optionsContainer = $('#'+newDropdownDomId).find(options.choiceContainerSelector);

            // If choices are not visible, show them.
            if ( !metadata.choicesVisible ) {
              showDropdownChoices({
                domId: newDropdownDomId,
                focus: true
              });
            }
            // Otherwise, if they are, hide them.
            else {
              hideDropdownChoices({ domId: newDropdownDomId });
              // Emit `dropdown:cancel` event
              $('#'+newDropdownDomId).trigger('dropdown:cancel');
            }

          }
        },

        // When focused, display the list of options...
        {
          on: 'focus',
          selector: 'textarea[is="offscreen"]',
          fn: function (e) {
            // Get access to the component metadata
            var metadata = getComponentMetadata({ domId: newDropdownDomId });

            // If dropdown is disabled, don't give it the focused class.
            if (metadata.disabled) {
              return;
            }

            // Add the "focused" class to the dropdown.
            $('#'+newDropdownDomId).addClass('focused');

            // Emit `dropdown:focus` event
            $('#'+newDropdownDomId).trigger('dropdown:focus');
          }
        },

        // When blurred, hide the list of options...
        {
          on: 'blur',
          selector: 'textarea[is="offscreen"]',
          fn: function (e) {
            // Get access to the component metadata
            var metadata = getComponentMetadata({ domId: newDropdownDomId });

            // Remove the "focused" class from the dropdown.
            $('#'+newDropdownDomId).removeClass('focused');


            // If a dropdown is blurred, it is always closed.
            // But just because a dropdown is closed doesn't mean it is blurred.
            if(metadata.choicesVisible) {
              hideDropdownChoices({ domId: newDropdownDomId });

              // Emit `dropdown:cancel` event
              $('#'+newDropdownDomId).trigger('dropdown:cancel');
            }

            // Emit `dropdown:blur` event
            $('#'+newDropdownDomId).trigger('dropdown:blur');

          }
        },


        // When a new selection is made, set the provided
        // new selected choice in our internal metadata.
        // (the list of choices will be hidden because our disguised
        //  textarea will be blurred)
        {
          on: 'mousedown',
          selector: options.choiceSelector,
          fn: function (e) {

            // Check if the option is disabled, if so don't do anything.
            if($(e.currentTarget).attr('data-disabled')) {
              e.stopPropagation();
              e.preventDefault();
              return;
            }

            var metadata = getComponentMetadata({ domId: newDropdownDomId });

            // Call `setDropdownValue` to save the selected choice to our metadata and render accordingly.
            setDropdownValue({
              domId: newDropdownDomId,
              selectedIndex: $(e.currentTarget).index()
            });

            // Now stop propagation of this mousedown event so that the mousedown event for the entire dropdown
            // does not fire and close+cancel the dropdown.  Instead, we'll close it ourselves.
            e.stopPropagation();

            // But first we also need to prevent the default behavior of the mousedown event so that we
            // don't blur our hidden textarea.
            e.preventDefault();

            hideDropdownChoices({ domId: newDropdownDomId });

            // Finally, emit the `dropdown:select` event.
            var selectedChoice = metadata.choices[metadata.selectedChoiceIndex];
            $('#'+metadata.domId).trigger('dropdown:select', [ selectedChoice ]);

          }
        },

        // When hovering over a choice with the mouse...
        {
          on: 'mouseenter',
          selector: options.choiceSelector,
          fn: function (e) {

            // Set the `imminentChoiceIndex` in our internal metadata
            var metadata = getComponentMetadata({ domId: newDropdownDomId });
            metadata.imminentChoiceIndex = $(e.currentTarget).index();

            // Render the imminent choice
            renderImminentChoice({
              domId: newDropdownDomId,
              choiceSelector: options.choiceSelector
            });
          }
        },

        // When a key is pressed, check for special keystrokes...
        {
          on: 'keydown',
          selector: 'textarea[is="offscreen"]',
          fn: function (e) {

            // Look up our component metadata
            var metadata = getComponentMetadata({ domId: newDropdownDomId });

            // Look up the jQuery element for our dropdown component.
            var $dropdown = $('#'+metadata.domId);

            return negotiateKeyboardEvent(e, {


              '<ESC>': function () {
                // If the dropdown is not open, then do nothing (and don't stop propagation)
                if ( !metadata.choicesVisible ) {
                  return;
                }

                // Otherwise the dropdown is open and we gonna close it.

                // Prevent this <ESC> event from bubbling up to other elements.
                e.stopPropagation();

                // Hide the choices.
                hideDropdownChoices({ domId: newDropdownDomId });

                // Emit `dropdown:cancel` event
                $('#'+metadata.domId).trigger('dropdown:cancel');
              },


              '<UP_ARROW>': function () {
                // If dropdown is disabled, don't expand it when it is focused (and don't stop propagation)
                if (metadata.disabled) {
                  return;
                }

                // Prevent this keydown event from bubbling up to other elements.
                e.stopPropagation();

                // It is possible to have the textarea focused
                // but not showing the list of options.
                //
                // If this is the case, show them.
                if ( !metadata.choicesVisible ) {
                  showDropdownChoices({ domId: newDropdownDomId });
                }
                // Otherwise, set the previous choice as the imminent choice.
                else {
                  // Move up (wrap around)
                  metadata.imminentChoiceIndex -= 1;
                  if (metadata.imminentChoiceIndex < 0) {
                    metadata.imminentChoiceIndex = metadata.choices.length - 1;
                  }
                  // Render the imminent choice
                  renderImminentChoice({
                    domId: newDropdownDomId,
                    choiceSelector: options.choiceSelector,
                    autoScroll: true
                  });
                }
              },


              '<DOWN_ARROW>': function () {
                // If dropdown is disabled, don't expand it when it is focused (and don't stop propagation)
                if (metadata.disabled) {
                  return;
                }

                // Prevent this keydown event from bubbling up to other elements.
                e.stopPropagation();

                // It is possible to have the textarea focused
                // but not showing the list of options.
                //
                // If this is the case, show them.
                if ( !metadata.choicesVisible ) {
                  showDropdownChoices({ domId: newDropdownDomId });
                }
                // Otherwise, set the next choice as the imminent choice.
                else {
                  metadata.imminentChoiceIndex += 1;
                  if (metadata.imminentChoiceIndex > (metadata.choices.length - 1)) {
                    metadata.imminentChoiceIndex = 0;
                  }
                  // Render the imminent choice
                  renderImminentChoice({
                    domId: newDropdownDomId,
                    choiceSelector: options.choiceSelector,
                    autoScroll: true
                  });
                }

              },


              '<ENTER>': function () {
                // If the dropdown is not open, then do nothing (and don't stop propagation)
                if ( !metadata.choicesVisible ) {
                  return;
                }

                // Check if the option is disabled, if so don't do anything.
                if(metadata.choices[metadata.imminentChoiceIndex] && metadata.choices[metadata.imminentChoiceIndex].disabled) {
                  e.stopPropagation();
                  e.preventDefault();
                  return;
                }

                // Prevent this keydown event from bubbling up to other elements.
                e.stopPropagation();

                // Call `setDropdownValue` to save the selected choice to our metadata and render accordingly.
                setDropdownValue({
                  domId: newDropdownDomId,
                  selectedIndex: metadata.imminentChoiceIndex
                });

                // Hide the dropdown list
                // (but don't blur to allow for subsequently changing the selected
                //  choice using arrow keys- this is the default browser behavior)
                hideDropdownChoices({ domId: newDropdownDomId });

                // Emit `dropdown:select` event
                var selectedChoice = metadata.choices[metadata.selectedChoiceIndex];
                $('#'+metadata.domId).trigger('dropdown:select', [ selectedChoice ]);

              }

            });
          }
        }

      ].concat(options.customEvents),
    });

    // Add a data-attribute to let the UI know that this should be considered focusable
    // despite it not being a traditional form element.
    $('#'+newDropdownDomId).attr('data-is-mousedown-focusable', true);

    // Add a hidden textarea to the new dropdown, for focusing the dropdown.
    $('#'+newDropdownDomId).append($('<textarea is="offscreen" style="position: absolute; left: -9999px;"></textarea>'));

    // Initially hide the options container.
    var $optionsContainer = $('#'+newDropdownDomId).find(options.choiceContainerSelector);
    $optionsContainer.hide();

    // If an initially selected choice (`selectedIndex`) was provided, then save it to
    // the metadata as our selected choice and render to reflect it.
    if (!_.isUndefined(options.selectedIndex)) {

      // Call `setDropdownValue` to save the initial selection to our metadata and render accordingly.
      setDropdownValue({
        domId: newDropdownDomId,
        selectedIndex: options.selectedIndex
      });
    }


    return newDropdownDomId;

  };

}]);
