module.exports = function sendResponse (options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // If a status is provided, it must be an int, or consider this an error
  if (options.status) {
    options.status = parseInt(options.status, 10) || 500;
  }
  // Default to status 200.
  else {
    options.status = 200;
  }

  switch (options.action) {

    case 'respond_with_result_and_status':
    case 'respond_with_value_and_status':
      try {
        JSON.parse(options.data);
        res.status(options.status);
        return res.json(options.data);
      }
      catch (e) {
        res.status(options.status);

        // Show the error.
        if (_.isError(options.data)) {
          if (!_.isFunction(options.data.toJSON)) {
            options.data = options.data.stack;
          }
        }

        return res.send(options.data);
      }
      break;

    case 'respond_with_status':
      if (options.status === 200) { return res.send(200); }
      else {
        return res.negotiate({status: options.status, error: options.data});
      }
      break;

    case 'redirect':
      try {
        res.redirect(options.data);
      } catch (e) {
        res.send('Redirect error:'+e.stack);
      }
      break;

    case 'display_view':
      res.view(options.view, options.data);
      break;

    case 'not_implemented':
      res.send(501);
      break;

    case 'compiler_error':
      res.send(500, "There was an error compiling this route!");
      break;

  }

  return;

};
