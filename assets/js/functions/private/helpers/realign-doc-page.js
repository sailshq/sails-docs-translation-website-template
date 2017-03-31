(function (){

  angular.module('sails').factory('realignDocPage', [
    function () {

    /**
     * realignDocPage()
     *
     * Position the doc page side nav and contents to line up with the page's container styles.
     *
     */
    return function realignDocPage (options) {
        // Get the amount of space to the left and right of the navigation container.
        var $navContainer = $('[is="docs-navigation-container"]');
        var spaceToLeft = $navContainer.offset().left;
        var spaceToRight = $(window).width() - (spaceToLeft + $navContainer.width());

        // Position the side nav menu to align with the header nav container.
        var $sideNav = $('[is="side-nav"]');
        $sideNav.css('left', spaceToLeft);


        // Get the height of the footer.
        var footerHeight = $('#footer').height();

        // Get the width of the side nav menu .
        var sideNavWidth = $sideNav.width();

        // Set the documentation page's left and right padding to keep everything lined up,
        // and bottom padding to make room for the footer.
        var $page = $('[is="doc-page"]');
        $page.css({
          'padding-left': sideNavWidth + spaceToLeft,
          'padding-right': spaceToRight,
          'padding-bottom': footerHeight
        });

        // Also give the side nav padding for the footer.
        $sideNav.css('padding-bottom', footerHeight);

        // Calculate the minimum pixel height for the side nav by adding the height of the nav menu, the padding around it,
        // and the height of the footer. (Plus a little extra space to not squish it.)
        var topPaddingPx = +($sideNav.css('padding-top').replace('px', '')); // << cast top padding value to a number
        var sideNavMinHeight = $('[is="side-nav-contents"]').height() + footerHeight + topPaddingPx + 50;

        // If the page is taller than the minimum height needed for the nav menu, clear any `min-height`s on the page -- we're good.
        var pageHeight = $page.height();
        if(pageHeight > sideNavMinHeight) {
          $page.css('min-height', '');
        }
        // Otherwise, if height of the side nav + room for the footer & padding is taller than <body>,
        // set that as the page's min-height.
        else if(sideNavMinHeight > $('body').height()) {
          $page.css('min-height', sideNavMinHeight);
        }
        // Otherwise, the <body> is taller than all the contents of the page,
        // so don't set a min-height.
        else {
          $page.css('min-height', '');
        }
    };
  }]);

})();
