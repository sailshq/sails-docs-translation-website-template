module.exports = {
  "inputs": {
    "webpages": {
      "id": "8d44a8bf-839b-4157-b937-047fbdc0eeda",
      "friendlyName": "webpages",
      "description": "",
      "example": [{
        "url": "http://sailsjs.org",
        "lastModified": "2015-06-25T18:33:06.765Z"
      }],
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
      "example": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var _ = require('lodash');

    // Build sitemap body, initializing w/ the XML preamble first.
    var sitemapXML = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    _.each(inputs.webpages, function(webpage) {

      sitemapXML +=
        '<url>' +
        '<loc>' + sanitizeURL(webpage.url) + '</loc>' +
        '<lastmod>' + webpage.lastModified + '</lastmod>' +
        '<changefreq>monthly</changefreq>' +
        '</url>';

      return sitemapXML;
    });

    // Suffix
    sitemapXML += '</urlset>';


    /**
     * Convert ampersands into "&amp;"
     * (see http://stackoverflow.com/questions/3431280/validation-problem-entityref-expecting-what-should-i-do)
     *
     * @param  {String|undefined} url
     * @return {String}
     * @api private
     */
    function sanitizeURL(url) {
      //   return _.escape((url||''));
      return (url || '').replace(/\&/g, '&amp;');
    }

    return exits.success(sitemapXML);
  },
  "identity": "build-sitemap-xml"
};
