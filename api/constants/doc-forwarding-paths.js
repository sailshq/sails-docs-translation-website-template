/**
 *
 * doc-forwarding-paths
 *
 * The master list of the forwarding paths for old documentation pages that were relocated.
 *
 * (Note that these are just doc page slugs, as in the path without the leading '/documentation/'.)
 */
module.exports = {
  //  ╦═╗╔═╗╔═╗╔═╗╦═╗╔═╗╔╗╔╔═╗╔═╗
  //  ╠╦╝║╣ ╠╣ ║╣ ╠╦╝║╣ ║║║║  ║╣
  //  ╩╚═╚═╝╚  ╚═╝╩╚═╚═╝╝╚╝╚═╝╚═╝
  //
  // Reference > Configuration
  'reference/configuration/sails-config-cors': 'reference/configuration/sails-config-security',
  'reference/configuration/sails-config-security-cors': 'reference/configuration/sails-config-security',
  'reference/configuration/sails-config-csrf': 'reference/configuration/sails-config-security',
  'reference/configuration/sails-config-security-csrf': 'reference/configuration/sails-config-security',

  // Reference > Web Sockets
  'reference/web-sockets/resourceful-pub-sub/message': 'upgrading/to-v-1-0',
  'reference/web-sockets/resourceful-pub-sub/publish-add': 'upgrading/to-v-1-0',
  'reference/web-sockets/resourceful-pub-sub/publish-create': 'upgrading/to-v-1-0',
  'reference/web-sockets/resourceful-pub-sub/publish-remove': 'upgrading/to-v-1-0',
  'reference/web-sockets/resourceful-pub-sub/publish-destroy': 'upgrading/to-v-1-0',
  'reference/web-sockets/resourceful-pub-sub/publish-update': 'upgrading/to-v-1-0',
  'reference/web-sockets/resourceful-pub-sub/watch': 'upgrading/to-v-1-0',
  'reference/web-sockets/resourceful-pub-sub/unwatch': 'upgrading/to-v-1-0',

  //  ╔═╗╔═╗╔╗╔╔═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║  ║ ║║║║║  ║╣ ╠═╝ ║ ╚═╗
  //  ╚═╝╚═╝╝╚╝╚═╝╚═╝╩   ╩ ╚═╝
  //
  //  Concepts > Upgrading
  'concepts/upgrading': 'upgrading/to-v-1-0',
  'concepts/upgrading/to-v-0-10' : '/upgrading/to-v-0-10',
  'concepts/upgrading/to-v-0-11' : '/upgrading/to-v-0-11',
  'concepts/upgrading/to-v-0-12' : '/upgrading/to-v-0-12',


  //  ╔═╗╔╗╔╔═╗╔╦╗╔═╗╔╦╗╦ ╦
  //  ╠═╣║║║╠═╣ ║ ║ ║║║║╚╦╝
  //  ╩ ╩╝╚╝╩ ╩ ╩ ╚═╝╩ ╩ ╩
  'anatomy/api/policies/session-auth-js': 'anatomy/api/policies/is-logged-in-js',
  'anatomy/assets/js/dependencies': 'anatomy/assets/dependencies',
  'anatomy/assets/js/dependencies/sails-io-js': 'anatomy/assets/dependencies/sails-io-js',
};
