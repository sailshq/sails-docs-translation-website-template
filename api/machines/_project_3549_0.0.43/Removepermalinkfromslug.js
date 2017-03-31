module.exports = {
  "inputs": {
    "slug": {
      "id": "7f69cedb-9cb6-43d4-90e1-47edde024921",
      "friendlyName": "slug",
      "description": "",
      "example": "idk/idk?q=idk",
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
      "example": "idk/idk"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    inputs.slug = inputs.slug.replace(/\?q=.+$/, '');

    return exits.success(inputs.slug);
  },
  "identity": "Removepermalinkfromslug"
};