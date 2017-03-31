module.exports.routes = {

  'all /sitemap.xml': function (req, res, next) {

    // If this is NOT the current Sails website for the latest stable release of Sails --
    // e.g. if it's preview.sailsjs.com-- then don't show the sitemap.
    // (This is just to avoid confusing Google, Bing, et al.)
    if (!req._sails.config.isMainSailsWebsite) {
      // Instead, show the 404 page.
      return res.notFound();
    }

    // Otherwise, just keep on keepin on.
    // (This will serve sitemap.xml if it exists.)
    return next();

  },

  'get /security': {
    view: 'security-policy',
    data: {
        title: 'Security | Sails.js',
        description: 'Sails.js security policy and how to report security vulnerabilities.'
    }
  },

  'get /support/about-irc': {
    view: 'about-irc',
    locals: {
      title: 'About IRC | Sails.js',
      currentPage: 'about-irc'
    }
  },

  'get /support': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/support');
  },

  'get /get-started': {
    view: 'get-started',
    locals: {
      currentPage: 'get-started',
      title: 'Get Started  | Sails.js',
      description: 'Learn about installing Sails.js and Node.js, and get acquainted with some of Sails\'s major concepts, such as convention over configuration, loose coupling, and what Sails is and is not.'
    }
  },
  // This just forwards to /get-started
  'get /getstarted': function(req, res) {
    return res.status(301).redirect('/get-started');
  },

  'get /': {
    'target': 'Home$Controller.find'
  },

  'get /features': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/features');
  },


  'get /documentation/*': {
    'target': 'DocumentationController.*'
  },
  'post /refresh': {
    'target': 'RefreshController.find'
  },
  'get /documentation': {
    'target': 'DocumentationController.find'
  },

  'get /logos': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/logos');
  },

  'get /about': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/about');
  },

  'get /faq': {
    view: 'faq',
    locals: {
      title: 'FAQ | Sails.js',
      currentPage: 'faq'
    }
  },

  'get /whats-that': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/whats-that');
  },

  'get /flagship/plans': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/flagship/plans');
  },

  'get /flagship': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/flagship');
  },

  'get /studio': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/studio');
  },

  'get /legal': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/legal');
  },
  'get /licenses': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/licenses');
  },
  'get /terms': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/terms');
  },
  'get /terms/flagship': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/terms/flagship');
  },
  'get /privacy': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/privacy');
  },
  'get /logo-usage': function(req, res) {
    return res.status(301).redirect('http://sailsjs.com/logo-usage');
  },
};
