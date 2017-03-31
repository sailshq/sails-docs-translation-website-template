var Machine = require("machine");
module.exports = {
  'find': function(req, res) {
    Machine.build({
      inputs: {},
      exits: {
        respond: {}
      },
      fn: function(inputs, exits) {
        // Pick random item
        sails.machines['c646f5e7-9c6f-49a5-91f6-7e1eabfd1186_5.2.0'].sample({
          "array": ["a giant squid", "clownfish", "starfish", "sea anemones", "merpeople", "mermen", "sea bass", "seahorses", "cuttlefish", "jellyfish"]
        }).exec({
          "error": function(pickRandomItem) {
            return exits.error({
              data: pickRandomItem,
              status: 500
            });
          },
          "emptyArray": function(pickRandomItem) {
            return exits.respond({
              action: "respond_with_status",
              status: 200
            });
          },
          "success": function(pickRandomItem) {
            return exits.respond({
              data: {
                data: {
                  nauticalAuthor: pickRandomItem
                },
                currentPage: 'home',
                description: "Sails.js makes it easy to build custom, enterprise-grade Node.js apps. It is designed to resemble the MVC architecture from frameworks like Ruby on Rails, but with support for the more modern, data-oriented style of web app development. It's especially good for building realtime features like chat."
              },
              action: "display_view",
              status: 200,
              view: "homepage"
            });
          }
        });
      }
    }).configure(req.params.all(), {
      respond: res.response,
      error: res.negotiate
    }).exec();
  }
};
