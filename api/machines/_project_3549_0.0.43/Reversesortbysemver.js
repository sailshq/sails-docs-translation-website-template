module.exports = {
  "inputs": {
    "array": {
      "id": "e0c3ac0a-efbc-4a89-a861-a6b326e9fab2",
      "friendlyName": "array",
      "description": "An array of semver versions",
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
      "example": [{}]
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var semver = require('semver');

    inputs.array = inputs.array.sort(function(a, b) {
      var comparison = semver.rcompare(a.version, b.version);
      return comparison;
    });


    return exits.success(inputs.array);
  },
  "identity": "Reversesortbysemver"
};