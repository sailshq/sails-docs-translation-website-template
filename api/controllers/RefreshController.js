var Machine = require("machine");
module.exports = {
  'find': function(req, res) {
    Machine.build({
      inputs: {},
      exits: {
        respond: {}
      },
      fn: function(inputs, exits) {
        // Get request header
        sails.machines['642f6a3d-70db-4cbb-ab9b-d93cec84142a_0.3.2'].getRequestHeader({
          "header": "X-Hub-Signature"
        }).setEnvironment({
          req: req
        }).exec({
          "error": function(getRequestHeader) {
            return exits.error({
              data: getRequestHeader,
              status: 500
            });
          },
          "success": function(getRequestHeader) {
            // Get environment variable
            sails.machines['_project_3549_0.0.43'].getEnvironmentVariable({
              "varName": "GITHUB_HOOK_SECRET"
            }).setEnvironment({
              req: req
            }).exec({
              "error": function(getEnvironmentVariable) {
                return exits.error({
                  data: getEnvironmentVariable,
                  status: 500
                });
              },
              "success": function(getEnvironmentVariable) {
                // For convenience during development, also allow the unencrypted token.
                if (process.env.NODE_ENV !== 'production' && getEnvironmentVariable === getRequestHeader) {
                  // ok great!  We'll continue below after the `else`.
                }
                // Otherwise, we have to do all this fancy hmac stuff.
                else {
                  // Compare encrypted GitHub token
                  // see https://github.com/18F/github-webhook-validator/blob/master/index.js#L71
                  var algorithmAndHash = getRequestHeader.split('=');
                  if (algorithmAndHash.length !== 2) {
                    return exits.error({
                      data: new Error('Invalid X-Hub-Signature header from GitHub!'),
                      status: 500
                    });
                  }

                  // Below, we'll simulate the raw request body by re-encoding the JSON-encoded request body.
                  var rawRequestBodyString;
                  try {
                    rawRequestBodyString = JSON.stringify(req.body);
                  }
                  catch (e) {
                    return exits.error({
                        data: new Error('Invalid request from GitHub:'+e.stack),
                        status: 500
                    });
                  }

                  // Now use hmac to validate the x-hub-signature header
                  try {
                    var hmac = require('crypto').createHmac(algorithmAndHash[0], getEnvironmentVariable);
                    var computed = new Buffer(hmac.update(rawRequestBodyString, 'utf8').digest('hex'));
                    var header = new Buffer(algorithmAndHash[1]);
                    var isMatch = require('buffer-equal-constant-time')(computed, header);

                    if (!isMatch) {
                      console.error('DID NOT MATCH! Computed:',computed);
                      console.error('DID NOT MATCH! Header:',header);
                      return exits.respond({
                        data: "You seem to be up to no good!",
                        action: "respond_with_value_and_status",
                        status: "401"
                      });
                    }
                  } catch (err) {
                    console.error('ERROR:',err);
                    return exits.respond({
                      data: "You seem to be up to no good!",
                      action: "respond_with_value_and_status",
                      status: "401"
                    });
                  }
                } //</fancy hmac stuff>


                // Now before continuing on, we'll do one more check:
                // If a valid "ref" is provided in incoming request body, check that it matches
                // our branch.  This is to make sure this update is even relevant for the
                // branch we're compiling from.
                // e.g. { "ref": "refs/heads/0.12" }
                if ( !_.isUndefined(req.body.ref) && _.isString(req.body.ref) ) {

                  var pieces = req.body.ref.split('/');
                  var referencedBranch = pieces[pieces.length-1];

                  // If `ref` is specified, but it doesn't match our branch...
                  if ( referencedBranch !== (process.env.sails_branch||'master') ) {
                    // Then respond with success, but do nothing.
                    return exits.respond({
                      data: 'Looks like that is not relevant for the branch represented by this server.',
                      action: 'respond_with_value_and_status',
                      status: '200'
                    });
                  }
                }

                //   ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗██╗     ███████╗    ██████╗  ██████╗  ██████╗███████╗
                //  ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║██║     ██╔════╝    ██╔══██╗██╔═══██╗██╔════╝██╔════╝
                //  ██║     ██║   ██║██╔████╔██║██████╔╝██║██║     █████╗      ██║  ██║██║   ██║██║     ███████╗
                //  ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║██║     ██╔══╝      ██║  ██║██║   ██║██║     ╚════██║
                //  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ██║███████╗███████╗    ██████╔╝╚██████╔╝╚██████╗███████║
                //   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝    ╚═════╝  ╚═════╝  ╚═════╝╚══════╝
                //

                //  ╦═╗╔═╗╔═╗╔═╗╦═╗╔═╗╔╗╔╔═╗╔═╗
                //  ╠╦╝║╣ ╠╣ ║╣ ╠╦╝║╣ ║║║║  ║╣
                //  ╩╚═╚═╝╚  ╚═╝╩╚═╚═╝╝╚╝╚═╝╚═╝
                sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                  "path": "reference"
                }).setEnvironment({
                  sails: sails
                }).exec({
                  "error": function(compileReferenceDocs) {
                    return exits.error({
                      data: compileReferenceDocs,
                      status: 500
                    });
                  },
                  "success": function(compileReferenceDocs) {
                    //  ╔═╗╔╗╔╔═╗╔╦╗╔═╗╔╦╗╦ ╦
                    //  ╠═╣║║║╠═╣ ║ ║ ║║║║╚╦╝
                    //  ╩ ╩╝╚╝╩ ╩ ╩ ╚═╝╩ ╩ ╩
                    sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                      "path": "anatomy"
                    }).setEnvironment({
                      sails: sails
                    }).exec({
                      "error": function(compileAnatomyDocs) {
                        return exits.error({
                          data: compileAnatomyDocs,
                          status: 500
                        });
                      },
                      "success": function(compileAnatomyDocs) {
                        //  ╔═╗╔═╗╔╗╔╔═╗╔═╗╔═╗╔╦╗╔═╗
                        //  ║  ║ ║║║║║  ║╣ ╠═╝ ║ ╚═╗
                        //  ╚═╝╚═╝╝╚╝╚═╝╚═╝╩   ╩ ╚═╝
                        sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                          "path": "concepts"
                        }).setEnvironment({
                          sails: sails
                        }).exec({
                          "error": function(compileConceptsDocs) {
                            return exits.error({
                              data: compileConceptsDocs,
                              status: 500
                            });
                          },
                          "success": function(compileConceptsDocs) {
                            //  ╔═╗╔═╗╔╗╔╔╦╗╦═╗╦╔╗ ╦ ╦╔╦╗╦╔═╗╔╗╔  ╔═╗╦ ╦╦╔╦╗╔═╗
                            //  ║  ║ ║║║║ ║ ╠╦╝║╠╩╗║ ║ ║ ║║ ║║║║  ║ ╦║ ║║ ║║║╣
                            //  ╚═╝╚═╝╝╚╝ ╩ ╩╚═╩╚═╝╚═╝ ╩ ╩╚═╝╝╚╝  ╚═╝╚═╝╩═╩╝╚═╝
                            sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                              "path": "contributing"
                            }).setEnvironment({
                              sails: sails
                            }).exec({
                              "error": function(compileContributionGuide) {
                                return exits.error({
                                  data: compileContributionGuide,
                                  status: 500
                                });
                              },
                              "success": function(compileContributionGuide) {
                                //  ╔═╗╦ ╦╦╔╦╗╔═╗╔═╗
                                //  ║ ╦║ ║║ ║║║╣ ╚═╗
                                //  ╚═╝╚═╝╩═╩╝╚═╝╚═╝
                                sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                                  "path": "tutorials"
                                }).setEnvironment({
                                  sails: sails
                                }).exec({
                                  "error": function(compileGuides) {
                                    return exits.error({
                                      data: compileGuides,
                                      status: 500
                                    });
                                  },
                                  "success": function(compileGuides) {

                                    //  ╦ ╦╔═╗╔═╗╦═╗╔═╗╔╦╗╦╔╗╔╔═╗
                                    //  ║ ║╠═╝║ ╦╠╦╝╠═╣ ║║║║║║║ ╦
                                    //  ╚═╝╩  ╚═╝╩╚═╩ ╩═╩╝╩╝╚╝╚═╝
                                    sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                                      "path": "upgrading"
                                    }).setEnvironment({
                                      sails: sails
                                    }).exec({
                                      "error": function(compileUpgradingDocs) {
                                        return exits.error({
                                          data: compileUpgradingDocs,
                                          status: 500
                                        });
                                      },
                                      "success": function(compileUpgradingDocs) {
                                        //  ╔═╗╔╗ ╔═╗╦ ╦╔╦╗  ╦╦═╗╔═╗
                                        //  ╠═╣╠╩╗║ ║║ ║ ║   ║╠╦╝║
                                        //  ╩ ╩╚═╝╚═╝╚═╝ ╩   ╩╩╚═╚═╝
                                        sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                                          "path": "irc"
                                        }).setEnvironment({
                                          sails: sails
                                        }).exec({
                                          "error": function(compileAboutIrc) {
                                            return exits.error({
                                              data: compileAboutIrc,
                                              status: 500
                                            });
                                          },
                                          "success": function(compileAboutIrc) {
                                            //  ╔═╗╔═╗╔═╗╦ ╦╦═╗╦╔╦╗╦ ╦  ╔═╗╔═╗╦  ╦╔═╗╦ ╦
                                            //  ╚═╗║╣ ║  ║ ║╠╦╝║ ║ ╚╦╝  ╠═╝║ ║║  ║║  ╚╦╝
                                            //  ╚═╝╚═╝╚═╝╚═╝╩╚═╩ ╩  ╩   ╩  ╚═╝╩═╝╩╚═╝ ╩
                                            sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                                              "path": "security"
                                            }).setEnvironment({
                                              sails: sails
                                            }).exec({
                                              "error": function(compileSecurityDocFiles) {
                                                return exits.error({
                                                  data: compileSecurityDocFiles,
                                                  status: 500
                                                });
                                              },
                                              "success": function(compileSecurityDocFiles) {
                                                //  ╔═╗╔═╗╔═╗
                                                //  ╠╣ ╠═╣║═╬╗
                                                //  ╚  ╩ ╩╚═╝╚
                                                sails.machines['_project_3549_0.0.43'].Compilemarkdowndocs({
                                                  "path": "faq"
                                                }).setEnvironment({
                                                  sails: sails
                                                }).exec({
                                                  "error": function(compileFAQ) {
                                                    return exits.error({
                                                      data: compileFAQ,
                                                      status: 500
                                                    });
                                                  },
                                                  "success": function(compileFAQ) {
                                                    //  ██████╗ ██╗   ██╗██╗██╗     ██████╗     ██████╗  ██████╗  ██████╗
                                                    //  ██╔══██╗██║   ██║██║██║     ██╔══██╗    ██╔══██╗██╔═══██╗██╔════╝
                                                    //  ██████╔╝██║   ██║██║██║     ██║  ██║    ██║  ██║██║   ██║██║
                                                    //  ██╔══██╗██║   ██║██║██║     ██║  ██║    ██║  ██║██║   ██║██║
                                                    //  ██████╔╝╚██████╔╝██║███████╗██████╔╝    ██████╔╝╚██████╔╝╚██████╗
                                                    //  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝     ╚═════╝  ╚═════╝  ╚═════╝
                                                    //
                                                    //  ███╗   ███╗███████╗███╗   ██╗██╗   ██╗    ██████╗  █████╗ ████████╗ █████╗
                                                    //  ████╗ ████║██╔════╝████╗  ██║██║   ██║    ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
                                                    //  ██╔████╔██║█████╗  ██╔██╗ ██║██║   ██║    ██║  ██║███████║   ██║   ███████║
                                                    //  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║   ██║    ██║  ██║██╔══██║   ██║   ██╔══██║
                                                    //  ██║ ╚═╝ ██║███████╗██║ ╚████║╚██████╔╝    ██████╔╝██║  ██║   ██║   ██║  ██║
                                                    //  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
                                                    //
                                                    //  ╔═╗╔╗╔╔═╗╔╦╗╔═╗╔╦╗╦ ╦
                                                    //  ╠═╣║║║╠═╣ ║ ║ ║║║║╚╦╝
                                                    //  ╩ ╩╝╚╝╩ ╩ ╩ ╚═╝╩ ╩ ╩
                                                    // Resolve path
                                                    sails.machines['2806adc7-0289-473a-8843-020526771565_1.2.0'].resolve({
                                                      "paths": ["views/partials/doc-menus/" + "anatomy" + ".jsmenu"]
                                                    }).exec({
                                                      "error": function(resolvePath2) {
                                                        return exits.error({
                                                          data: resolvePath2,
                                                          status: 500
                                                        });
                                                      },
                                                      "success": function(resolvePath2) {
                                                        // Read JSON file
                                                        sails.machines['8f8944e3-49b6-429d-a4c5-c77fe3ae878d_5.3.0'].readJson({
                                                          "source": resolvePath2,
                                                          "schema": [{
                                                            templateTitle: "Foo-Bar.ejs",
                                                            fullPathAndFileName: "idk/foo-bar.ejs",
                                                            data: {
                                                              displayName: "Foo Bar",
                                                              notShownOnWebsite: "true",
                                                              isTableOfContents: "true",
                                                              isOverviewPage: "false",
                                                            },
                                                            children: ["idk/foo-bar/something.ejs"],
                                                            isChild: true,
                                                            isParent: true,
                                                            parent: "idk.ejs"
                                                          }]
                                                        }).exec({
                                                          "error": function(readJSONFile) {
                                                            return exits.error({
                                                              data: readJSONFile,
                                                              status: 500
                                                            });
                                                          },
                                                          "doesNotExist": function(readJSONFile) {
                                                            return exits.error({
                                                              data: readJSONFile,
                                                              status: 500
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
                                                                //  ╔═╗╔═╗╔╗╔╔═╗╔═╗╔═╗╔╦╗╔═╗
                                                                //  ║  ║ ║║║║║  ║╣ ╠═╝ ║ ╚═╗
                                                                //  ╚═╝╚═╝╝╚╝╚═╝╚═╝╩   ╩ ╚═╝
                                                                // Resolve path
                                                                sails.machines['2806adc7-0289-473a-8843-020526771565_1.2.0'].resolve({
                                                                  "paths": ["views/partials/doc-menus/" + "concepts" + ".jsmenu"]
                                                                }).exec({
                                                                  "error": function(resolvePath3) {
                                                                    return exits.error({
                                                                      data: resolvePath3,
                                                                      status: 500
                                                                    });
                                                                  },
                                                                  "success": function(resolvePath3) {
                                                                    // Read JSON file
                                                                    sails.machines['8f8944e3-49b6-429d-a4c5-c77fe3ae878d_5.3.0'].readJson({
                                                                      "source": resolvePath3,
                                                                      "schema": [{
                                                                        templateTitle: "Foo-Bar.ejs",
                                                                        fullPathAndFileName: "idk/foo-bar.ejs",
                                                                        data: {
                                                                          displayName: "Foo Bar",
                                                                          notShownOnWebsite: "true",
                                                                          isTableOfContents: "true",
                                                                          isOverviewPage: "false",
                                                                        },
                                                                        children: ["idk/foo-bar/something.ejs"],
                                                                        isChild: true,
                                                                        isParent: true,
                                                                        parent: "idk.ejs"
                                                                      }]
                                                                    }).exec({
                                                                      "error": function(readJSONFile2) {
                                                                        return exits.error({
                                                                          data: readJSONFile2,
                                                                          status: 500
                                                                        });
                                                                      },
                                                                      "doesNotExist": function(readJSONFile2) {
                                                                        return exits.error({
                                                                            data: readJSONFile2,
                                                                            status: 500
                                                                        });
                                                                      },
                                                                      "couldNotParse": function(readJSONFile2) {
                                                                        return exits.error({
                                                                          data: readJSONFile2,
                                                                          status: 500
                                                                        });
                                                                      },
                                                                      "success": function(readJSONFile2) {
                                                                        // Marshal menu metadata
                                                                        sails.machines['_project_3549_0.0.43'].MarshaldocPageMetadata({
                                                                          "docPageMetadatas": readJSONFile2
                                                                        }).exec({
                                                                          "error": function(marshalMenuMetadata2) {
                                                                            return exits.error({
                                                                              data: marshalMenuMetadata2,
                                                                              status: 500
                                                                            });
                                                                          },
                                                                          "success": function(marshalMenuMetadata2) {
                                                                            // Combine anatomy and concepts arrays
                                                                            sails.machines['c646f5e7-9c6f-49a5-91f6-7e1eabfd1186_5.2.0'].concat({
                                                                              "firstArray": marshalMenuMetadata,
                                                                              "secondArray": marshalMenuMetadata2
                                                                            }).exec({
                                                                              "error": function(combineAnatomyAndConceptsArrays) {
                                                                                return exits.error({
                                                                                  data: combineAnatomyAndConceptsArrays,
                                                                                  status: 500
                                                                                });
                                                                              },
                                                                              "success": function(combineAnatomyAndConceptsArrays) {
                                                                                //  ╦═╗╔═╗╔═╗╔═╗╦═╗╔═╗╔╗╔╔═╗╔═╗
                                                                                //  ╠╦╝║╣ ╠╣ ║╣ ╠╦╝║╣ ║║║║  ║╣
                                                                                //  ╩╚═╚═╝╚  ╚═╝╩╚═╚═╝╝╚╝╚═╝╚═╝
                                                                                // Resolve path
                                                                                sails.machines['2806adc7-0289-473a-8843-020526771565_1.2.0'].resolve({
                                                                                  "paths": ["views/partials/doc-menus/" + "reference" + ".jsmenu"]
                                                                                }).exec({
                                                                                  "error": function(resolvePath4) {
                                                                                    return exits.error({
                                                                                      data: resolvePath4,
                                                                                      status: 500
                                                                                    });
                                                                                  },
                                                                                  "success": function(resolvePath4) {
                                                                                    // Read JSON file
                                                                                    sails.machines['8f8944e3-49b6-429d-a4c5-c77fe3ae878d_5.3.0'].readJson({
                                                                                      "source": resolvePath4,
                                                                                      "schema": [{
                                                                                        templateTitle: "Foo-Bar.ejs",
                                                                                        fullPathAndFileName: "idk/foo-bar.ejs",
                                                                                        data: {
                                                                                          displayName: "Foo Bar",
                                                                                          notShownOnWebsite: "true",
                                                                                          isTableOfContents: "true",
                                                                                          isOverviewPage: "false",
                                                                                        },
                                                                                        children: ["idk/foo-bar/something.ejs"],
                                                                                        isChild: true,
                                                                                        isParent: true,
                                                                                        parent: "idk.ejs"
                                                                                      }]
                                                                                    }).exec({
                                                                                      "error": function(readJSONFile3) {
                                                                                        return exits.error({
                                                                                          data: readJSONFile3,
                                                                                          status: 500
                                                                                        });
                                                                                      },
                                                                                      "doesNotExist": function(readJSONFile3) {
                                                                                        return exits.error({
                                                                                          data: readJSONFile3,
                                                                                          status: 500
                                                                                        });
                                                                                      },
                                                                                      "couldNotParse": function(readJSONFile3) {
                                                                                        return exits.error({
                                                                                          data: readJSONFile3,
                                                                                          status: 500
                                                                                        });
                                                                                      },
                                                                                      "success": function(readJSONFile3) {
                                                                                        // Marshal menu metadata
                                                                                        sails.machines['_project_3549_0.0.43'].MarshaldocPageMetadata({
                                                                                          "docPageMetadatas": readJSONFile3
                                                                                        }).exec({
                                                                                          "error": function(marshalMenuMetadata3) {
                                                                                            return exits.error({
                                                                                              data: marshalMenuMetadata3,
                                                                                              status: 500
                                                                                            });
                                                                                          },
                                                                                          "success": function(marshalMenuMetadata3) {
                                                                                            //  ╔═╗╔═╗╔╗╔╔╦╗╦═╗╦╔╗ ╦ ╦╔╦╗╦╔═╗╔╗╔  ╔═╗╦ ╦╦╔╦╗╔═╗
                                                                                            //  ║  ║ ║║║║ ║ ╠╦╝║╠╩╗║ ║ ║ ║║ ║║║║  ║ ╦║ ║║ ║║║╣
                                                                                            //  ╚═╝╚═╝╝╚╝ ╩ ╩╚═╩╚═╝╚═╝ ╩ ╩╚═╝╝╚╝  ╚═╝╚═╝╩═╩╝╚═╝
                                                                                            // Resolve path
                                                                                            sails.machines['2806adc7-0289-473a-8843-020526771565_1.2.0'].resolve({
                                                                                              "paths": ["views/partials/doc-menus/" + "contributing" + ".jsmenu"]
                                                                                            }).exec({
                                                                                              "error": function(resolvePath5) {
                                                                                                return exits.error({
                                                                                                  data: resolvePath5,
                                                                                                  status: 500
                                                                                                });
                                                                                              },
                                                                                              "success": function(resolvePath5) {
                                                                                                // Read JSON file
                                                                                                sails.machines['8f8944e3-49b6-429d-a4c5-c77fe3ae878d_5.3.0'].readJson({
                                                                                                  "source": resolvePath5,
                                                                                                  "schema": [{
                                                                                                    templateTitle: "Foo-Bar.ejs",
                                                                                                    fullPathAndFileName: "idk/foo-bar.ejs",
                                                                                                    data: {
                                                                                                      displayName: "Foo Bar",
                                                                                                      notShownOnWebsite: "true",
                                                                                                      isTableOfContents: "true",
                                                                                                      isOverviewPage: "false",
                                                                                                    },
                                                                                                    children: ["idk/foo-bar/something.ejs"],
                                                                                                    isChild: true,
                                                                                                    isParent: true,
                                                                                                    parent: "idk.ejs"
                                                                                                  }]
                                                                                                }).exec({
                                                                                                  "error": function(readJSONFile4) {
                                                                                                    return exits.error({
                                                                                                      data: readJSONFile4,
                                                                                                      status: 500
                                                                                                    });
                                                                                                  },
                                                                                                  "doesNotExist": function(readJSONFile4) {
                                                                                                    return exits.error({
                                                                                                      data: readJSONFile4,
                                                                                                      status: 500
                                                                                                    });
                                                                                                  },
                                                                                                  "couldNotParse": function(readJSONFile4) {
                                                                                                    return exits.error({
                                                                                                      data: readJSONFile4,
                                                                                                      status: 500
                                                                                                    });
                                                                                                  },
                                                                                                  "success": function(readJSONFile4) {
                                                                                                    // Marshal menu metadata
                                                                                                    sails.machines['_project_3549_0.0.43'].MarshaldocPageMetadata({
                                                                                                      "docPageMetadatas": readJSONFile4
                                                                                                    }).exec({
                                                                                                      "error": function(marshalMenuMetadata4) {
                                                                                                        return exits.error({
                                                                                                          data: marshalMenuMetadata4,
                                                                                                          status: 500
                                                                                                        });
                                                                                                      },
                                                                                                      "success": function(marshalMenuMetadata4) {
                                                                                                        //  ╦ ╦╔═╗╔═╗╦═╗╔═╗╔╦╗╦╔╗╔╔═╗
                                                                                                        //  ║ ║╠═╝║ ╦╠╦╝╠═╣ ║║║║║║║ ╦
                                                                                                        //  ╚═╝╩  ╚═╝╩╚═╩ ╩═╩╝╩╝╚╝╚═╝
                                                                                                        // Resolve path
                                                                                                        sails.machines['2806adc7-0289-473a-8843-020526771565_1.2.0'].resolve({
                                                                                                          "paths": ["views/partials/doc-menus/" + "upgrading" + ".jsmenu"]
                                                                                                        }).exec({
                                                                                                          "error": function(resolvePath6) {
                                                                                                            return exits.error({
                                                                                                              data: resolvePath6,
                                                                                                              status: 500
                                                                                                            });
                                                                                                          },
                                                                                                          "success": function(resolvePath6) {
                                                                                                            // Read JSON file
                                                                                                            sails.machines['8f8944e3-49b6-429d-a4c5-c77fe3ae878d_5.3.0'].readJson({
                                                                                                              "source": resolvePath6,
                                                                                                              "schema": [{
                                                                                                                templateTitle: "Foo-Bar.ejs",
                                                                                                                fullPathAndFileName: "idk/foo-bar.ejs",
                                                                                                                data: {
                                                                                                                  displayName: "Foo Bar",
                                                                                                                  notShownOnWebsite: "true",
                                                                                                                  isTableOfContents: "true",
                                                                                                                  isOverviewPage: "false",
                                                                                                                },
                                                                                                                children: ["idk/foo-bar/something.ejs"],
                                                                                                                isChild: true,
                                                                                                                isParent: true,
                                                                                                                parent: "idk.ejs"
                                                                                                              }]
                                                                                                            }).exec({
                                                                                                              "error": function(readJSONFile5) {
                                                                                                                return exits.error({
                                                                                                                  data: readJSONFile5,
                                                                                                                  status: 500
                                                                                                                });
                                                                                                              },
                                                                                                              "doesNotExist": function(readJSONFile5) {
                                                                                                                return exits.error({
                                                                                                                  data: readJSONFile5,
                                                                                                                  status: 500
                                                                                                                });
                                                                                                              },
                                                                                                              "couldNotParse": function(readJSONFile5) {
                                                                                                                return exits.error({
                                                                                                                  data: readJSONFile5,
                                                                                                                  status: 500
                                                                                                                });
                                                                                                              },
                                                                                                              "success": function(readJSONFile5) {
                                                                                                                // Marshal menu metadata
                                                                                                                sails.machines['_project_3549_0.0.43'].MarshaldocPageMetadata({
                                                                                                                  "docPageMetadatas": readJSONFile5
                                                                                                                }).exec({
                                                                                                                  "error": function(marshalMenuMetadata5) {
                                                                                                                    return exits.error({
                                                                                                                      data: marshalMenuMetadata5,
                                                                                                                      status: 500
                                                                                                                    });
                                                                                                                  },
                                                                                                                  "success": function(marshalMenuMetadata5) {
                                                                                                                    //  ╔═╗╦ ╦╦╔╦╗╔═╗╔═╗
                                                                                                                    //  ║ ╦║ ║║ ║║║╣ ╚═╗
                                                                                                                    //  ╚═╝╚═╝╩═╩╝╚═╝╚═╝
                                                                                                                    // Resolve path
                                                                                                                    sails.machines['2806adc7-0289-473a-8843-020526771565_1.2.0'].resolve({
                                                                                                                      "paths": ["views/partials/doc-menus/" + "tutorials" + ".jsmenu"]
                                                                                                                    }).exec({
                                                                                                                      "error": function(resolvePath6) {
                                                                                                                        return exits.error({
                                                                                                                          data: resolvePath6,
                                                                                                                          status: 500
                                                                                                                        });
                                                                                                                      },
                                                                                                                      "success": function(resolvePath6) {
                                                                                                                        // Read JSON file
                                                                                                                        sails.machines['8f8944e3-49b6-429d-a4c5-c77fe3ae878d_5.3.0'].readJson({
                                                                                                                          "source": resolvePath6,
                                                                                                                          "schema": [{
                                                                                                                            templateTitle: "Foo-Bar.ejs",
                                                                                                                            fullPathAndFileName: "idk/foo-bar.ejs",
                                                                                                                            data: {
                                                                                                                              displayName: "Foo Bar",
                                                                                                                              notShownOnWebsite: "true",
                                                                                                                              isTableOfContents: "true",
                                                                                                                              isOverviewPage: "false",
                                                                                                                            },
                                                                                                                            children: ["idk/foo-bar/something.ejs"],
                                                                                                                            isChild: true,
                                                                                                                            isParent: true,
                                                                                                                            parent: "idk.ejs"
                                                                                                                          }]
                                                                                                                        }).exec({
                                                                                                                          "error": function(readJSONFile5) {
                                                                                                                            return exits.error({
                                                                                                                              data: readJSONFile5,
                                                                                                                              status: 500
                                                                                                                            });
                                                                                                                          },
                                                                                                                          "doesNotExist": function(readJSONFile5) {
                                                                                                                            return exits.error({
                                                                                                                              data: readJSONFile5,
                                                                                                                              status: 500
                                                                                                                            });
                                                                                                                          },
                                                                                                                          "couldNotParse": function(readJSONFile5) {
                                                                                                                            return exits.error({
                                                                                                                              data: readJSONFile5,
                                                                                                                              status: 500
                                                                                                                            });
                                                                                                                          },
                                                                                                                          "success": function(readJSONFile5) {
                                                                                                                            // Marshal menu metadata
                                                                                                                            sails.machines['_project_3549_0.0.43'].MarshaldocPageMetadata({
                                                                                                                              "docPageMetadatas": readJSONFile5
                                                                                                                            }).exec({
                                                                                                                              "error": function(marshalMenuMetadata6) {
                                                                                                                                return exits.error({
                                                                                                                                  data: marshalMenuMetadata6,
                                                                                                                                  status: 500
                                                                                                                                });
                                                                                                                              },
                                                                                                                              "success": function(marshalMenuMetadata6) {
                                                                                                                                // Combine reference and contributing arrays
                                                                                                                                sails.machines['c646f5e7-9c6f-49a5-91f6-7e1eabfd1186_5.2.0'].concat({
                                                                                                                                  "firstArray": marshalMenuMetadata3,
                                                                                                                                  "secondArray": marshalMenuMetadata4
                                                                                                                                }).exec({
                                                                                                                                  "error": function(combineReferenceAndContributingArrays) {
                                                                                                                                    return exits.error({
                                                                                                                                      data: combineReferenceAndContributingArrays,
                                                                                                                                      status: 500
                                                                                                                                    });
                                                                                                                                  },
                                                                                                                                  "success": function(combineReferenceAndContributingArrays) {

                                                                                                                                    // Combine reference and contributing array with the upgrading array
                                                                                                                                    sails.machines['c646f5e7-9c6f-49a5-91f6-7e1eabfd1186_5.2.0'].concat({
                                                                                                                                      "firstArray": combineReferenceAndContributingArrays,
                                                                                                                                      "secondArray": marshalMenuMetadata5
                                                                                                                                    }).exec({
                                                                                                                                      "error": function(combineReferenceContributingAndUpgradingArrays) {
                                                                                                                                        return exits.error({
                                                                                                                                          data: combineReferenceContributingAndUpgradingArrays,
                                                                                                                                          status: 500
                                                                                                                                        });
                                                                                                                                      },
                                                                                                                                      "success": function(combineReferenceContributingAndUpgradingArrays) {

                                                                                                                                        // Combine the combined arrays
                                                                                                                                        sails.machines['c646f5e7-9c6f-49a5-91f6-7e1eabfd1186_5.2.0'].concat({
                                                                                                                                          "firstArray": combineReferenceContributingAndUpgradingArrays,
                                                                                                                                          "secondArray": marshalMenuMetadata6
                                                                                                                                        }).exec({
                                                                                                                                          "error": function(combineReferenceContributingUpgradingAndGuidesArrays) {
                                                                                                                                            return exits.error({
                                                                                                                                              data: combineReferenceContributingUpgradingAndGuidesArrays,
                                                                                                                                              status: 500
                                                                                                                                            });
                                                                                                                                          },
                                                                                                                                          "success": function(combineReferenceContributingUpgradingAndGuidesArrays) {


                                                                                                                                            // Combine the combined arrays
                                                                                                                                            sails.machines['c646f5e7-9c6f-49a5-91f6-7e1eabfd1186_5.2.0'].concat({
                                                                                                                                              "firstArray": combineReferenceContributingUpgradingAndGuidesArrays,
                                                                                                                                              "secondArray": combineAnatomyAndConceptsArrays
                                                                                                                                            }).exec({
                                                                                                                                              "error": function(combineTheCombinedArrays) {
                                                                                                                                                return exits.error({
                                                                                                                                                  data: combineTheCombinedArrays,
                                                                                                                                                  status: 500
                                                                                                                                                });
                                                                                                                                              },
                                                                                                                                              "success": function(combineTheCombinedArrays) {
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                                                                                                                                                //  ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗
                                                                                                                                                //  ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
                                                                                                                                                //  ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗
                                                                                                                                                //  ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝
                                                                                                                                                //  ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗
                                                                                                                                                //   ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
                                                                                                                                                //
                                                                                                                                                //  ███████╗██╗████████╗███████╗███╗   ███╗ █████╗ ██████╗
                                                                                                                                                //  ██╔════╝██║╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██╔══██╗
                                                                                                                                                //  ███████╗██║   ██║   █████╗  ██╔████╔██║███████║██████╔╝
                                                                                                                                                //  ╚════██║██║   ██║   ██╔══╝  ██║╚██╔╝██║██╔══██║██╔═══╝
                                                                                                                                                //  ███████║██║   ██║   ███████╗██║ ╚═╝ ██║██║  ██║██║
                                                                                                                                                //  ╚══════╝╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝
                                                                                                                                                //
                                                                                                                                                // Collate list of sitemap URLs
                                                                                                                                                sails.machines['_project_3549_0.0.43'].getPagesForSitemap({
                                                                                                                                                  "docPageMetadatas": combineTheCombinedArrays
                                                                                                                                                }).exec({
                                                                                                                                                  "error": function(collateListOfSitemapURLs) {
                                                                                                                                                    return exits.error({
                                                                                                                                                      data: collateListOfSitemapURLs,
                                                                                                                                                      status: 500
                                                                                                                                                    });
                                                                                                                                                  },
                                                                                                                                                  "success": function(collateListOfSitemapURLs) {
                                                                                                                                                    // Build sitemap XML
                                                                                                                                                    sails.machines['_project_3549_0.0.43'].buildSitemapXml({
                                                                                                                                                      "webpages": collateListOfSitemapURLs
                                                                                                                                                    }).setEnvironment({
                                                                                                                                                      req: req,
                                                                                                                                                      res: res,
                                                                                                                                                      sails: sails
                                                                                                                                                    }).exec({
                                                                                                                                                      "error": function(buildSitemapXML) {
                                                                                                                                                        return exits.error({
                                                                                                                                                          data: buildSitemapXML,
                                                                                                                                                          status: 500
                                                                                                                                                        });
                                                                                                                                                      },
                                                                                                                                                      "success": function(buildSitemapXML) {
                                                                                                                                                        // Resolve path
                                                                                                                                                        sails.machines['2806adc7-0289-473a-8843-020526771565_1.2.0'].resolve({
                                                                                                                                                          "paths": ["assets/sitemap.xml"]
                                                                                                                                                        }).exec({
                                                                                                                                                          "error": function(resolvePath) {
                                                                                                                                                            return exits.error({
                                                                                                                                                              data: resolvePath,
                                                                                                                                                              status: 500
                                                                                                                                                            });
                                                                                                                                                          },
                                                                                                                                                          "success": function(resolvePath) {
                                                                                                                                                            // Write file
                                                                                                                                                            sails.machines['8f8944e3-49b6-429d-a4c5-c77fe3ae878d_5.3.0'].write({
                                                                                                                                                              "destination": resolvePath,
                                                                                                                                                              "string": buildSitemapXML,
                                                                                                                                                              "force": true
                                                                                                                                                            }).exec({
                                                                                                                                                              "error": function(writeFile) {
                                                                                                                                                                return exits.error({
                                                                                                                                                                  data: writeFile,
                                                                                                                                                                  status: 500
                                                                                                                                                                });
                                                                                                                                                              },
                                                                                                                                                              "alreadyExists": function(writeFile) {
                                                                                                                                                                return exits.error({
                                                                                                                                                                  data: writeFile,
                                                                                                                                                                  status: 500
                                                                                                                                                                });
                                                                                                                                                              },
                                                                                                                                                              "success": function(writeFile) {
                                                                                                                                                                return exits.respond({
                                                                                                                                                                  action: "respond_with_status",
                                                                                                                                                                  status: 200
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
    }).configure(req.params.all(), {
      respond: res.response,
      error: res.negotiate
    }).exec();
  }
};
