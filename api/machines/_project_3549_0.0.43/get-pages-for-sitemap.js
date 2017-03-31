module.exports = {
  "inputs": {
    "docPageMetadatas": {
      "id": "27407686-6bda-4fe7-9127-3a6c892517b6",
      "friendlyName": "Doc page metadatas",
      "description": "",
      "example": [{}],
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
        "url": "http://sailsjs.com",
        "lastModified": "2015-01-01T06:00:00.000Z"
      }]
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var _ = require('lodash');

    var hardCodedDate = 1479943864387;

    // Start off with the hard-coded pages:
    var sitemapEntries = [{
      url: 'http://sailsjs.com',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/get-started',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/features',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/about',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/whats-that',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/support',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/support/about-irc',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/security',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/resources',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/flagship',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/legal',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/licenses',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/terms',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/terms/flagship',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/privacy',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/logo-usage',
      lastModified: new Date(hardCodedDate).toJSON()
    }, {
      url: 'http://sailsjs.com/faq',
      lastModified: new Date(hardCodedDate).toJSON()
    }];

    // Then grab the list of generated pages from the various jsmenus...
    _.each(inputs.docPageMetadatas, function(docPage) {

      var url = 'http://sailsjs.com/documentation/' + _.trimRight(docPage.slug, '/');
      // If this page has the `notShownOnWebsite` flag, don't add it to the sitemap..
      if(docPage.notShownOnWebsite) {
        return;
      }

      // Format the last modified date.
      var lastmod;
      // If the doc page was last modified BEFORE our hard-coded date, use the hard-coded one instead.
      // (Because that is the date that we launched this version of the site, so everything will have been modified at that time.)
      if(_.isNumber(docPage.lastModified) && docPage.lastModified > hardCodedDate) {
        lastmod = new Date(docPage.lastModified).toJSON();
      }
      else {
        lastmod = new Date(hardCodedDate).toJSON();
      }
      sitemapEntries.push({
        url: url,
        lastModified: lastmod
      });
    });

    return exits.success(sitemapEntries);

  },
  "identity": "get-pages-for-sitemap"
};
