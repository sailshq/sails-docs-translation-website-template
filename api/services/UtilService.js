/**
 * UtilService
 * @type {Dictionary}
 */
module.exports = {

  /**
   * compareDocPageMetadatas
   *
   * A comparator for sorting the doc page metadatas, for putting the documentation menus in the correct order.
   *
   * @required {Dictionary} a
   *           the first doc page metadata to compare
   *
   * @required {Dictionary} b
   *           the second doc page metadata to compare
   *
   * @optional {Boolean} isAnatomyMetadata
   *
   */
   compareDocPageMetadatas: function(options) {
      // Deprecated doc pages go last
      if(!options.a.isDeprecated && options.b.isDeprecated) {
        return -1;
      }
      else if(options.a.isDeprecated && !options.b.isDeprecated) {
        return 1;
      }
      else {
        // Method doc pages go just before deprecated ones
        if(!options.a.isMethod && options.b.isMethod) {
          return -1;
        }
        else if(options.a.isMethod && !options.b.isMethod) {
          return 1;
        }
        else {
          // Then sort by version, if applicable
          if(options.a.version === '' && options.b.version !== '') {
            return -1;
          }
          else if(options.a.version !== '' && options.b.version === '') {
            return 1;
          }
          else if(options.a.version !== '' && options.b.version !== '') {
            var semver = require('semver');
            var comparison = semver.rcompare(options.a.version, options.b.version);
            return comparison;
          }
          else {
            // If we are in the anatomy docs, parent menu items go next.
            // (If it's another docs section, it doesn't matter.)
            if(options.isAnatomyMetadata && options.a.isParent && !options.b.isParent) {
              return -1;
            }
            else if(options.isAnatomyMetadata && (options.a.isParent && !options.a.isChild) && (options.b.isParent && options.b.isChild)) {
              return -1;
            }
            else if(options.isAnatomyMetadata && !options.a.isParent && options.b.isParent) {
              return 1;
            }
            else if(options.isAnatomyMetadata && (options.a.isParent && options.a.isChild) && (options.b.isParent && !options.b.isChild)) {
              return 1;
            }
            else {
              // Then sort alphabetically by display name
              if(options.a.displayName.toLowerCase() < options.b.displayName.toLowerCase()) {
                return -1;
              }
              else if(options.a.displayName.toLowerCase() > options.b.displayName.toLowerCase()) {
                return 1;
              }
              else {
                return 0;
              }
            }
          }
        }
      }
    },//</compareDocPageMetadatas>


    /**
     * getForwardingSlugForOldDocPage
     *
     * Check a list of forwarding links for old doc pages, and return the new link to use if applicable.
     * (This helps keep config/routes.js from getting crazy with forwarding links)
     *
     * @required {String} path
     *
     * @returns {String} the new link
     *                   (or `undefined` if there isn't one.)
     *
     *
     */
     getForwardingSlugForOldDocPage: function(options) {

      // Our forwarding list:
      var forwardingList = require('../constants/doc-forwarding-paths');

      // If the path we passed in is in the list, return the new forwarding path.
      var forwardingPath = forwardingList[options.path];
      if(_.isString(forwardingPath)) {
        return forwardingPath;
      }
      // Otherwise, there isn't one, so just return `undefined`.
      else {
        return undefined;
      }


     },//</getForwardingSlugForOldDocPage>

};
