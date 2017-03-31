module.exports = {
  "inputs": {
    "varName": {
      "friendlyName": "variable name",
      "description": "The name of the environment variable whose value this machine will return.",
      "example": "NODE_ENV",
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
      "example": "some string"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    return exits.success(process.env[inputs.varName]);
  },
  "identity": "get-environment-variable"
};