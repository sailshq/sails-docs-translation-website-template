angular.module('negotiate-keyboard-event', []);

angular.module('negotiate-keyboard-event')
.factory('negotiateKeyboardEvent', [function() {


  /**
   * negotiateKeyboardEvent
   *
   * @class        {angular.factory}
   * @module       negotiate-keyboard-event
   * @type         {Function}
   * @description
   *               Given a keydown DOM event object produced by jQuery,
   *               return a human-readable string indicating which
   *               (of a number of different known special keys) key
   *               was pressed.
   *
   *
   * @required  {Event} e
   *            The DOM event to sniff.
   *
   *
   * @optional  {Dictionary} handlers
   *            A dictionary of handler functions keyed by shorthand.
   *            @property {Function} * [e.g. `<ENTER>`]
   *              @param {Event} e
   *                   The DOM event that was passed in.
   *                   Provided for compatibility purposes.
   *              @param {String} keyShorthand
   *                   The key shorthand string that was decided for
   *                   the given DOM event (e.g. `'<ENTER>'`)
   *                   Provided for compatibility purposes.
   *
   */

  return function negotiateKeyboardEvent(e, handlers) {
    if (!_.isObject(e)) {
      throw new Error('Usage error: First argument to negotiateKeyboardEvent() is required, and should be specified as a DOM event object produced from jQuery (`e`).');
    }
    if (!_.isUndefined(handlers) && !_.isObject(handlers)) {
      throw new Error('Usage error: If provided, second argument to negotiateKeyboardEvent() should be specified as a dictionary of handler functions.');
    }

    // Most of this file is devoted to determining the appropriate
    // `keyShorthand` string (e.g. `<ENTER>`) representing the key
    // that was pressed (based on the DOM event provided).
    var keyShorthand;


    // For convenience/consistency below, set up a reference of modifier keys which
    // are currently pressed, taking client platform into account.  We sniff out whether
    // the end user is running Mac OS by looking at the `navigator` string.  If not, (e.g.
    // on Windows/Linux) then we understand <CMD> hotkey bindings to correspond to the
    // keyboard's <CTRL> key.... except for a few hotkeys which are platform-specific exceptions.
    var IS_USING_MAC_OS = !!(window.navigator.platform.match(/^Mac/i));
    var mods = {
      macOSCtrl: IS_USING_MAC_OS && e.ctrlKey,
      ctrl: e.ctrlKey,
      cmd: IS_USING_MAC_OS ? e.metaKey : e.ctrlKey, //<<Remember: `<CMD>` is interpreted platform-dependent-ly.
      alt: e.altKey,
      shift: e.shiftKey
    };


    ////////////////////////////////////////////////////////////////////////
    // Keycode reference:
    // http://www.quirksmode.org/js/keys.html
    ////////////////////////////////////////////////////////////////////////
    // Hotkey shorthand is always written using the following conventions
    // for the precedence of key modifiers:
    //
    // <SHIFT>+<CTRL>+<CMD>+<ALT>+<FN>+*
    //
    //
    // > Letters in shorthand should always be capitalized; e.g.
    // > `<CMD>+A`
    //
    //
    ////////////////////////////////////////////////////////////////////////
    // Some potential roadmap items for this negotiateKeyboardEvent() helper:
    // • interpret modifier keys up here
    // • throw assertion errors when bad syntax (e.g. `CMD+ALT+N`, `<CMD>+<N>`)
    //   or bad ordering of modifier keys (e.g. `<CMD>+<SHIFT>+S` instead of `<SHIFT>+<CMD>+S`)
    //   is detected.
    ////////////////////////////////////////////////////////////////////////


    // `+`
    if (e.which === 187 && mods.shift) {
      if(mods.cmd) {
        keyShorthand = '<CMD>++';
      }
      else {
        keyShorthand = '+';
      }
    }

    // `=`
    else if (e.which === 187 && !mods.shift) {
      if(mods.cmd) {
        keyShorthand = '<CMD>+=';
      }
      else {
        keyShorthand = '=';
      }
    }

    // `;`
    else if (e.which === 186 && !mods.shift) {
      keyShorthand = ';';
    }

    // `-`
    else if (e.which === 189 && !mods.shift) {
      if(mods.cmd) {
        keyShorthand = '<CMD>+-';
      }
      else {
        keyShorthand = '-';
      }
    }

    // `_`
    else if (e.which === 189 && mods.shift) {
      if(mods.cmd) {
        keyShorthand = '<CMD>+_';
      }
      else {
        keyShorthand = '_';
      }
    }

    // `.`
    else if (e.which === 190 && !mods.shift) {
      // • `<CMD>+.`
      if (mods.cmd) {
        keyShorthand = '<CMD>+.';
      }
      // • `.`
      else {
        keyShorthand = '.';
      }
    }

    // `/`
    else if (e.which === 191 && !mods.shift) {
      // • `<CMD>+<ALT>+/`
      if (mods.cmd && mods.alt) {
        keyShorthand = '<CMD>+<ALT>+/';
      }
      // • `<CMD>+/`
      else if (mods.cmd) {
        keyShorthand = '<CMD>+/';
      }
      // • `/`
      else {
        keyShorthand = '/';
      }
    }

    // `?`
    else if (e.which === 191 && mods.shift) {
      // • `<CMD>+<ALT>+?`
      if (mods.cmd && mods.alt) {
        keyShorthand = '<CMD>+<ALT>+?';
      }
      // • `<CMD>+?`
      else if (mods.cmd) {
        keyShorthand = '<CMD>+?';
      }
      // • `?`
      else {
        keyShorthand = '?';
      }
    }

    // • `<INSERT>`
    else if (e.which === 45) {
      // • `<SHIFT>+<INSERT>
      if (mods.shift) {
        keyShorthand = '<SHIFT>+<INSERT>';
      }
      // • `<INSERT>`
      else {
        keyShorthand = '<INSERT>';
      }
    }

    // • `<DEAD>`
    // This can be triggered e.g. by typing ´ on a Swedish keyboard,
    // or by typing ALT+U on a US keyboard.  For more information,
    // see http://stackoverflow.com/a/25509350.
    else if (e.which === 229 && e.key === 'Dead') {
      // • `<DEAD>`
      keyShorthand = '<DEAD>';
    }

    // • `<TAB>`
    else if (e.which === 9) {
      // • `<SHIFT>+<TAB>`
      if (mods.shift) {
        keyShorthand = '<SHIFT>+<TAB>';
      }
      // • `<TAB>`
      else {
        keyShorthand = '<TAB>';
      }
    }

    // • `<FN>+<DELETE>`
    else if (e.which === 46) {

      // • `<ALT>+<FN>+<DELETE>`
      if (mods.alt) {
        keyShorthand = '<ALT>+<FN>+<DELETE>';
      }
      // • `<CMD>+<FN>+<DELETE>`
      else if (mods.cmd) {
        keyShorthand = '<CMD>+<FN>+<DELETE>';
      }
      else {
        keyShorthand = '<FN>+<DELETE>';
      }
    }

    // • `<DELETE>`
    // (i.e. backspace)
    else if (e.which === 8) {

      // • `<SHIFT>+<CMD>+<ALT>+<DELETE>`
      if ((mods.cmd) && mods.shift && mods.alt) {
        keyShorthand = '<SHIFT>+<CMD>+<ALT>+<DELETE>';
      }
      // • `<ALT>+<DELETE>`
      else if (mods.alt) {
        keyShorthand = '<ALT>+<DELETE>';
      }
      // • `<CMD>+<DELETE>`
      else if (mods.cmd) {
        keyShorthand = '<CMD>+<DELETE>';
      }
      else {
        keyShorthand = '<DELETE>';
      }
    }

    // <SPACE>
    else if(e.which === 32) {
      // • `<SHIFT>+<CTRL>+<SPACE>`
      if (mods.shift && mods.ctrl) {
        keyShorthand = '<SHIFT>+<CTRL>+<SPACE>';
      }
      // • `<ALT>+<SPACE>`
      else if (mods.alt) {
        keyShorthand = '<ALT>+<SPACE>';
      }
      // • `<CTRL>+<SPACE>`
      else if (mods.ctrl) {
        keyShorthand = '<CTRL>+<SPACE>';
      }
      // • `<CMD>+<SPACE>`
      else if (mods.cmd) {
        keyShorthand = '<CMD>+<SPACE>';
      }
      else {
        keyShorthand = '<SPACE>';
      }
    }

    // `<ENTER>`
    else if (e.which === 13) {
      // • `<ALT>+<ENTER>`
      if (mods.alt) {
        keyShorthand = '<ALT>+<ENTER>';
      }
      // • `<CTRL>+<ENTER>`
      else if (mods.ctrl) {
        keyShorthand = '<CTRL>+<ENTER>';
      }
      // • `<CMD>+<ENTER>`
      else if (mods.cmd) {
        keyShorthand = '<CMD>+<ENTER>';
      }
      // • `<ENTER>`
      else {
        keyShorthand = '<ENTER>';
      }
    }

    // • `:`
    else if (e.which === 186 && mods.shift) {
      keyShorthand = ':';
    }

    // • `<F1>`
    else if (e.which === 112) {
      if (mods.shift) {
        keyShorthand = '<SHIFT>+<F1>';
      }
      else {
        keyShorthand = '<F1>';
      }
    }

    // • `<F2>`
    else if (e.which === 113) {
      if (mods.shift) {
        keyShorthand = '<SHIFT>+<F2>';
      }
      else {
        keyShorthand = '<F2>';
      }
    }

    // • `<F3>`
    else if (e.which === 114) {
      if (mods.shift) {
        keyShorthand = '<SHIFT>+<F3>';
      }
      else {
        keyShorthand = '<F3>';
      }
    }

    // • `<F4>`
    else if (e.which === 115) {
      if (mods.shift) {
        keyShorthand = '<SHIFT>+<F4>';
      }
      else {
        keyShorthand = '<F4>';
      }
    }

    // • `<F5>`
    else if (e.which === 116) {
      if (mods.shift) {
        keyShorthand = '<SHIFT>+<F5>';
      }
      else {
        keyShorthand = '<F5>';
      }
    }

    // • `<F6>`
    else if (e.which === 117) {
      if (mods.shift) {
        keyShorthand = '<SHIFT>+<F6>';
      }
      else {
        keyShorthand = '<F6>';
      }
    }

    // • `}`
    else if (e.which === 221 && mods.shift) {
      keyShorthand = '}';
    }

    // • `{`
    else if (e.which === 219 && mods.shift) {
      keyShorthand = '{';
    }

    // • `)`
    else if (e.which === 48 && mods.shift) {
      keyShorthand = ')';
    }

    // • `(`
    else if (e.which === 57 && mods.shift) {
      keyShorthand = '(';
    }

    // • `,`
    else if (e.which === 188 && !mods.shift) {
      // • `<CMD>+,`
      if (mods.cmd) {
        keyShorthand = '<CMD>+,';
      }
      // • `,`
      else {
        keyShorthand = ',';
      }
    }

    // • `"`
    else if (e.which === 222 && mods.shift) {
      keyShorthand = '"';
    }
    // • `'`
    else if (e.which === 222 && !mods.shift) {
      keyShorthand = '\'';
    }
    // • ```
    else if (e.which === 192 && !mods.shift) {
      keyShorthand = '`';
    }
    // • `~`
    else if (e.which === 192 && mods.shift) {
      keyShorthand = '~';
    }
    // • `&`
    else if (e.which === 55 && mods.shift) {
      keyShorthand = '&';
    }
    // • `<`
    else if (e.which === 188 && mods.shift) {
      keyShorthand = '<';
    }
    // • `>`
    else if (e.which === 190 && mods.shift) {
      keyShorthand = '>';
    }
    // • `\`
    else if (e.which === 220 && !mods.shift) {
      // • `<CMD>+\\`
      if (mods.cmd) {
        keyShorthand = '<CMD>+\\';
      }
      else {
        keyShorthand = '\\';
      }
    }
    // • `|`
    else if (e.which === 220 && mods.shift) {
      keyShorthand = '|';
    }
    // • `]`
    else if (e.which === 221 && !mods.shift) {
      keyShorthand = ']';
    }
    // • `[`
    else if (e.which === 219 && !mods.shift) {
      keyShorthand = '[';
    }


    // • `<LEFT_ARROW>`
    else if (e.which === 37) {
      // • `<CMD>+<LEFT_ARROW>`
      if (mods.cmd) {
        keyShorthand = '<CMD>+<LEFT_ARROW>';
      }
      // • `<SHIFT>+<ALT>+<LEFT_ARROW>`
      else if(mods.alt && mods.shift) {
        keyShorthand = '<SHIFT>+<ALT>+<LEFT_ARROW>';
      }
      else {
        keyShorthand = '<LEFT_ARROW>';
      }
    }

    // • `<UP_ARROW>`
    else if (e.which === 38) {
      // • `<SHIFT>+<CMD>+<UP_ARROW>`
      if (mods.shift && (mods.cmd)) {
        keyShorthand = '<SHIFT>+<CMD>+<UP_ARROW>';
      }
       // • `<SHIFT>+<ALT>+<UP_ARROW>`
      else if(mods.shift && mods.alt) {
        keyShorthand = '<SHIFT>+<ALT>+<UP_ARROW>';
      }
      // • `<SHIFT>+<UP_ARROW>`
      else if(mods.shift) {
        keyShorthand = '<SHIFT>+<UP_ARROW>';
      }
      // • `<CMD>+<UP_ARROW>`
      else if (mods.cmd) {
        keyShorthand = '<CMD>+<UP_ARROW>';
      }
      // • `<ALT>+<UP_ARROW>`
      else if (mods.alt) {
        keyShorthand = '<ALT>+<UP_ARROW>';
      }
      // • `<UP_ARROW>` (normal)
      else {
        keyShorthand = '<UP_ARROW>';
      }
    }

    // • `<RIGHT_ARROW>`
    else if (e.which === 39) {
      // • `<CMD>+<RIGHT_ARROW>`
      if (mods.cmd) {
        keyShorthand = '<CMD>+<RIGHT_ARROW>';
      }
       // • `<SHIFT>+<ALT>+<RIGHT_ARROW>`
      else if(mods.alt && mods.shift) {
        keyShorthand = '<SHIFT>+<ALT>+<RIGHT_ARROW>';
      }
      else {
        keyShorthand = '<RIGHT_ARROW>';
      }
    }

    // • `<DOWN_ARROW>`
    else if (e.which === 40) {

      // • `<SHIFT>+<CMD>+<DOWN_ARROW>`
      if (mods.shift && (mods.cmd)) {
        keyShorthand = '<SHIFT>+<CMD>+<DOWN_ARROW>';
      }
       // • `<SHIFT>+<ALT>+<DOWN_ARROW>`
      else if(mods.shift && mods.alt) {
        keyShorthand = '<SHIFT>+<ALT>+<DOWN_ARROW>';
      }
      // • `<SHIFT>+<DOWN_ARROW>`
      else if(mods.shift) {
        keyShorthand = '<SHIFT>+<DOWN_ARROW>';
      }
      // • `<CMD>+<DOWN_ARROW>`
      else if (mods.cmd) {
        keyShorthand = '<CMD>+<DOWN_ARROW>';
      }
      // • `<ALT>+<DOWN_ARROW>`
      else if (mods.alt) {
        keyShorthand = '<ALT>+<DOWN_ARROW>';
      }
      // • `<DOWN_ARROW>` (normal)
      else {
        keyShorthand = '<DOWN_ARROW>';
      }
    }

    // • `<ESC>`
    else if (e.which === 27) {
      keyShorthand = '<ESC>';
    }

    // Everything else:
    ////////////////////////////////////////////////////////////////////////
    else {
      // Determine the character that was typed alongside the special key (i.e. CTRL/CMD)
      // (note that if this is a letter, it should always be referenced as upper-case in the
      //  handler, regardless of whether the shift key is pressed)
      var characterThatWasTyped = String.fromCharCode(e.which);

      var _SHIFT = mods.shift;
      var _CTRL = mods.ctrl;
      var _MAC_OS_CTRL = mods.macOSCtrl;
      var _CMD = mods.cmd;
      var _ALT = mods.alt;

      // Special combinations of modifier keys:
      //
      // • `<SHIFT>+<CTRL>+<CMD>+<ALT>+*`
      // • `<SHIFT>+<CTRL>+<CMD>+*`
      // • `<SHIFT>+<CTRL>+<ALT>+*`
      // • `<SHIFT>+<CMD>+<ALT>+*`
      // • `<CTRL>+<CMD>+<ALT>+*`
      // • `<SHIFT>+<CTRL>+*`
      // • `<SHIFT>+<CMD>+*`
      // • `<CTRL>+<CMD>+*`
      // • `<SHIFT>+<ALT>+*`
      // • `<CTRL>+<ALT>+*`
      // • `<CMD>+<ALT>+*`
      //
      // > Note that `<MAC_OS_CTRL>` can also be used in place of `<CTRL>`.
      if (_SHIFT && _CTRL && _CMD && _ALT) { keyShorthand = '<SHIFT>+<CTRL>+<CMD>+<ALT>+'+characterThatWasTyped; }
      if (_SHIFT && _MAC_OS_CTRL && _CMD && _ALT) { keyShorthand = '<SHIFT>+<MAC_OS_CTRL>+<CMD>+<ALT>+'+characterThatWasTyped; }
      else if (_SHIFT && _CTRL && _CMD) { keyShorthand = '<SHIFT>+<CTRL>+<CMD>+'+characterThatWasTyped; }
      else if (_SHIFT && _MAC_OS_CTRL && _CMD) { keyShorthand = '<SHIFT>+<MAC_OS_CTRL>+<CMD>+'+characterThatWasTyped; }
      else if (_SHIFT && _CTRL && _ALT) { keyShorthand = '<SHIFT>+<CTRL>+<ALT>+'+characterThatWasTyped; }
      else if (_SHIFT && _MAC_OS_CTRL && _ALT) { keyShorthand = '<SHIFT>+<MAC_OS_CTRL>+<ALT>+'+characterThatWasTyped; }
      else if (_SHIFT && _CMD && _ALT) { keyShorthand = '<SHIFT>+<CMD>+<ALT>+'+characterThatWasTyped; }
      else if (_CTRL && _CMD && _ALT) { keyShorthand = '<CTRL>+<CMD>+<ALT>+'+characterThatWasTyped; }
      else if (_MAC_OS_CTRL && _CMD && _ALT) { keyShorthand = '<MAC_OS_CTRL>+<CMD>+<ALT>+'+characterThatWasTyped; }
      else if (_SHIFT && _CTRL) { keyShorthand = '<SHIFT>+<CTRL>+'+characterThatWasTyped; }
      else if (_SHIFT && _MAC_OS_CTRL) { keyShorthand = '<SHIFT>+<MAC_OS_CTRL>+'+characterThatWasTyped; }
      else if (_SHIFT && _CMD) { keyShorthand = '<SHIFT>+<CMD>+'+characterThatWasTyped; }
      else if (_CTRL && _CMD) { keyShorthand = '<CTRL>+<CMD>+'+characterThatWasTyped; }
      else if (_MAC_OS_CTRL && _CMD) { keyShorthand = '<MAC_OS_CTRL>+<CMD>+'+characterThatWasTyped; }
      else if (_SHIFT && _ALT) { keyShorthand = '<SHIFT>+<ALT>+'+characterThatWasTyped; }
      else if (_CTRL && _ALT) { keyShorthand = '<CTRL>+<ALT>+'+characterThatWasTyped; }
      else if (_MAC_OS_CTRL && _ALT) { keyShorthand = '<MAC_OS_CTRL>+<ALT>+'+characterThatWasTyped; }
      else if (_CMD && _ALT) { keyShorthand = '<CMD>+<ALT>+'+characterThatWasTyped; }

      // Single modifier keys:
      // • `<CTRL>+*`
      else if (_CTRL) { keyShorthand = '<CTRL>+'+characterThatWasTyped; }
      // • `<MAC_OS_CTRL>+*`
      else if (_MAC_OS_CTRL) { keyShorthand = '<MAC_OS_CTRL>+'+characterThatWasTyped; }
      // • `<CMD>+*`
      else if (_CMD) { keyShorthand = '<CMD>+'+characterThatWasTyped; }
      // • `<ALT>+*`
      else if (_ALT) { keyShorthand = '<ALT>+'+characterThatWasTyped; }

      // No modifier keys:
      // • `*`
      else if (characterThatWasTyped) {
        keyShorthand = characterThatWasTyped;
      }
    }

    // If we made it here, and none of our handlers have matched this keydown yet...
    if (!handlers[keyShorthand]) {
      // Then use the "default" handler, if one was provided.
      if (handlers['default']) {
        if (_.isString(handlers['default'])) {
          throw new Error('Consistency violation: Dont do that!  Come on!  You cant forward from the default handler in NKE.');
        }
        // After setting this, we continue on below beyond the dotted line.
        keyShorthand = 'default';
      }
      // But otherwise, if there is no default handler, bail.
      // (we're done.  We'll do a whole lot of nothing.)
      else {
        return;
      }
    }

    // At this point, if we made it here, we know there is now a handler function.
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Get the handler fn.
    var fn = handlers[keyShorthand];

    // If the handler is a string and not a function (i.e. it's forwarding
    // to another handler), look up that string in the handlers dictionary.
    // This allows us to specify e.g. '<ENTER>': '<ALT>+<DOWN_ARROW>' to
    // mean "when enter is pressed, use the same handler as alt+down arrow"
    //
    // Limit this to 2 lookups to avoid infinite loops and other nasty business.
    var depth = 0;
    while (_.isString(fn) && depth < 2) {
      fn = handlers[fn];
      depth++;
    }
    // If we still have a string after 2 lookups, give up loudly.
    if (_.isString(fn)) {
      throw new Error('Consistency violation: Too many forwards in negotiateKeyboardEvent!');
    }
    if (!_.isFunction(fn)) {
      throw new Error('Consistency violation: Trying to forward to non-existent handler.');
    }

    // Call the handler function we found
    fn(e, keyShorthand);

  };

}]);

