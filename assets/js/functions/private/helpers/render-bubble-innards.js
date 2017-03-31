(function (){

  angular.module('sails').factory('renderBubbleInnards', [
    function () {

    /**
     * renderBubbleInnards()
     *
     * Set the text of the bubbles in the doc pages.
     *
     */
    return function renderBubbleInnards (options) {

      var $bubbles = $('bubble');

      $bubbles.each(function() {
        var $bubble = $(this);
        var $bubbleHeart = $bubble.find('[is="bubble-heart"]');

        var bubbleType = $bubble.attr('type');

        // Determine if the bubble type has a `?` suffix (if so, it is uncertain)
        var isUncertain;
        if (bubbleType.match(/\?$/)) {
          isUncertain = true;
        }

        // Interpret `object` as `dictionary`
        if ( bubbleType.match(/object/i) ) {
          bubbleType = 'dictionary';
        }

        // Interpret `*` as `json`
        if ( bubbleType.match(/^\*$/i) ) {
          bubbleType = 'JSON';
        }

        // Also get the "raw type" (used for class name) by stripping off the `?` suffix
        var rawType = bubbleType.replace(/\?$/, '');
        rawType = rawType.toLowerCase();

        // Also determine the "display type" (used for displaying, of course)
        var displayType = bubbleType;
        // displayType = displayType.replace(/\?$/, '');
        //
        // Normally, types are capitalized.
        // But there are a few special exceptions:
        if (displayType.match(/json/i)) {
          displayType = displayType.replace(/json/i, 'JSON');
        }
        else if (displayType.match(/req/i)) {
          displayType = displayType.replace(/req/i, 'req');
        }
        else {
          displayType = _.capitalize(displayType);
        }

        // If relevant, add the "uncertain" class.
        if (isUncertain) {
          $bubbleHeart.addClass('uncertain');
        }

        // Now dip the bubble's heart into the dye and scratch some text onto it.
        $bubbleHeart.addClass(rawType);
        $bubbleHeart.text(displayType);
      });

    };
  }]);

})();


