module.exports = {
  "inputs": {
    "path": {
      "id": "39a8f72e-cb11-4f72-b9a0-06d6be90d453",
      "friendlyName": "path",
      "description": "The path in the GitHub repo to pull from.",
      "example": "anatomy",
      "requiredManually": true,
      "addedManually": true,
      "required": true
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
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    /**
     * Module dependencies
     */

    var path = require('path');
    var cheerio = require('cheerio');
    var DocTemplater = require('doc-templater');
    var Filesystem = require('machinepack-fs');
    var _ = require('lodash');


    // This function is applied to each template before the markdown is converted to markup
    function beforeConvert(mdString, done) {

      // This is an HTML comment because it is easy to over-match and "accidentally"
      // add it underneath each code block as well (being an HTML comment ensures it
      // doesn't show up or break anything)
      // var TMP_LANG_MARKER_EXPR = /<!-- __LANG=\%[^%]*\%__ -->/;
      var LANG_MARKER_PREFIX = '<!-- __LANG=%';
      var LANG_MARKER_SUFFIX = '%__ -->';

      // Based on the github-flavored markdown's language annotation, (e.g. ```js```)
      // add a temporary marker to code blocks that can be parsed post-md-compilation
      // by the `afterConvert()` lifecycle hook
      mdString = mdString.replace(/(```)([a-zA-Z]*)(\s*\n)/g, '$1\n' + LANG_MARKER_PREFIX + '$2' + LANG_MARKER_SUFFIX + '$3');

      return done(null, mdString);
    }

    // This function is applied to each template after the markdown is converted to markup
    function afterConvert(html, done) {

      // Replace github emoji with HTML
      html = html.replace(/\:white_check_mark\:/g, '<i class="sails-icon icon-plus"></i>');
      html = html.replace(/\:white_large_square\:/g, '<i class="sails-icon icon-minus"></i>');
      html = html.replace(/\:heavy_multiplication_x\:/g, '<i class="sails-icon icon-times"></i>');

      // Replace ((bubble))s with HTML
      html = html.replace(/\(\(([^())]*)\)\)/g, '<bubble type="$1" class="colors"><span is="bubble-heart"></span></bubble>');

      // Flag <h2>, <h3>, <h4>, and <h5> tags
      // with the `permalinkable` directive
      //
      // e.g.
      // if the page is #/documentation/reference/req
      // and the slug is "transport-compatibility"
      // then the final URL will be #/documentation/reference/req?q=transport-compatibility
      var $ = cheerio.load(html);
      $('h2, h3, h4, h5').each(function() {
        var content = $(this).text() || '';

        // build the URL slug suffix
        var slug = content
          .replace(/[\?\!\.\-\_\:\;\'\"]/g, '') // punctuation => gone
          .replace(/\s/g, '-') // spaces => dashes
          .toLowerCase();

        // set the permalink attr
        $(this).attr('permalink', slug);

        // this was throwing ".wrap is undefined"
        if ($(this) && typeof $(this).wrap === 'function') {
          $(this).wrap('<div class="permalink-header"></div>');
        }

      });
      html = $.html();

      // Convert URL fragment links (i.e. for client-side routes) into
      // web-root-relative URLs (i.e. they'll have a leading slash).
      // (this is because there are lots of links left over from when sailsjs.org
      // used client-side routes for navigation around the documentation pages.)
      html = html.replace(/(href=")\.?\/?#\/?([^"]*)"/g, '$1/$2"');

      // e.g.
      //   href="/#/asdjgasdg"     =>  href="/asdjgasdg"
      //   href="#/asdjgasdg"      =>  href="/asdjgasdg"
      //   href="/#/"              =>  href="/"
      //   href="#/asdjgasdg"      =>  href="/asdjgasdg"

      // Get rid of the '.html' at the end of ANY internal web-root-relative URL that
      // point at the documentation pages. Any links form the docs that start with
      // '/documentation' and ends in '.html' will have the file extension stripped off.
      html = html.replace(/(href="\/documentation)([^"]*)\.html"/g, '$1$2"');

      // Add target=_blank to external links (e.g. http://google.com or https://chase.com)
      html = html.replace(/(href="https?:\/\/([^"]+)")/g, function(match) {
        // Check if this is an external link that is ALSO not a link to some page
        // on `(*.)?sailsjs.com` or `(*.)?sailsjs.org`.
        var isExternal = ! match.match(/^href=\"https?:\/\/([^\.]+\.)*sailsjs\.(org|com)/g);

        // If it is NOT external, check whether we are on one of the special
        // versioned sailsjs.com subdomains. If so, make sure the internal links have the correct subdomain added to them.
        if (!isExternal) {
          // If the internal link has any subdomain in front of the sailsjs.com (e.g. next.sailsjs.com), leave it be.
          var link = match.replace(/href="https?:\/\//, '');
          var hasVersionSubdomain = link.split('.')[0] !== 'sailsjs';
          if(hasVersionSubdomain) {
            return match;
          }
          // Otherwise, change the link to be without the 'http://sailsjs.com'.
          // (e.g. 'href="http://sailsjs.com/documentation/concepts"'' becomes simply 'href="/documentation/concepts"'')
          else {
            return link.replace(/^sailsjs\.(org|com)/, 'href="');
          }
        }//--•



        // Otherwise, it is external, so add target="_blank" so the link will open in a new tab.
        var newHtmlAttrsSnippet = match.replace(/(href="https?:\/\/([^"]+)")/g, '$1 target="_blank"');

        return newHtmlAttrsSnippet;
      });


      // Add the appropriate class to the `<code>` based on the temporary marker
      // (TMP_LANG_MARKER_EXPR) that was added in the `beforeConvert()` lifecycle
      // hook above
      // console.log('RAN AFTER HOOK, found: ',html.match(/(<code)([^>]*)(>\s*)(\&lt;!--\s*__LANG=\%[^\%]*\%__\s*--\&gt;)/g));

      // Interpret `js` as `javascript`
      html = html.replace(
        // $1     $2     $3   $4
        /(<code)([^>]*)(>\s*)(\&lt;!-- __LANG=\%js\%__ --\&gt;)\s*/gm,
        '$1 class="javascript"$2$3'
      );

      // Interpret `sh` and `bash` as `bash`
      html = html.replace(
        // $1     $2     $3   $4
        /(<code)([^>]*)(>\s*)(\&lt;!-- __LANG=\%(bash|sh)\%__ --\&gt;)\s*/gm,
        '$1 class="bash"$2$3'
      );

      // When unspecified, default to `text`
      html = html.replace(
        // $1     $2     $3   $4
        /(<code)([^>]*)(>\s*)(\&lt;!-- __LANG=\%\%__ --\&gt;)\s*/gm,
        '$1 class="nohighlight"$2$3'
      );

      // Finally, nab the rest, leaving the code language as-is.
      html = html.replace(
        // $1     $2     $3   $4               $5    $6
        /(<code)([^>]*)(>\s*)(\&lt;!-- __LANG=\%)([^%]+)(\%__ --\&gt;)\s*/gm,
        '$1 class="$5"$2$3'
      );

      return done(null, html);
    }

    // This is just to make it easier to tell what is happening.
    var BRANCH = _.isUndefined(sails.config.branch) ? '0.11' : sails.config.branch;
    var REMOTE = _.isUndefined(sails.config.remote) ? 'git://github.com/balderdashy/sails-docs.git' : sails.config.remote;
    console.log('Compiling `%s` docs from the `%s` branch of `%s`...', inputs.path, BRANCH, REMOTE);

    // Delete current rendered partials if they exist
    Filesystem.rmrf({
      dir: path.resolve(env.sails.config.appPath, 'views/partials/doc-templates/', inputs.path),
    }).exec({

      // An unexpected error occurred.
      error: exits.error,

      // OK.
      success: function() {
        // Compile the markdown into HTML templates
        DocTemplater()
          .build([{
            remote: REMOTE,
            branch: BRANCH,
            remoteSubPath: inputs.path,
            htmlDirPath: path.join('views/partials/doc-templates/', inputs.path),
            jsMenuPath: path.join('views/partials/doc-menus', inputs.path + '.jsmenu'),
            outputExtension: 'ejs',
            beforeConvert: beforeConvert,
            afterConvert: afterConvert,
          }], function(err) {
            if (err) return exits.error(err);
            return exits.success();
          });
      }
    });
  },
  "identity": "Compilemarkdowndocs"
};
