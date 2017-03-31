var Machine = require("machine");
  module.exports = {
    '*': function(req, res) {
      Machine.build({
        inputs: {
          "*": {
            "example": "abc123",
            "required": true
          },
          "q": {
            "example": "task-configuration"
          }
        },
        exits: {
          respond: {},
          redirectToNewLocation: {
            description: 'Specified page has been moved.',
            example: '/documentation/reference/web-sockets/sails-sockets/get-id'
          }
        },
      fn: function(inputs, exits) {

        // If this is not 0.11.sailsjs.org, then automatically redirect links which are now broken:
        //////////////////////////////////////////////////////////////////////////////////////////
        if ( process.env.sails_branch !== '0.11' ) {
          switch ( inputs['*'].toLowerCase() ) {
            case 'reference/web-sockets/sails-sockets/sails-sockets-blast':
              return exits.redirectToNewLocation('/documentation/reference/web-sockets/sails-sockets/blast');
            case 'reference/web-sockets/sails-sockets/sails-sockets-broadcast':
              return exits.redirectToNewLocation('/documentation/reference/web-sockets/sails-sockets/broadcast');
            case 'reference/web-sockets/sails-sockets/sails-sockets-id':
              return exits.redirectToNewLocation('/documentation/reference/web-sockets/sails-sockets/get-id');
            case 'reference/web-sockets/sails-sockets/sails-sockets-join':
              return exits.redirectToNewLocation('/documentation/reference/web-sockets/sails-sockets/join');
            case 'reference/web-sockets/sails-sockets/sails-sockets-leave':
              return exits.redirectToNewLocation('/documentation/reference/web-sockets/sails-sockets/leave');
          }
        }
        //////////////////////////////////////////////////////////////////////////////////////////

        // Split using regexp
        sails.machines['03558d7e-53ad-4e20-b03f-ddd54c34ce3c_4.2.0'].split({
          "string": inputs['*'],
          "regexp": "/"
        }).exec({
          "error": function(splitUsingRegexp) {
            return exits.error({
              data: splitUsingRegexp,
              status: "505"
            });
          },
          "invalidRegexp": function(splitUsingRegexp) {
            return exits.error({
              data: splitUsingRegexp,
              status: "504"
            });
          },
          "success": function(splitUsingRegexp) {
            // Get [n]th item
            sails.machines['c646f5e7-9c6f-49a5-91f6-7e1eabfd1186_5.2.0'].nth({
              "array": splitUsingRegexp,
              "index": 0
            }).exec({
              "error": function(getNThItem) {
                return exits.error({
                  data: getNThItem,
                  status: 500
                });
              },
              "notFound": function(getNThItem) {
                return exits.error({
                  data: getNThItem,
                  status: 500
                });
              },
              "success": function(getNThItem) {
                // Lowercase a string
                sails.machines['03558d7e-53ad-4e20-b03f-ddd54c34ce3c_4.2.0'].lowerCase({
                  "string": getNThItem
                }).exec({
                  "error": function(lowercaseAString) {
                    return exits.error({
                      data: lowercaseAString,
                      status: 500
                    });
                  },
                  "success": function(lowercaseAString) {
                    // Resolve path
                    sails.machines['2806adc7-0289-473a-8843-020526771565_1.2.0'].resolve({
                      "paths": ["views/partials/doc-menus/" + lowercaseAString + ".jsmenu"]
                    }).exec({
                      "error": function(resolvePath) {
                        return exits.error({
                          data: resolvePath,
                          status: "502"
                        });
                      },
                      "success": function(resolvePath) {
                        // Read JSON file
                        sails.machines['8f8944e3-49b6-429d-a4c5-c77fe3ae878d_5.3.0'].readJson({
                          "source": resolvePath,
                          "schema": [{
                            templateTitle: "Foo-Bar.ejs",
                            fullPathAndFileName: "creating-a-machinepack/Getting-Started.ejs",
                            data: {},
                            children: ["some/pat"],
                            isChild: true,
                            isParent: true,
                            parent: "creating-a-machinepack"
                          }]
                        }).exec({
                          "error": function(readJSONFile) {
                            return exits.error({
                              data: readJSONFile,
                              status: "501"
                            });
                          },
                          "doesNotExist": function(readJSONFile) {
                            return exits.respond({
                              data: "/documentation/concepts",
                              action: "redirect",
                              status: 301
                            });
                          },
                          "couldNotParse": function(readJSONFile) {
                            return exits.error({
                              data: readJSONFile,
                              status: 500
                            });
                          },
                          "success": function(readJSONFile) {
                            // Marshal menu metadata
                            sails.machines['_project_3549_0.0.43'].MarshaldocPageMetadata({
                              "docPageMetadatas": readJSONFile
                            }).exec({
                              "error": function(marshalMenuMetadata) {
                                return exits.error({
                                  data: marshalMenuMetadata,
                                  status: 500
                                });
                              },
                              "success": function(marshalMenuMetadata) {
                                // Is it an old link?
                                sails.machines['_project_3549_0.0.43'].isItAnOldLink({
                                  "docPageMetadatas": marshalMenuMetadata,
                                  "slug": inputs['*'],
                                  "q": inputs.q
                                }).setEnvironment({
                                  req: req,
                                  res: res,
                                  sails: sails
                                }).exec({
                                  "error": function(isItAnOldLink) {
                                    return exits.error({
                                      data: isItAnOldLink,
                                      status: "499"
                                    });
                                  },
                                  "success": function(isItAnOldLink) {
                                    // Find doc template to show
                                    sails.machines['_project_3549_0.0.43'].Fniddocpagetoshow({
                                      "docPageMetadatas": marshalMenuMetadata,
                                      "slug": inputs['*']
                                    }).setEnvironment({
                                      req: req,
                                      res: res,
                                      sails: sails
                                    }).exec({
                                      "error": function(findDocTemplateToShow) {
                                        return exits.respond({
                                          data: "Unexpected error locating documentation page.  Please file an issue at github.com/balderdashy/sails-docs.  Thanks!",
                                          action: "respond_with_value_and_status",
                                          status: 500
                                        });
                                      },
                                      "success": function(findDocTemplateToShow) {
                                        // List expanded menu items
                                        sails.machines['_project_3549_0.0.43'].Findparent({
                                          "menuData": marshalMenuMetadata,
                                          "path": (findDocTemplateToShow && findDocTemplateToShow.path)
                                        }).setEnvironment({
                                          req: req,
                                          res: res,
                                          sails: sails
                                        }).exec({
                                          "error": function(listExpandedMenuItems) {
                                            return exits.error({
                                              data: listExpandedMenuItems,
                                              status: 500
                                            });
                                          },
                                          "success": function(listExpandedMenuItems) {
                                            // Construct dictionary
                                            sails.machines['1ce3619d-97b1-4aec-a3e9-884c7ed24556_2.2.0'].construct({
                                              "dictionary": {
                                                templateList: marshalMenuMetadata,
                                                currentTemplate: findDocTemplateToShow,
                                                section: getNThItem,
                                                expandedItems: listExpandedMenuItems
                                              }
                                            }).exec({
                                              "error": function(constructDictionary) {
                                                return exits.error({
                                                  data: constructDictionary,
                                                  status: 500
                                                });
                                              },
                                              "success": function(constructDictionary) {
                                                // If it's an 'Anatomy' page
                                                sails.machines['4bf9c923-efd3-4077-b3e1-6b8d84d740c0_1.2.0'].ifEqual({
                                                  "a": lowercaseAString,
                                                  "b": "anatomy"
                                                }).exec({
                                                  "error": function(ifItSAnAnatomyPage) {
                                                    return exits.error({
                                                      data: ifItSAnAnatomyPage,
                                                      status: 500
                                                    });
                                                  },
                                                  "otherwise": function(ifItSAnAnatomyPage) {
                                                    // Capitalize a string
                                                    sails.machines['03558d7e-53ad-4e20-b03f-ddd54c34ce3c_4.2.0'].capitalize({
                                                      "string": getNThItem
                                                    }).exec({
                                                      "error": function(capitalizeAString) {
                                                        return exits.error({
                                                          data: capitalizeAString,
                                                          status: 500
                                                        });
                                                      },
                                                      "success": function(capitalizeAString) {
                                                        return exits.respond({
                                                          data: {
                                                            currentPage: 'documentation',
                                                            currentDocSection: lowercaseAString,
                                                            sectionTitle: capitalizeAString,
                                                            data: constructDictionary,
                                                            title: (constructDictionary && constructDictionary.currentTemplate.displayName) + " | Sails.js Documentation"
                                                          },
                                                          action: "display_view",
                                                          status: 200,
                                                          view: "reference-or-concepts"
                                                        });
                                                      }
                                                    });
                                                  },
                                                  "success": function(ifItSAnAnatomyPage) {
                                                    return exits.respond({
                                                      data: {
                                                        currentPage: 'documentation',
                                                        currentDocSection: 'anatomy',
                                                        sectionTitle: "Anatomy of a Sails App",
                                                        data: constructDictionary,
                                                        title: "Anatomy of a Sails App | Sails.js Documentation",
                                                        description: "An interactive tutorial of a Sails.js app's structure. Explore the files and folders that are generated when you create a new Sails app, and learn the purpose and usage of each one."
                                                      },
                                                      action: "display_view",
                                                      status: 200,
                                                      view: "anatomy"
                                                    });
                                                  }
                                                });
                                              }
                                            });
                                          }
                                        });
                                      },
                                      "notFound": function(findDocTemplateToShow) {
                                        // If equal (===) to anatomy
                                        sails.machines['4bf9c923-efd3-4077-b3e1-6b8d84d740c0_1.2.0'].ifEqual({
                                          "a": getNThItem,
                                          "b": "anatomy"
                                        }).exec({
                                          "error": function(ifEqualToAnatomy) {
                                            return exits.error({
                                              data: ifEqualToAnatomy,
                                              status: 500
                                            });
                                          },
                                          "otherwise": function(ifEqualToAnatomy) {
                                            // If equal (===) to reference
                                            sails.machines['4bf9c923-efd3-4077-b3e1-6b8d84d740c0_1.2.0'].ifEqual({
                                              "a": getNThItem,
                                              "b": "reference"
                                            }).exec({
                                              "error": function(ifEqualToReference) {
                                                return exits.error({
                                                  data: ifEqualToReference,
                                                  status: 500
                                                });
                                              },
                                              "otherwise": function(ifEqualToReference) {
                                                // If equal (===) to upgrading
                                                sails.machines['4bf9c923-efd3-4077-b3e1-6b8d84d740c0_1.2.0'].ifEqual({
                                                  "a": getNThItem,
                                                  "b": "upgrading"
                                                }).exec({
                                                  "error": function(ifEqualToUpgrading) {
                                                    return exits.error({
                                                      data: ifEqualToUpgrading,
                                                      status: 500
                                                    });
                                                  },
                                                  "otherwise": function(ifEqualToUpgrading) {
                                                    // If equal (===) to contributing
                                                    sails.machines['4bf9c923-efd3-4077-b3e1-6b8d84d740c0_1.2.0'].ifEqual({
                                                      "a": getNThItem,
                                                      "b": "contributing"
                                                    }).exec({
                                                      "error": function(ifEqualToContributing) {
                                                        return exits.error({
                                                          data: ifEqualToContributing,
                                                          status: 500
                                                        });
                                                      },
                                                      "otherwise": function(ifEqualToContributing) {
                                                        // If equal (===) to contributing
                                                        sails.machines['4bf9c923-efd3-4077-b3e1-6b8d84d740c0_1.2.0'].ifEqual({
                                                          "a": getNThItem,
                                                          "b": "tutorials"
                                                        }).exec({
                                                          "error": function(ifEqualToTutorials) {
                                                            return exits.error({
                                                              data: ifEqualToTutorials,
                                                              status: 500
                                                            });
                                                          },
                                                          "otherwise": function(ifEqualToTutorials) {
                                                            return exits.respond({
                                                              data: "/documentation/concepts",
                                                              action: "redirect",
                                                              status: 301
                                                            });
                                                          },
                                                          "success": function(ifEqualToTutorials) {
                                                            return exits.respond({
                                                              data: "/documentation/tutorials",
                                                              action: "redirect",
                                                              status: 301
                                                            });
                                                          }
                                                        });
                                                      },
                                                      "success": function(ifEqualToContributing) {
                                                        return exits.respond({
                                                          data: "/documentation/contributing",
                                                          action: "redirect",
                                                          status: 301
                                                        });
                                                      }
                                                    });
                                                  },
                                                  "success": function(ifEqualToUpgrading) {
                                                    return exits.respond({
                                                      data: "/documentation/upgrading",
                                                      action: "redirect",
                                                      status: 301
                                                    });
                                                  }
                                                });
                                              },
                                              "success": function(ifEqualToReference) {
                                                return exits.respond({
                                                  data: "/documentation/reference",
                                                  action: "redirect",
                                                  status: 301
                                                });
                                              }
                                            });
                                          },
                                          "success": function(ifEqualToAnatomy) {
                                            return exits.respond({
                                              data: "/documentation/anatomy",
                                              action: "redirect",
                                              status: 301
                                            });
                                          }
                                        });
                                      },
                                      "notExactMatch": function(findDocTemplateToShow) {
                                        return exits.respond({
                                          data: "/documentation/" + findDocTemplateToShow,
                                          action: "redirect",
                                          status: 301
                                        });
                                      }
                                    });
                                  },
                                  "oldLink": function(isItAnOldLink) {
                                    return exits.respond({
                                      data: "/documentation/" + isItAnOldLink,
                                      action: "redirect",
                                      status: 301
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }).configure(sails.util.extend(req.params.all(), {
      '*': req.param('0')
    }), {
      respond: res.response,
      redirectToNewLocation: function (url){
        return res.redirect(url);
      },
      error: res.negotiate
    }).exec();
  },
  'find': function(req, res) {
    Machine.build({
      inputs: {},
      exits: {
        respond: {}
      },
      fn: function(inputs, exits) {
        return exits.respond({
          action: "redirect",
          status: 200,
          data: "/documentation/reference"
        });
      }
    }).configure(req.params.all(), {
      respond: res.response,
      error: res.negotiate
    }).exec();
  }
};
