module.exports = {
  "inputs": {
    "docPageMetadatas": {
      "id": "f09f3994-de73-4499-a1e3-b55cc3467d5b",
      "friendlyName": "Doc Page Metadatas",
      "description": "",
      "typeclass": "array",
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
      "example": [{
        "path": "creating-a-machinepack/Getting-Started.ejs",
        "slug": "creating-a-machinepack/getting-started",
        "displayName": "Foo Bar",
        "children": [
          "some/unique/path/like/this.ejs"
        ],
        "id": "creating-a-machinepack/getting-started",
        "parent": "creating-a-machinepack",
        "isChild": true,
        "isParent": false,
        "displayNameSlug": "foo-bar",
        "parentDisplayName": "idk",
        "version": "0.3.6",
        "lastModified": 1478635763000,
        "isDeprecated": false,
        "isExperimental": false,
        "isMethod": false,
        "isTableOfContents": false,
        "isOverviewPage": false,
        "notShownOnWebsite": false
      }]
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var path = require('path');
    var _ = require('lodash');

    // First, figure our which docs section we're in.
    // (This will affect how we sort the menu items.)
    // All of these metadatas will be for the same top-level docs section,
    // so we can just grab the part before the first '/' in the first metadata item's path.
    var docSection = '';
    var firstMenuItem = inputs.docPageMetadatas[0];
    if(_.isString(firstMenuItem.fullPathAndFileName)) {
      docSection = firstMenuItem.fullPathAndFileName.split('/')[0];
    }


    // Marshal menu metadata
    _.each(inputs.docPageMetadatas, function normalizeEachDocPage(docPage) {

      // If this template is not to be shown (e.g. in the case of a README):
      if(docPage.data.notShownOnWebsite === 'true') {
        docPage.notShownOnWebsite = true;
      }
      else {
        docPage.notShownOnWebsite = false;
      }

      // Add the last modified data tot he metadata.
      docPage.lastModified = docPage.data.lastModified;



      // Rename `fullPathAndFileName`
      docPage.path = docPage.fullPathAndFileName;

      // Whether this template is a table of contents
      if(docPage.data.isTableOfContents === 'true') {
        docPage.isTableOfContents = true;
      }
      else {
        docPage.isTableOfContents = false;
      }

      // Whether this template is not to be shown in the navigation
      // (e.g. in the case of an overview section)
      if(docPage.data.isOverviewPage === 'true') {
        docPage.isOverviewPage = true;
      }
      else {
        docPage.isOverviewPage = false;
      }


      // Determine the display name-- either use the data bundled as <docmeta> tags, or
      // take the slug and make a reasonable guess based on some formatting conventions.
      docPage.displayName = docPage.data.displayName || _.startCase(docPage.path); //slug.replace(/-/g, ' ');


      // Create the 'slug' for pages that don't have the 'notShownOnWebsite' flag.
      if(!docPage.notShownOnWebsite) {
        // Create an empty array, in order to build up the slug.
        var slugParts = [];
        // Add the kebab-cased display name of the selected page
        // (But only if it's not an overview or table of contents-- aka this template is used and is in the navigation)
        if (!docPage.isOverviewPage && !docPage.isTableOfContents) {

          // If this is an anatomy page, use the actual display name for the slug part.
          // (Since these mirror actual files/folders in a sails app)
          if(docSection === 'anatomy') {
            slugParts.push(docPage.displayName);
          }
          // Otherwise, kebab-case the display name to get this part of the slug.
          else {
            slugParts.push(_.kebabCase(docPage.displayName));
          }
        }

        // Build up the array of parents for the slug.
        if (docPage.parent) {
          (function getSlugParts(parentPath) {
            // Find the parent data so we can grab `displayName`
            var slugParent = _.find(inputs.docPageMetadatas, {
              fullPathAndFileName: parentPath
            });

            if (slugParent && !(slugParent.data.isOverviewPage === 'true' || slugParent.data.isTableOfContents === 'true')) {
              var parentDisplayName = slugParent.data.displayName || _.startCase(slugParent.path);

              // If this is anatomy, get the parent's (trimmed) display name and add a slash to the end.
              if(docSection === 'anatomy') {
                parentDisplayName = _.trimRight(parentDisplayName, '/') + '/';
              }
              // Otherwise, convert the parent's display name to kebabcase and add a slash to the end
              else {
                parentDisplayName = _.kebabCase(parentDisplayName) + '/';
              }
              // now add it to the beginning of the `slugParts` array
              slugParts.unshift(parentDisplayName);
              // If the parent has a parent, take the recursive step.
              if (slugParent.parent) {
                getSlugParts(slugParent.parent);
              }
            }
          })(docPage.parent);
        }


        // Now convert the array into a string, remove the commas, and set it as the slug.
        docPage.slug = slugParts.join().replace(/,/g, '');
        // Get the name of the docs section this is from (e.g. 'concepts') by grabbing it from the beginning of the path
        docPage.topSection = docPage.path.split('/')[0] + '/';
        // Remove any excess slashes
        if (docPage.slug[0] === '/') {
          docPage.slug = docPage.slug.replace(/\//, '');
        }
        // Add the overall doc section to the beginning of the slug
        docPage.slug = docPage.topSection + docPage.slug;

        // Trim up and lowercase the slug.
        docPage.slug = _.trimRight(docPage.slug, '/').toLowerCase();
      }
      else {
        docPage.slug = '';
      }


      // then create an id for places where slug makes things tricky,
      // that's just the slug with dashes instead of slashes.
      docPage.id = docPage.slug.toLowerCase().replace(/[^a-z0-9]/g, '-');


      docPage.version = docPage.data.version || '';

      // docPage.displayNameSlug = docPage.displayName.replace(/ /g, '-').replace(/\./g, 'point').toLowerCase();

      // Set the data from the docmeta tags to be top-level properties.
      docPage.isDeprecated = docPage.data.isDeprecated;

      docPage.isExperimental = docPage.data.isExperimental;

      docPage.isMethod = docPage.data.pageType === 'method';

      var pathSections = docPage.path.split('/');
      var parentPathIndex = pathSections.length - 2;
      docPage.parentDisplayName = pathSections[parentPathIndex];

      if (_.isArray(docPage.children) && docPage.children.length) {
        docPage.isParent = true;
      }
    });

    // Now, update the 'isChild' flag for any section whose parent is an 'overview' or 'table of contents' page.
    // (These will be considered top-level nav items, instead of being nested under the parent item.)
    _.each(inputs.docPageMetadatas, function(docPage) {
      if (docPage.parent) {
        var parent = _.find(inputs.docPageMetadatas, {path: docPage.parent});
        if(parent && (parent.isOverviewPage || parent.isTableOfContents)) {
          docPage.isChild = false;
          docPage.parent = '';
        }
      }
    });


    // Sort the metadatas.
    inputs.docPageMetadatas.sort(function(a, b) {
      return UtilService.compareDocPageMetadatas({
        a: a,
        b: b,
        isAnatomyMetadata: docSection === 'anatomy'
      });
    });//</ sort>


    // Now that all the metadata is properly, we can
    // sort each doc page metadata's `children` array.
    _.each(inputs.docPageMetadatas, function(docPage) {
      if (docPage.isParent) {
        docPage.children.sort(function(a, b) {
          var childDataA = _.find(inputs.docPageMetadatas, {path: a});
          var childDataB = _.find(inputs.docPageMetadatas, {path: b});
          return UtilService.compareDocPageMetadatas({
            a: childDataA,
            b: childDataB,
            isAnatomyMetadata: docSection === 'anatomy'
          });
        });
      }
    });

    return exits.success(inputs.docPageMetadatas);
  },
  "identity": "MarshaldocPageMetadata"
};
