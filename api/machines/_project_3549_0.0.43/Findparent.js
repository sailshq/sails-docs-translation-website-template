module.exports = {
  "inputs": {
    "menuData": {
      "id": "d6d19827-81cc-4c8c-8bf7-15ddca7b472e",
      "friendlyName": "menu data",
      "description": "",
      "example": [],
      "required": true,
      "addedManually": true
    },
    "path": {
      "id": "b9837262-b6cd-4cd1-b315-9223ad74b185",
      "friendlyName": "path",
      "description": "The current doc page's file path",
      "example": "idk/something.ejs",
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
      "example": [
        "idk/something"
      ]
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var _ = require('lodash');

    var expandedMenuItems = [];

    expandedMenuItems.push(inputs.path);

    var currentPage = _.find(inputs.menuData, {
      path: inputs.path
    });
    if (currentPage && currentPage.isChild) {
      expandParent(currentPage.parent);
    }

    function expandParent(parentPath) {
      // Find the parent by its path
      var currentParent = _.find(inputs.menuData, {
        path: parentPath
      });

      // Add the parent's path to the array of expanded things.
      expandedMenuItems.push(currentParent.path);

      // If this parent also has a parent, call the function again.
      if (currentParent && currentParent.isChild) {
        expandParent(currentParent.parent);
      }
    }


    return exits.success(expandedMenuItems);
  },
  "identity": "Findparent"
};