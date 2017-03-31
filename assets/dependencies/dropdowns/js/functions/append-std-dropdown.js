angular.module('dropdowns')
.factory('appendStdDropdown', [
  'appendDropdown',
  function(appendDropdown) {

  /**
   * appendStdDropdown()
   *
   * Append the standard custom dropdown element to the specified container.
   *
   * (This has a built-in template -- as opposed to `appendDropdown` which expects
   *  custom HTML templates.)
   * --------------------------------------------------------------------------------------------
   * @required {Array} choices
   *           e.g. [{phoneNum: '2385235', name: 'Turtle Ship'}, ...]
   *
   * @required {String} keyToDisplay
   *           TODO: document properly
   *
   * @required {String} containerSelector
   *           a DOM selector which uniquely identifies the
   *           container element the new component should be appended to.
   *
   * @optional {String} iconClassKey
   *           in order for the dropdown items to have icons, include this property
   *           in each dictionary of the `choices` array with the icon's class name
   *           as the value. (If not specified, they just won't be included.)
   *
   * @optional {Function} onRemove
   *           a function to call when this dropdown is removed
   *           @param {Dictionary} metadata
   *
   * @optional {Number} selectedIndex
   *           e.g. 3
   *           the index of the choice to select by default
   *           if unspecified, this will use 0 (the empty choice)
   *
   * @optional {String} placeholderText
   *           The placeholder text to show when nothing is selected.
   *           Defaults to "--"
   *
   * @optional {Sring} arrowType
   *           Either "double" or "caret".
   *           Defaults to "double"
   *
   * --------------------------------------------------------------------------------------------
   * @return {String} DOM id of the new component
   *
   * --------------------------------------------------------------------------------------------
   * @event dropdown:select
   *        triggered when a selection is made from the dropdown
   *
   * @event dropdown:cancel
   *        triggered when the dropdown is canceled without making a selection.
   *
   */
   return function appendStdDropdown (options) {

    // If `keyToDisplay` has not been provided,
    // throw an error.
    if (!options.keyToDisplay) {
      throw new Error('`No `keyToDisplay` (string) was provided to `appendStdDropdown()`');
    }

    options = _.defaults(options, {
      placeholderText: '--'
    });


    // Append the dropdown.
    var newDropdownId = appendDropdown({
      choices: options.choices,

      containerSelector: options.containerSelector,

      html: (function (){
        // Build up the default dropdown HTML.
        var $wrapper = $(_.template('<div is="dropdown" class="custom-dropdown"><div class="dropdown-wrapper">'+
          '<div is="options-container" class="options-container"><ul is="inner-options-container" class="contents"></ul></div>'+
          '<div class="resting-state" is="dropdown-resting-state"><span is="placeholder-text"><%= placeholderText %></span> <i class="dropdown-arrow-icon sails-icon icon-<%-arrow%>"></i></div>'+
          '</div></div>')({
            placeholderText: options.placeholderText,
            arrow: options.arrowType === 'caret' ? 'caret-down' : 'arrow-select'
          }));

        // Get a reference to our choice container.
        var $choiceContainer = $wrapper.find('[is="inner-options-container"]');
        // Build up the html for our choice template
        var choiceHtml = '<li is="choice" class="choice <% if(isDisabled){%>disabled<%}%>"><% if(icon){%><i class="choice-icon <%= icon %>"></i><%}%><%= label %></li>';
        // Render each choice as a new item inside of our choice container
        _.each(options.choices, function (choice) {
          var $choice = $(_.template(choiceHtml)({
            label: choice[options.keyToDisplay],
            icon: choice[options.iconClassKey],
            isDisabled: !_.isUndefined(choice.isDisabled) ? choice.isDisabled : false
          }));

          // If the choice is disabled, append the disabled data attribute
          if(choice.disabled) {
            $choice.addClass('disabled');
            $choice.attr('data-disabled', true);
          }

          $choiceContainer.append($choice);
        });

        return $wrapper[0].outerHTML;
      })(),

      choiceContainerSelector: '[is="options-container"]',

      choiceSelector: '[is="choice"]',

      placeholderSelector: '[is="placeholder-text"]',

      onRemove: options.onRemove,

      selectedIndex: options.selectedIndex,

      customEvents: [
        {
          on: 'dropdown:select',
          fn: function(e, selectedChoice) {
            if(_.isUndefined(options.iconClassKey)) {
              return;
            }

            // If `iconClassKey` WAS provided, use it to update the placeholder of this dropdown
            // to show the icon of the selected choice

            // Remove any old icon from the placeholder and add a new icon
            // with the proper class for this choice.
            var $placeholder = $('#'+newDropdownId).find('[is="placeholder-text"]');
            var $icon = $('<i is="dropdown-placeholder-icon" class="placeholder-icon '+selectedChoice[options.iconClassKey]+'"></i>');
            $placeholder.find('[is="dropdown-placeholder-icon"]').remove();
            $placeholder.prepend($icon);
          }
        }
      ]
    });

    // If `iconClassKey` WAS provided, AND an initial selected choice was specified,
    // then render that initially selected choice's icon in the placeholder.
    if(!_.isUndefined(options.iconClassKey) && !_.isUndefined(options.selectedIndex)) {
      // Figure out the choice that is selected when this initially renders
      var initiallySelectedChoice = options.choices[options.selectedIndex];
      // Add an icon with the class name for this choice.
      $('#'+newDropdownId).find('[is="placeholder-text"]').prepend($('<i is="dropdown-placeholder-icon" class="placeholder-icon '+initiallySelectedChoice[options.iconClassKey]+'"></i>'));
      // Note: we could have emitted `dropdown:select` here instead, but we don't want to initially emit that event w/ no user interaction.
      // (it could bubble up to higher-level listeners and just doesn't make sense)
    }


    return newDropdownId;
   };
  }
]);
