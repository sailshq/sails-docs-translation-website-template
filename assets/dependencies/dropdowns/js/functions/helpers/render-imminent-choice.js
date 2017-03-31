(function (){

  angular.module('dropdowns').factory('renderImminentChoice', [
    'getComponentMetadata',
    function (getComponentMetadata) {

    /**
     * renderImminentChoice()
     *
     * @required {String} domId
     *            the DOM id of the dropdown
     * @optional {Boolean} autoScroll
     *            whether to scroll to the imminent choice
     *
     */
    return function renderImminentChoice (options) {

      // Look up our component metadata.
      var metadata = getComponentMetadata({ domId: options.domId });
      if(metadata.autoScrolling) {
        return;
      }

      // Now re-render the imminent choice.
      var $choices = $('#'+metadata.domId).find(metadata.choiceSelector);

      // Remove the "imminent" class from all choices.
      $choices.removeClass('imminent');

      // Then add it to the proper imminent choice.
      var $imminent = $choices.eq(metadata.imminentChoiceIndex);
      $imminent.addClass('imminent');

      // // If autoscroll is enabled, scroll to the imminent choice.
      // var $choiceContainer = $(metadata.choiceContainerSelector);
      // $choiceContainer.scrollTo($imminent, {offset: -$imminent.height()});

      // Figure out whether the selected result needs to be scrolled to.
      //
      // Get whether the selected result is cut off at the top.
      var $innerWrapper = $('#'+options.domId).find('[is="inner-options-container"]');
      var topOfSelectedResultIsCutOff = $innerWrapper.offset().top > $imminent.offset().top;

      // Get whether the selected result is cut off at the bottom.
      var bottomOfVisibleContainer = $innerWrapper.offset().top + $innerWrapper.height();
      var bottomOfSelectedResult = $imminent.offset().top + $imminent.height();
      var bottomOfSelectedResultIsCutOff =  bottomOfVisibleContainer < bottomOfSelectedResult;

      // If either the top or the bottom of the selected result is cut off, we need to scroll.
      if(topOfSelectedResultIsCutOff || bottomOfSelectedResultIsCutOff) {

        // Set the 'autoScrolling' flag on the metadata.
        metadata.autoScrolling = true;

        // Scroll to the selection.
        $innerWrapper.scrollTo($imminent, {offset: -32});

        // Wait a moment to let the scrolling happen, THEN clear the 'autoScrolling' flag.
        // This prevents a 'mouseenter' event from firing and selecing a result by accident, just because
        // the cursor happened to be over the autocomplete when it scrolled.
        //
        // Note that we're handling it in this more hacky way because we can't rely on checking for mousemove
        // events to determine whether the cursor deliberately moved over a search result, because the container
        // scrolling behind the cursor counts as a mousemove, even when the cursor is stationary.
        //
        // While this approach isn't ideal, it shouldn't affect the dropdown's usability, because:
        //
        // a) it is only for the very specific case where the autocomplete has to scroll AND the cursor is
        //    in a place that would cause it to be hovering over a different result when it does
        //
        // b) after changing the selection with the arrow keys, it is very difficult to then move the cursor
        //    to a new spot before the `autoScrolling` flag has been cleared. You would probably have to be
        //    the Age of Empires II AI set to hardest in order to accomplish it. But if you DID manage to move
        //    the cursor quickly enough, you probably still wouldn't notice anything was amiss.
        metadata.autoScrollTimeout = setTimeout(function waitUntilScrollingIsComplete() {
          metadata.autoScrolling = false;
        },100);//</waitUntilScrollingIsComplete>
      }

    };
  }]);

})();
