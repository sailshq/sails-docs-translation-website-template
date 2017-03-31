(function (){

  angular.module('sails').factory('docPage', [
    'realignDocPage',
    'expandMenuItemAndParents',
    'renderBubbleInnards',
    function (realignDocPage, expandMenuItemAndParents, renderBubbleInnards) {

    /**
     * docPage()
     *
     * Handles frontend interactions for the documentation pages.
     *
     */
    return function docPage (options) {


      // TODO: update this when we aren't using '?page='
      // Find the slug for the page we're on:
      var currentSlug = window.location.pathname.replace(/\/documentation\//, '');
      // Some slugs have spaces, which are changed to '%20' in the URL --
      // replace any occurences of '%20' with a space, so it matches the slug in the menu data.
      // Also, get rid of the '#?' from the permalinks.
      currentSlug = currentSlug.replace(/#\?.+$/, '');

      // Fond our current menu item in the list.
      var menuItemForCurrentPage = _.find(window.MENU_DATA, {slug: currentSlug});

      // Expand the menu item with this template path, and its parents.
      expandMenuItemAndParents({
        path: menuItemForCurrentPage.path,
        menuData: window.MENU_DATA,
        isCurrent: true
      });

      // Infer the overall doc section from the slug, and use it to set the 'current' item
      // in the main doc menu.
      // (We can find this by just getting the part before the first '/'.)
      var docSection = currentSlug.split('/')[0];
      $('[is="docs-navigation-container"]').find('[data-section="'+docSection+'"]').addClass('current');

      // Give all 'table' elements a wrapper so they'll have a nice scrollbar if they get huge.
      var $tables = $('[is="doc-template-contents"]').find('table');
      $tables.wrap('<div class="table-wrapper"></div>');

      // Render the bubbles.
      renderBubbleInnards();

      // Align the elements on the page all nicely.
      realignDocPage();

      // Finally, fade in the previously-hidden content, now that all te styles have finished rendering.
      $('[data-hide-until-rendered]').removeClass('invisible');


      //  ███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗
      //  ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╗
      //  █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗╚═╝
      //  ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║██╗
      //  ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║╚═╝
      //  ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
      //
      //  ╔═╗╦  ╦╔═╗╦╔═
      //  ║  ║  ║║  ╠╩╗
      //  ╚═╝╩═╝╩╚═╝╩ ╩
      //  ┌─  ┌─┐─┐ ┬┌─┐┌─┐┌┐┌┌┬┐  ┌┐┌┬┐┌┐┌  ─┐
      //  │───├┤ ┌┴┬┘├─┘├─┤│││ ││  ├┴┐│ │││───│
      //  └─  └─┘┴ └─┴  ┴ ┴┘└┘─┴┘  └─┘┴ ┘└┘  ─┘
      $('[is="expand-button"]').on('click', function(e) {

        var isExpanded = !!$(e.currentTarget).attr('data-expanded');

        // If this button's menu item is expanded, collapse it.
        if(isExpanded) {
          $(e.currentTarget).removeAttr('data-expanded');
          $(e.currentTarget).closest('[is="menu-item"]').removeClass('expanded');
        }
        // Otherwise, expand it.
        else {
          $(e.currentTarget).attr('data-expanded', 'expanded');
          $(e.currentTarget).closest('[is="menu-item"]').addClass('expanded');
        }

        // Now realign eveything/set the proper heights again.
        realignDocPage();
      });

      //  ╦═╗╔═╗╔═╗╦╔═╗╔═╗
      //  ╠╦╝║╣ ╚═╗║╔═╝║╣
      //  ╩╚═╚═╝╚═╝╩╚═╝╚═╝
      //  ┌─  ┬ ┬┬┌┐┌┌┬┐┌─┐┬ ┬  ─┐
      //  │───│││││││ │││ ││││───│
      //  └─  └┴┘┴┘└┘─┴┘└─┘└┴┘  ─┘
      // Realign the elements on the page when the window is resized.
      $(window).on('resize', _.throttle(function() {realignDocPage();}, 100));



      //  ╔═╗╔═╗╦═╗╔═╗╦  ╦
      //  ╚═╗║  ╠╦╝║ ║║  ║
      //  ╚═╝╚═╝╩╚═╚═╝╩═╝╩═╝
      //  ┌─  ┌─┐┌─┐┌─┐┌─┐ ─┐
      //  │───├─┘├─┤│ ┬├┤───│
      //  └─  ┴  ┴ ┴└─┘└─┘ ─┘
      $(document).on('scroll', function(e) {
        // If we've scrolled more than 75 px from the top, shorten the fixed-position header for easier reading.
        var pxScrolled = $(e.currentTarget).scrollTop();
        if(pxScrolled > 75) {
          $('[is="docs-header"]').addClass('short');
          $('[is="docs-header"]').css('top', '');
          // $('#header').css('top', '');
        }
        // Otherwise, let the header heighten/shorten according to how far from the top the page has scrolled.
        else  {
          $('[is="docs-header"]').removeClass('short');
          $('[is="docs-header"]').css('top', -pxScrolled+'px');
          // $('#header').css('top', pxScrolled+'px');
        }
      });
    };
  }]);

})();
