(function (){

  angular.module('sails').factory('sailsWebsiteActions', [
    'docPage',
    'appendStdDropdown',
    'getDropdownValue',
    'appendDropdown',
    'showDropdownChoices',
    'setHomepageBottomPadding',
    function (docPage, appendStdDropdown, getDropdownValue, appendDropdown, showDropdownChoices, setHomepageBottomPadding) {

    /**
     * sailsWebsiteActions()
     *
     * Bind actions to DOM elements depending on what page is being viewed.
     * -----------------------------------------------------------------
     * @required {String} page
     * -----------------------------------------------------------------
     */
    return function sailsWebsiteActions (options) {

      //  ╔═╗╔═╗╔═╗╔═╗  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
      //  ╠═╝╠═╣║ ╦║╣   ╠═╣║   ║ ║║ ║║║║╚═╗
      //  ╩  ╩ ╩╚═╝╚═╝  ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝

      switch(options.page) {

        case 'documentation':
          docPage();
          break;

        case 'home': {
          // Since this is a short page, set the bottom padding based on the footer height
          // so we can have the footer absolutely positioned at the bottom.
          setHomepageBottomPadding();

          // Reset it if the window is resized.
          $(window).on('resize', _.throttle(function() {setHomepageBottomPadding();}, 100));
        }
      }




      //   ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗    ███████╗ ██████╗ ██████╗
      //  ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝    ██╔════╝██╔═══██╗██╔══██╗
      //  ██║     ███████║█████╗  ██║     █████╔╝     █████╗  ██║   ██║██████╔╝
      //  ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗     ██╔══╝  ██║   ██║██╔══██╗
      //  ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗    ██║     ╚██████╔╝██║  ██║
      //   ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝
      //
      //   ██████╗ ██╗     ██████╗     ██╗     ██╗███╗   ██╗██╗  ██╗███████╗
      //  ██╔═══██╗██║     ██╔══██╗    ██║     ██║████╗  ██║██║ ██╔╝██╔════╝
      //  ██║   ██║██║     ██║  ██║    ██║     ██║██╔██╗ ██║█████╔╝ ███████╗
      //  ██║   ██║██║     ██║  ██║    ██║     ██║██║╚██╗██║██╔═██╗ ╚════██║
      //  ╚██████╔╝███████╗██████╔╝    ███████╗██║██║ ╚████║██║  ██╗███████║
      //   ╚═════╝ ╚══════╝╚═════╝     ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
      //
      // Check for the old '/#/' and '/#!/' links and redirect to the right place.
      if(window.location.hash && window.location.hash.indexOf('#?') < 0) {
        var redirectTo = window.location.hash.replace(/#/g, '').replace(/!/g, '');
        if(redirectTo[0] === '/') {
          redirectTo = redirectTo.replace(/\//, '');
        }
        var q;
        if(window.location.hash.indexOf('?q=') > -1) {
          q = '?q='+window.location.hash.split('?q=')[1];
          redirectTo = redirectTo + q;
        }
        window.location.href = redirectTo;
      }






      //   █████╗ ██████╗ ██████╗ ███████╗███╗   ██╗██████╗     ████████╗ ██████╗ ██████╗ ██████╗  █████╗ ██████╗
      //  ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔══██╗    ╚══██╔══╝██╔═══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
      //  ███████║██████╔╝██████╔╝█████╗  ██╔██╗ ██║██║  ██║       ██║   ██║   ██║██████╔╝██████╔╝███████║██████╔╝
      //  ██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██║╚██╗██║██║  ██║       ██║   ██║   ██║██╔═══╝ ██╔══██╗██╔══██║██╔══██╗
      //  ██║  ██║██║     ██║     ███████╗██║ ╚████║██████╔╝       ██║   ╚██████╔╝██║     ██████╔╝██║  ██║██║  ██║
      //  ╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═════╝        ╚═╝    ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
      //
      //  ██████╗ ██████╗  ██████╗ ██████╗ ██████╗  ██████╗ ██╗    ██╗███╗   ██╗███████╗
      //  ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔═══██╗██║    ██║████╗  ██║██╔════╝
      //  ██║  ██║██████╔╝██║   ██║██████╔╝██║  ██║██║   ██║██║ █╗ ██║██╔██╗ ██║███████╗
      //  ██║  ██║██╔══██╗██║   ██║██╔═══╝ ██║  ██║██║   ██║██║███╗██║██║╚██╗██║╚════██║
      //  ██████╔╝██║  ██║╚██████╔╝██║     ██████╔╝╚██████╔╝╚███╔███╔╝██║ ╚████║███████║
      //  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝
      //
      // If this isn't a flagship page....
      if(!_.isUndefined(options.page) && options.page !== 'flagship' && options.page !== 'flagship-plans') {

        // Append the version dropdown
        var currentVersion = $('#header').find('[is="topbar-version-info"]').attr('data-current-site-version');
        var versionMenuDomId = appendStdDropdown({
          choices: [
            {
              displayName: 'Version:',
              url: '',
              isDisabled: true
            },
            {
              displayName: 'v1.0',
              url: 'http://sailsjs.com/documentation/upgrading/to-v-1-0'
            },
            {
              displayName: 'v0.12',
              url: 'http://sailsjs.com/'
            },
          ],
          keyToDisplay: 'displayName',
          containerSelector: '#header [is="topbar-version-info"]',
          selectedIndex: currentVersion === '1.0' ? 1 : 2
        });

        // Remove the placeholder and append the documentation menu dropdown.
        $('#header').find('[is="temporary"]').remove();
        var docsDropdownDomId = appendDropdown({
          choices: [
            {
              url: '/documentation/reference',
              isExternal: false
            },
            {
              url: '/documentation/concepts',
              isExternal: false
            },
            {
              url: '/documentation/anatomy',
              isExternal: false
            },
            {
              url: '/documentation/upgrading',
              isExternal: false
            },
            {
              url: '/documentation/contributing',
              isExternal: false
            },
            {
              url: '/documentation/tutorials',
              isExternal: false
            },
            {
              url: 'https://www.manning.com/books/sails-js-in-action',
              isExternal: true
            },
          ],
          containerSelector: '#header [is="documentation-dropdown-wrapper"]',
          html: '<div is="dropdown" class="custom-dropdown"><div class="dropdown-wrapper">'+
              '<div is="options-container" class="options-container" id="docs-menu"><ul is="inner-options-container" class="contents">'+
              '<li is="choice" class="choice">Reference</li>'+
              '<li is="choice" class="choice">Concepts</li>'+
              '<li is="choice" class="choice with-divider">App structure</li>'+
              '<li is="choice" class="choice new-section">Upgrading</li>'+
              '<li is="choice" class="choice with-divider">Contribution guide</li>'+
              '<li is="choice" class="choice new-section">Tutorials</li>'+
              '<li is="choice" class="choice">Book</li>'+
              '</ul></div>'+
              '<div class="resting-state docs-menu-header" is="dropdown-resting-state"><span is="placeholder-text">Documentation</span><i class="dropdown-arrow-icon sails-icon icon-angle-down"></i></div>'+
              '</div></div>',
          choiceContainerSelector: '[is="options-container"]',
          choiceSelector: '[is="choice"]',
          customEvents: [
            {
              on: 'dropdown:select',
              fn: function(e, selectedChoice) {
                var navigateTo = selectedChoice.url;
                // If the `url` is external, open in a new tab.
                if(selectedChoice.isExternal) {
                  window.open(selectedChoice.url, '_blank');
                }
                // Otherwise, just navigate to the url.
                else {
                  window.location.href=navigateTo;
                }
              }
            }
          ]
        });
        // Now the dropdown has been appended, add the 'current' class to the docs link if applicable.
        var $docsDropdownWrapper = $('#header').find('[is="documentation-dropdown-wrapper"]');
        if($docsDropdownWrapper.attr('data-is-current')) {
          $docsDropdownWrapper.addClass('current');
        }
      }//</if not flagship page>



      //   ██████╗██╗   ██╗███████╗████████╗ ██████╗ ███╗   ███╗
      //  ██╔════╝██║   ██║██╔════╝╚══██╔══╝██╔═══██╗████╗ ████║
      //  ██║     ██║   ██║███████╗   ██║   ██║   ██║██╔████╔██║
      //  ██║     ██║   ██║╚════██║   ██║   ██║   ██║██║╚██╔╝██║
      //  ╚██████╗╚██████╔╝███████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
      //   ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
      //
      //  ███████╗██╗   ██╗███╗   ██╗████████╗ █████╗ ██╗  ██╗
      //  ██╔════╝╚██╗ ██╔╝████╗  ██║╚══██╔══╝██╔══██╗╚██╗██╔╝
      //  ███████╗ ╚████╔╝ ██╔██╗ ██║   ██║   ███████║ ╚███╔╝
      //  ╚════██║  ╚██╔╝  ██║╚██╗██║   ██║   ██╔══██║ ██╔██╗
      //  ███████║   ██║   ██║ ╚████║   ██║   ██║  ██║██╔╝ ██╗
      //  ╚══════╝   ╚═╝   ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
      //
      //  ██╗  ██╗██╗ ██████╗ ██╗  ██╗██╗     ██╗ ██████╗ ██╗  ██╗████████╗██╗███╗   ██╗ ██████╗
      //  ██║  ██║██║██╔════╝ ██║  ██║██║     ██║██╔════╝ ██║  ██║╚══██╔══╝██║████╗  ██║██╔════╝
      //  ███████║██║██║  ███╗███████║██║     ██║██║  ███╗███████║   ██║   ██║██╔██╗ ██║██║  ███╗
      //  ██╔══██║██║██║   ██║██╔══██║██║     ██║██║   ██║██╔══██║   ██║   ██║██║╚██╗██║██║   ██║
      //  ██║  ██║██║╚██████╔╝██║  ██║███████╗██║╚██████╔╝██║  ██║   ██║   ██║██║ ╚████║╚██████╔╝
      //  ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝
      //
      // Syntax highlighting!!
      (function highlightThatSyntax(){
        $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });

        // Make sure the <pre> tags whose code isn't being highlighted
        // has that nice muted look we like.
        $('.nohighlight').each(function() {
          var $codeBlock = $(this);
          $codeBlock.closest('pre').addClass('muted');
        });
        // Also make sure the 'usage' code blocks have special styles.
        $('.usage').each(function() {
          var $codeBlock = $(this);
          $codeBlock.closest('pre').addClass('usage-wrapper');
        });

        // Now let's make the `function` keywords blue like in sublime.
        $('.hljs-keyword').each(function() {
          var $highlightedKeyword = $(this);
          if($highlightedKeyword.text() === 'function') {
            $highlightedKeyword.removeClass('hljs-keyword');
            $highlightedKeyword.addClass('hljs-function-keyword');
          }
        });

        $('.hljs-built_in').each(function() {
          var $builtIn = $(this);
          var $parentCode = $builtIn.closest('code');
          var isJavascriptSyntax = $parentCode.hasClass('javascript');
          var isBashSyntax = $parentCode.hasClass('bash');
          // ...and make the `require()`s not yellow, also like in sublime.
          if(isJavascriptSyntax && $builtIn.text() === 'require') {
            $builtIn.removeClass('hljs-built_in');
          }
          // And don't highlight the word 'test' in the bash examples, e.g. for ('sails new test-project')
          if(isBashSyntax && $builtIn.text() === 'test') {
            $builtIn.removeClass('hljs-built_in');
          }
        });
      })();

      // Check for mobile browsers. If this is a mobile browser, show the version string in the topbar instead of the dropdown.
      // (Because the dropdown takes up a lot of space and also looks funky on mobile.)
      if(_.isObject(bowser) && bowser.mobile) {
        $('[is="topbar-version-info"]').addClass('mobile');
      }


      // Get the id of the permalink, if there is one.
      var permalink = window.location.hash.split('#?')[1];

      if(permalink) {
        // Now scroll to that spot on the page
        $(function onceDOMIsReadyOrNowIfItsAlreadyReady(){
          $('html, body').animate({
            scrollTop: $('#'+permalink).offset().top - 125
          }, 0);
        });
      }


      //  ███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗
      //  ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
      //  █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗
      //  ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║
      //  ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║
      //  ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝

      //  ╔═╗╦ ╦╔═╗╔╗╔╔═╗╔═╗
      //  ║  ╠═╣╠═╣║║║║ ╦║╣
      //  ╚═╝╩ ╩╩ ╩╝╚╝╚═╝╚═╝
      //  ┌─  ┬  ┬┌─┐┬─┐┌─┐┬┌─┐┌┐┌  ┌┬┐┬─┐┌─┐┌─┐┌┬┐┌─┐┬ ┬┌┐┌  ─┐
      //  │───└┐┌┘├┤ ├┬┘└─┐││ ││││   ││├┬┘│ │├─┘ │││ │││││││───│
      //  └─   └┘ └─┘┴└─└─┘┴└─┘┘└┘  ─┴┘┴└─└─┘┴  ─┴┘└─┘└┴┘┘└┘  ─┘
      $('#header [is="topbar-version-info"]').on('dropdown:select', function(e) {
        console.log('selected in dropdown!',$(e.currentTarget).val());
        // Get the url for the selected version of the sails site.
        var selected = getDropdownValue({ domId: versionMenuDomId });
        // Redirect to the site for the selected version.
        window.location.href = selected.url;
      });

      //  ╔═╗╦  ╦╔═╗╦╔═
      //  ║  ║  ║║  ╠╩╗
      //  ╚═╝╩═╝╩╚═╝╩ ╩
      //  ┌─ ┌┬┐┬─┐┌─┐┌─┐┌┬┐┌─┐┬ ┬┌┐┌  ┬ ┬┬─┐┌─┐┌─┐┌─┐┌─┐┬─┐  ─┐
      //  │───││├┬┘│ │├─┘ │││ │││││││  │││├┬┘├─┤├─┘├─┘├┤ ├┬┘───│
      //  └─ ─┴┘┴└─└─┘┴  ─┴┘└─┘└┴┘┘└┘  └┴┘┴└─┴ ┴┴  ┴  └─┘┴└─  ─┘
      $('#header [is="documentation-dropdown-wrapper"]').on('click', function(e) {
        showDropdownChoices({
          domId: docsDropdownDomId,
          focus: true
        });
      });

      //  ╔╦╗╦═╗╔═╗╔═╗╔╦╗╔═╗╦ ╦╔╗╔  ╔═╗╔═╗╔═╗╔╗╔╔═╗╔╦╗
      //   ║║╠╦╝║ ║╠═╝ ║║║ ║║║║║║║  ║ ║╠═╝║╣ ║║║║╣  ║║
      //  ═╩╝╩╚═╚═╝╩  ═╩╝╚═╝╚╩╝╝╚╝  ╚═╝╩  ╚═╝╝╚╝╚═╝═╩╝
      $('#'+docsDropdownDomId).on('dropdown:opened', function(e) {
        // Add the 'dropdown-open' class to the dropdown wrapper, for proper hover styles.
        $(e.currentTarget).closest('[is="documentation-dropdown-wrapper"]').addClass('docs-dropdown-open');
      });

      //  ╔╦╗╦═╗╔═╗╔═╗╔╦╗╔═╗╦ ╦╔╗╔  ╔═╗╦  ╔═╗╔═╗╔═╗╔╦╗
      //   ║║╠╦╝║ ║╠═╝ ║║║ ║║║║║║║  ║  ║  ║ ║╚═╗║╣  ║║
      //  ═╩╝╩╚═╚═╝╩  ═╩╝╚═╝╚╩╝╝╚╝  ╚═╝╩═╝╚═╝╚═╝╚═╝═╩╝
      $('#'+docsDropdownDomId).on('dropdown:closed', function(e) {
        // Remove the 'dropdown-open' class from the dropdown wrapper, for proper hover styles.
        $(e.currentTarget).closest('[is="documentation-dropdown-wrapper"]').removeClass('docs-dropdown-open');
      });

      //  ╔═╗╦  ╦╔═╗╦╔═
      //  ║  ║  ║║  ╠╩╗
      //  ╚═╝╩═╝╩╚═╝╩ ╩
      //  ┌─ ┌┬┐┬─┐┌─┐┌─┐┌┬┐┌─┐┬ ┬┌┐┌  ┌┬┐┌─┐┌┐┌┬ ┬  ┌┐┌┬┐┌┐┌  ─┐
      //  │───││├┬┘│ │├─┘ │││ │││││││  │││├┤ ││││ │  ├┴┐│ │││───│
      //  └─ ─┴┘┴└─└─┘┴  ─┴┘└─┘└┴┘┘└┘  ┴ ┴└─┘┘└┘└─┘  └─┘┴ ┘└┘  ─┘
      $('[is="dropdown-menu-button"]').on('click', function(e) {
        // Hide any currently-open dropdowns.
        $('#docs-menu').addClass('hidden');
        $('#docs-menu').css('opacity', '0');
        $('[is="dropdown-menu-button"]').removeClass('active');

        var dropdownId = $(e.currentTarget).attr('data-for-menu');
        $('#'+dropdownId).css('opacity', '1');
        $('#'+dropdownId).removeClass('hidden');
        $('#nav-menu-overlay').addClass('menu-open');
        $(e.currentTarget).addClass('active');
      });

      //  ╔═╗╦  ╦╔═╗╦╔═
      //  ║  ║  ║║  ╠╩╗
      //  ╚═╝╩═╝╩╚═╝╩ ╩
      //  ┌─  ┌┬┐┌─┐┌┐ ┬┬  ┌─┐  ┌┬┐┌─┐┌┐┌┬ ┬  ┌┐┌┬┐┌┐┌  ─┐
      //  │───││││ │├┴┐││  ├┤   │││├┤ ││││ │  ├┴┐│ │││───│
      //  └─  ┴ ┴└─┘└─┘┴┴─┘└─┘  ┴ ┴└─┘┘└┘└─┘  └─┘┴ ┘└┘  ─┘
      $('[is="mobile-menu-button"]').on('click', function(e) {
        $(e.currentTarget).addClass('menu-open');
        $('[is="nav-menu"]').addClass('menu-open');
        $('#nav-menu-overlay').addClass('menu-open');
      });

      //  ╔═╗╦  ╦╔═╗╦╔═
      //  ║  ║  ║║  ╠╩╗
      //  ╚═╝╩═╝╩╚═╝╩ ╩
      //  ┌─  ┌┐┌┌─┐┬  ┬  ┌┬┐┌─┐┌┐┌┬ ┬  ┌─┐┬  ┬┌─┐┬─┐┬  ┌─┐┬ ┬  ─┐
      //  │───│││├─┤└┐┌┘  │││├┤ ││││ │  │ │└┐┌┘├┤ ├┬┘│  ├─┤└┬┘───│
      //  └─  ┘└┘┴ ┴ └┘   ┴ ┴└─┘┘└┘└─┘  └─┘ └┘ └─┘┴└─┴─┘┴ ┴ ┴   ─┘
      $('#nav-menu-overlay').on('click', function(e) {
        // Make sure the dropdown menus are hidden
        // (animating out, if applicable)
        $('#docs-menu').addClass('hidden');
        $('#version-menu').addClass('hidden');
        // Make sure the mobile menu is hidden
        // (animating out, if applicable)
        $('[is="nav-menu"]').removeClass('menu-open');
        // // Wait for the animation to end, then...
        // setTimeout(function afterMenuIsDoneAnimating() {
          // Make the dropdown menu completely transparent
          $('#docs-menu').css('opacity', '0');
          // Remove the 'menu-open' class from the mobile menu button,
          // so it is visible again.
          $('[is="mobile-menu-button"]').removeClass('menu-open');
          // Hide the nav menu overlay
          $(e.currentTarget).removeClass('menu-open');
          $('[is="dropdown-menu-button"]').removeClass('active');
        // }, 300);
      });

      //  ╔═╗╦  ╦╔═╗╦╔═
      //  ║  ║  ║║  ╠╩╗
      //  ╚═╝╩═╝╩╚═╝╩ ╩
      //  ┌─ ┌┬┐┬─┐┌─┐┌─┐┌┬┐┌─┐┬ ┬┌┐┌  ┌┐┌┌─┐┬  ┬  ┬┌┬┐┌─┐┌┬┐  ─┐
      //  │───││├┬┘│ │├─┘ │││ │││││││  │││├─┤└┐┌┘  │ │ ├┤ │││───│
      //  └─ ─┴┘┴└─└─┘┴  ─┴┘└─┘└┴┘┘└┘  ┘└┘┴ ┴ └┘   ┴ ┴ └─┘┴ ┴  ─┘
      $('[is="dropdown-nav-item"]').on('click', function(e) {
        // Hide the menu and nav menu overlay without waiting for animation
        $('#docs-menu').addClass('hidden');
        $('#docs-menu').css('opacity', '0');
        $('#nav-menu-overlay').removeClass('menu-open');
        $('[is="dropdown-menu-button"]').removeClass('active');
      });

     //  ╔═╗╦  ╦╔═╗╦╔═
     //  ║  ║  ║║  ╠╩╗
     //  ╚═╝╩═╝╩╚═╝╩ ╩
     //  ┌─  ┬  ┬┌┐┌┬┌─  ─┐
     //  │───│  ││││├┴┐───│
     //  └─  ┴─┘┴┘└┘┴ ┴  ─┘
     $('a').on('click', function(e) {
       // Check whether this link goes to the page we're currently on.
       var clickedLink = $(e.currentTarget).attr('href');
       // If this link doesn't have an href, bail.
       if(_.isUndefined(clickedLink)) {
        return;
      }
       var isSamePage = clickedLink.split('#?')[0] === window.location.pathname.split('#?')[0];
       // If it is a link to the same page...
       if(isSamePage) {
         // Get the id of the permalink, if there is one.
         var scrollToSection = clickedLink.split('#?')[1];
         if(scrollToSection) {
           // Now scroll to that spot on the page
           $('html, body').animate({
             scrollTop: $('#'+scrollToSection).offset().top - 125
           }, 0);
         }
       }
     });


    };
  }]);

})();
