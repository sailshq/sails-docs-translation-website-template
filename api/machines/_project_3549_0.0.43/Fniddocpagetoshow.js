module.exports = {
  "inputs": {
    "docPageMetadatas": {
      "id": "573ef066-9a67-49a4-9f2e-f7b91a77524f",
      "friendlyName": "docPageMetadatas",
      "description": "",
      "example": [{}],
      "required": true,
      "addedManually": true
    },
    "slug": {
      "id": "f35abb0e-6a92-4f9a-90ce-5aaf68e66653",
      "friendlyName": "slug",
      "description": "The name of the docs section you're trying to navigate to",
      "example": "dance-party",
      "required": true,
      "addedManually": true
    }
  },
  "exits": {
    "error": {
      "example": undefined
    },
    "success": {
      "id": "success",
      "friendlyName": "then",
      "description": "Normal outcome.",
      "example": {
        "path": "concepts/some-doc-page.ejs",
        "slug": "concepts/some-doc-page",
        "displayName": "Some Doc Page",
        "children": [
          "concepts/some-doc-page/child-section.ejs"
        ],
        "id": "concepts-some-doc-page",
        "parent": "concepts/0home.ejs",
        "isChild": true,
        "isParent": true,
        "displayNameSlug": "some-doc-page",
        "parentDisplayName": "--",
        "version": "0.4.6",
        "notShownOnWebsite": false,
        "isTableOfContents": false,
        "isOverviewPage": false,
        "notShownOnWebsite": false
      }
    },
    "notFound": {
      "friendlyName": "not found",
      "description": "",
      "example": "abc123"
    },
    "notExactMatch": {
      "id": "0aa0e91b-6dfb-4e6c-9a9c-3ab97e345416",
      "friendlyName": "Not an exact match",
      "description": "This exit is traversed if this machine detects a doc template, but it doesn't match exactly.  Returns the proper slug.",
      "example": "concepts/some-doc-page"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    try {

      // Ensure requested view is one of the allowed nav items.
      var docPageToShow = _.find(inputs.docPageMetadatas, function(docPage) {
        // Do a case-insensitive match and equate whitespace, %20 (URL-encoded spacebar), and dashes
        if (_.trimRight(inputs.slug.toLowerCase(), '/') === _.trimRight(docPage.slug.toLowerCase(), '/')) {
          return true;
        }
        // If we didn't find a match, check our master list of old doc pages that are being forwarded
        return false;
      });


      // If we haven't found a doc page to show, and this is an anatomy page...
      var slugParts = inputs.slug.toLowerCase().split('/');
      if(_.isUndefined(docPageToShow) && slugParts[0] === 'anatomy') {
        // Check whether this slug matches an old-style kebab-cased version of any doc page's slug.
        docPageToShow = _.find(inputs.docPageMetadatas, function(docPage) {
          var docPageSlugParts = docPage.slug.toLowerCase().split('/');
          var oldStyleSlugParts = [];
          _.each(docPageSlugParts, function(slugPart) {
            oldStyleSlugParts.push(_.kebabCase(slugPart));
          });
          var oldStyleSlug = oldStyleSlugParts.join('/');
          // Do a case-insensitive match and equate whitespace, %20 (URL-encoded spacebar), and dashes
          if (_.trimRight(inputs.slug.toLowerCase(), '/') === _.trimRight(oldStyleSlug.toLowerCase(), '/')) {
            return true;
          }
          // If we didn't find a match, check our master list of old doc pages that are being forwarded
          return false;
        });
      }


      // If we still haven't found a doc page to show, check our list of forwarding links
      // for old documentation pages that have been moved around.
      if(_.isUndefined(docPageToShow)) {
        var forwardingLink = UtilService.getForwardingSlugForOldDocPage({
          path: _.trimRight(inputs.slug.toLowerCase(), '/')
        });
        if(!_.isUndefined(forwardingLink)) {
          return exits.notExactMatch(forwardingLink);
        }
        else {
          return exits.notFound();
        }
      }
      // Otherwise, if the slug for the doc page we found is at all different than the one we passed in,
      // even just the capitalization, return the proper path for forwarding instead of a doc page.
      else if (docPageToShow.slug !== inputs.slug) {
        return exits.notExactMatch(docPageToShow.slug);
      }
      // Otherwise, it was an exact match, so proceed.
      else {
        return exits.success(docPageToShow)
      }
    } catch (e) {
      // Rather than traversing the error exit, exit as "notFound".
      console.error('Unexpected error in "Find doc template to show":', e);
      return exits.notFound();
    }



  },
  "identity": "Fniddocpagetoshow"
};
