(function (){

  angular.module('sails').factory('expandMenuItemAndParents', [
    function () {

    /**
     * expandMenuItemAndParents()
     *
     * Given a particular slug, find the first menu item in `options.menuData`
     * that has that slug as a child in its "children" array (aka its parent.)
     *
     * If we find said parent, then push its id (aka slug) onto `$scope.expandedMenuItems`.
     * If we don't, throw an Error beause `currentMenuItem.id` will be like `undefined.id`.
     *
     * Back to the case where we do find said parent, if it has any parents of its own, then
     * call this function again, recursively, to expand that parent.
     *
     * TODO: fix throwy thing
     *
     * @required {String} path
     * @required {Array} menuData
     * @optional {Boolean} isCurrent
     *
     */
    return function expandMenuItemAndParents (options) {

      (function expandMenuItem(path, isParent) {
        // Find the menu item that has the current 'path' as a child.
        var currentMenuItem = _.find(options.menuData, {path: path});

        // Get a reference to the parent menu item in the DOM.
        var $menuItem = $('[is="menu-item"][data-path="'+currentMenuItem.path+'"]');

        // Expand the item at this parent path.
        $menuItem.addClass('expanded');

        // If the `isCurrent` flag was specified, set the 'current' or 'current-parent'
        // styles on the menu item.
        if(options.isCurrent) {
          if(isParent) {
            $menuItem.addClass('current-parent');
          }
          else {
            $menuItem.addClass('current');
          }
        }

        // If this menu item has a parent,make the recursive call to expand the parent.
        if(currentMenuItem.isChild) {
          expandMenuItem(currentMenuItem.parent, true);
        }
      })(options.path, false);


    };
  }]);

})();
