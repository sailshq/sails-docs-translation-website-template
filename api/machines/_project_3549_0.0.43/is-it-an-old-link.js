module.exports = {
  "inputs": {
    "docPageMetadatas": {
      "friendlyName": "Doc page metadatas",
      "description": "",
      "example": [{}],
      "required": true,
      "addedManually": true
    },
    "slug": {
      "friendlyName": "slug",
      "description": "",
      "example": "idk/idk",
      "required": true,
      "addedManually": true
    },
    "q": {
      "friendlyName": "q",
      "description": "",
      "example": "task-configuration",
      "required": false,
      "addedManually": true
    }
  },
  "exits": {
    "error": {
      "example": undefined
    },
    "success": {
      "void": true,
      "friendlyName": "then",
      "variableName": "result",
      "description": "Normal outcome."
    },
    "oldLink": {
      "friendlyName": "old link",
      "description": "",
      "example": "/foo/bar"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var _ = require('lodash');


    // Strip .html off of slug, if it's there. (For old links)
    var htmlStrippedSlugInput = inputs.slug.replace(/\.html/g, '');

    var subSection;
    if (inputs.q) {
      // Strip off the extra ?q= from the frontend redirect
      subSection = inputs.q.replace(/\?q=.+$/, '');
    }

    // Strip off old ?q= permalinks
    htmlStrippedSlugInput = htmlStrippedSlugInput.replace(/\?q=.+$/, '');


    var selectedDocPage = _.find(inputs.docPageMetadatas, function(docPage) {
      if (docPage.path.toLowerCase() === htmlStrippedSlugInput.toLowerCase() + '.ejs') {
        if (docPage.path.toLowerCase() === docPage.slug + '.ejs') {
          return false;
        }
        return true;
      }
      return false;
    });

    if (selectedDocPage) {
      if (subSection) {
        console.log(selectedDocPage.slug + '#?' + subSection);
        return (exits.oldLink(selectedDocPage.slug + '#?' + subSection));
      }
      return (exits.oldLink(selectedDocPage.slug));
    }

    return exits.success();
  },
  "identity": "is-it-an-old-link"
};