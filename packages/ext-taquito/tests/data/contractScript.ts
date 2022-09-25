export const contractScript = {
  code: [
    {
      prim: "parameter",
      args: [
        {
          prim: "or",
          args: [
            {
              prim: "or",
              args: [
                {
                  prim: "pair",
                  args: [
                    {
                      prim: "address",
                      annots: [
                        "%participant"
                      ]
                    },
                    {
                      prim: "pair",
                      args: [
                        {
                          prim: "pair",
                          args: [
                            {
                              prim: "bytes",
                              annots: [
                                "%hashed_secret"
                              ]
                            },
                            {
                              prim: "timestamp",
                              annots: [
                                "%refund_time"
                              ]
                            }
                          ]
                        },
                        {
                          prim: "mutez",
                          annots: [
                            "%payoff"
                          ]
                        }
                      ],
                      annots: [
                        "%settings"
                      ]
                    }
                  ],
                  annots: [
                    ":initiate",
                    "%initiate"
                  ]
                },
                {
                  prim: "bytes",
                  annots: [
                    ":hashed_secret",
                    "%add"
                  ]
                }
              ],
              annots: [
                "%fund"
              ]
            },
            {
              prim: "or",
              args: [
                {
                  prim: "bytes",
                  annots: [
                    ":secret",
                    "%redeem"
                  ]
                },
                {
                  prim: "bytes",
                  annots: [
                    ":hashed_secret",
                    "%refund"
                  ]
                }
              ],
              annots: [
                "%withdraw"
              ]
            }
          ]
        }
      ]
    },
    {
      prim: "storage",
      args: [
        {
          prim: "pair",
          args: [
            {
              prim: "big_map",
              args: [
                {
                  prim: "bytes"
                },
                {
                  prim: "pair",
                  args: [
                    {
                      prim: "pair",
                      args: [
                        {
                          prim: "address",
                          annots: [
                            "%initiator"
                          ]
                        },
                        {
                          prim: "address",
                          annots: [
                            "%participant"
                          ]
                        }
                      ],
                      annots: [
                        "%recipients"
                      ]
                    },
                    {
                      prim: "pair",
                      args: [
                        {
                          prim: "pair",
                          args: [
                            {
                              prim: "mutez",
                              annots: [
                                "%amount"
                              ]
                            },
                            {
                              prim: "timestamp",
                              annots: [
                                "%refund_time"
                              ]
                            }
                          ]
                        },
                        {
                          prim: "mutez",
                          annots: [
                            "%payoff"
                          ]
                        }
                      ],
                      annots: [
                        "%settings"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              prim: "unit"
            }
          ]
        }
      ]
    },
    {
      prim: "code",
      args: [
        [
          {
            prim: "NIL",
            args: [
              {
                prim: "operation"
              }
            ],
            annots: [
              "@operations"
            ]
          },
          {
            prim: "SWAP"
          },
          [
            [
              {
                prim: "DUP"
              },
              {
                prim: "CAR",
                annots: [
                  "@%"
                ]
              },
              {
                prim: "DIP",
                args: [
                  [
                    {
                      prim: "CDR"
                    }
                  ]
                ]
              }
            ],
            {
              prim: "DIP",
              args: [
                [
                  [
                    {
                      prim: "DUP"
                    },
                    {
                      prim: "CAR",
                      annots: [
                        "@%"
                      ]
                    },
                    {
                      prim: "DIP",
                      args: [
                        [
                          {
                            prim: "CDR",
                            annots: [
                              "@%"
                            ]
                          }
                        ]
                      ]
                    }
                  ]
                ]
              ]
            }
          ],
          {
            prim: "DIP",
            args: [
              [
                {
                  prim: "DUP"
                }
              ]
            ]
          },
          {
            prim: "IF_LEFT",
            args: [
              [
                {
                  prim: "IF_LEFT",
                  args: [
                    [
                      [
                        [
                          {
                            prim: "DUP"
                          },
                          {
                            prim: "CAR",
                            annots: [
                              "@%"
                            ]
                          },
                          {
                            prim: "DIP",
                            args: [
                              [
                                {
                                  prim: "CDR",
                                  annots: [
                                    "@%"
                                  ]
                                }
                              ]
                            ]
                          }
                        ]
                      ],
                      {
                        prim: "DUP"
                      },
                      {
                        prim: "CONTRACT",
                        args: [
                          {
                            prim: "unit"
                          }
                        ],
                        annots: [
                          "@participant"
                        ]
                      },
                      [
                        {
                          prim: "IF_NONE",
                          args: [
                            [
                              [
                                {
                                  prim: "UNIT"
                                },
                                {
                                  prim: "FAILWITH"
                                }
                              ]
                            ],
                            []
                          ]
                        }
                      ],
                      {
                        prim: "DROP"
                      },
                      {
                        prim: "SWAP"
                      },
                      [
                        [
                          {
                            prim: "DUP"
                          },
                          {
                            prim: "CAR"
                          },
                          {
                            prim: "DIP",
                            args: [
                              [
                                {
                                  prim: "CDR",
                                  annots: [
                                    "@%"
                                  ]
                                }
                              ]
                            ]
                          }
                        ],
                        [
                          {
                            prim: "DUP"
                          },
                          {
                            prim: "CAR",
                            annots: [
                              "@%"
                            ]
                          },
                          {
                            prim: "DIP",
                            args: [
                              [
                                {
                                  prim: "CDR",
                                  annots: [
                                    "@%"
                                  ]
                                }
                              ]
                            ]
                          }
                        ]
                      ],
                      {
                        prim: "DUP"
                      },
                      {
                        prim: "SIZE"
                      },
                      {
                        prim: "PUSH",
                        args: [
                          {
                            prim: "nat"
                          },
                          {
                            int: "32"
                          }
                        ]
                      },
                      [
                        [
                          {
                            prim: "COMPARE"
                          },
                          {
                            prim: "EQ"
                          }
                        ],
                        {
                          prim: "IF",
                          args: [
                            [],
                            [
                              [
                                {
                                  prim: "UNIT"
                                },
                                {
                                  prim: "FAILWITH"
                                }
                              ]
                            ]
                          ]
                        }
                      ],
                      {
                        prim: "DIP",
                        args: [
                          [
                            {
                              prim: "DIP",
                              args: [
                                [
                                  {
                                    prim: "DUP"
                                  }
                                ]
                              ]
                            },
                            {
                              prim: "SWAP"
                            },
                            {
                              prim: "AMOUNT",
                              annots: [
                                "@amount"
                              ]
                            },
                            {
                              prim: "SUB"
                            },
                            {
                              prim: "SENDER"
                            },
                            {
                              prim: "DUP"
                            },
                            {
                              prim: "CONTRACT",
                              args: [
                                {
                                  prim: "unit"
                                }
                              ],
                              annots: [
                                "@initiator"
                              ]
                            },
                            [
                              {
                                prim: "IF_NONE",
                                args: [
                                  [
                                    [
                                      {
                                        prim: "UNIT"
                                      },
                                      {
                                        prim: "FAILWITH"
                                      }
                                    ]
                                  ],
                                  []
                                ]
                              }
                            ],
                            {
                              prim: "DROP"
                            },
                            {
                              prim: "DIP",
                              args: [
                                [
                                  [
                                    {
                                      prim: "PAIR"
                                    },
                                    {
                                      prim: "PAIR"
                                    }
                                  ],
                                  {
                                    prim: "SWAP"
                                  }
                                ]
                              ]
                            },
                            [
                              {
                                prim: "PAIR"
                              },
                              {
                                prim: "PAIR"
                              }
                            ],
                            {
                              prim: "SOME",
                              annots: [
                                "@xcat"
                              ]
                            },
                            {
                              prim: "SWAP"
                            }
                          ]
                        ]
                      },
                      {
                        prim: "DUP"
                      },
                      {
                        prim: "DIP",
                        args: [
                          [
                            {
                              prim: "MEM"
                            },
                            {
                              prim: "NOT"
                            },
                            [
                              {
                                prim: "IF",
                                args: [
                                  [],
                                  [
                                    [
                                      {
                                        prim: "UNIT"
                                      },
                                      {
                                        prim: "FAILWITH"
                                      }
                                    ]
                                  ]
                                ]
                              }
                            ]
                          ]
                        ]
                      }
                    ],
                    [
                      {
                        prim: "DUP"
                      },
                      {
                        prim: "DIP",
                        args: [
                          [
                            {
                              prim: "GET"
                            },
                            [
                              {
                                prim: "IF_NONE",
                                args: [
                                  [
                                    [
                                      {
                                        prim: "UNIT"
                                      },
                                      {
                                        prim: "FAILWITH"
                                      }
                                    ]
                                  ],
                                  []
                                ]
                              }
                            ],
                            [
                              [
                                {
                                  prim: "DUP"
                                },
                                {
                                  prim: "CAR",
                                  annots: [
                                    "@%"
                                  ]
                                },
                                {
                                  prim: "DIP",
                                  args: [
                                    [
                                      {
                                        prim: "CDR",
                                        annots: [
                                          "@%"
                                        ]
                                      }
                                    ]
                                  ]
                                }
                              ]
                            ],
                            {
                              prim: "DIP",
                              args: [
                                [
                                  [
                                    [
                                      {
                                        prim: "DUP"
                                      },
                                      {
                                        prim: "CAR"
                                      },
                                      {
                                        prim: "DIP",
                                        args: [
                                          [
                                            {
                                              prim: "CDR",
                                              annots: [
                                                "@%"
                                              ]
                                            }
                                          ]
                                        ]
                                      }
                                    ],
                                    [
                                      {
                                        prim: "DUP"
                                      },
                                      {
                                        prim: "CAR",
                                        annots: [
                                          "@%"
                                        ]
                                      },
                                      {
                                        prim: "DIP",
                                        args: [
                                          [
                                            {
                                              prim: "CDR",
                                              annots: [
                                                "@%"
                                              ]
                                            }
                                          ]
                                        ]
                                      }
                                    ]
                                  ],
                                  {
                                    prim: "SWAP"
                                  },
                                  {
                                    prim: "DUP"
                                  },
                                  {
                                    prim: "NOW"
                                  },
                                  [
                                    [
                                      {
                                        prim: "COMPARE"
                                      },
                                      {
                                        prim: "LT"
                                      }
                                    ],
                                    {
                                      prim: "IF",
                                      args: [
                                        [],
                                        [
                                          [
                                            {
                                              prim: "UNIT"
                                            },
                                            {
                                              prim: "FAILWITH"
                                            }
                                          ]
                                        ]
                                      ]
                                    }
                                  ],
                                  {
                                    prim: "SWAP"
                                  },
                                  {
                                    prim: "AMOUNT",
                                    annots: [
                                      "@amount"
                                    ]
                                  },
                                  {
                                    prim: "ADD"
                                  }
                                ]
                              ]
                            },
                            [
                              {
                                prim: "DIP",
                                args: [
                                  [
                                    {
                                      prim: "PAIR"
                                    }
                                  ]
                                ]
                              },
                              {
                                prim: "DIP",
                                args: [
                                  [
                                    {
                                      prim: "PAIR"
                                    }
                                  ]
                                ]
                              },
                              {
                                prim: "PAIR"
                              }
                            ],
                            {
                              prim: "SOME",
                              annots: [
                                "@xcat"
                              ]
                            }
                          ]
                        ]
                      }
                    ]
                  ]
                },
                {
                  prim: "UPDATE"
                },
                {
                  prim: "PAIR",
                  annots: [
                    "@new_storage"
                  ]
                },
                {
                  prim: "SWAP"
                },
                {
                  prim: "PAIR"
                }
              ],
              [
                {
                  prim: "IF_LEFT",
                  args: [
                    [
                      {
                        prim: "DUP"
                      },
                      {
                        prim: "SIZE"
                      },
                      {
                        prim: "PUSH",
                        args: [
                          {
                            prim: "nat"
                          },
                          {
                            int: "32"
                          }
                        ]
                      },
                      [
                        [
                          {
                            prim: "COMPARE"
                          },
                          {
                            prim: "EQ"
                          }
                        ],
                        {
                          prim: "IF",
                          args: [
                            [],
                            [
                              [
                                {
                                  prim: "UNIT"
                                },
                                {
                                  prim: "FAILWITH"
                                }
                              ]
                            ]
                          ]
                        }
                      ],
                      {
                        prim: "SHA256"
                      },
                      {
                        prim: "SHA256",
                        annots: [
                          "@hash"
                        ]
                      },
                      {
                        prim: "DUP"
                      },
                      {
                        prim: "DIP",
                        args: [
                          [
                            {
                              prim: "SWAP"
                            }
                          ]
                        ]
                      },
                      [
                        {
                          prim: "DIP",
                          args: [
                            [
                              {
                                prim: "DIP",
                                args: [
                                  [
                                    {
                                      prim: "GET"
                                    },
                                    [
                                      {
                                        prim: "IF_NONE",
                                        args: [
                                          [
                                            [
                                              {
                                                prim: "UNIT"
                                              },
                                              {
                                                prim: "FAILWITH"
                                              }
                                            ]
                                          ],
                                          []
                                        ]
                                      }
                                    ],
                                    {
                                      prim: "DUP"
                                    },
                                    [
                                      [
                                        {
                                          prim: "DUP"
                                        },
                                        {
                                          prim: "CAR",
                                          annots: [
                                            "@%"
                                          ]
                                        },
                                        {
                                          prim: "DIP",
                                          args: [
                                            [
                                              {
                                                prim: "CDR",
                                                annots: [
                                                  "@%"
                                                ]
                                              }
                                            ]
                                          ]
                                        }
                                      ]
                                    ],
                                    {
                                      prim: "CDR",
                                      annots: [
                                        "@%"
                                      ]
                                    },
                                    {
                                      prim: "CONTRACT",
                                      args: [
                                        {
                                          prim: "unit"
                                        }
                                      ],
                                      annots: [
                                        "@participant"
                                      ]
                                    },
                                    [
                                      {
                                        prim: "IF_NONE",
                                        args: [
                                          [
                                            [
                                              {
                                                prim: "UNIT"
                                              },
                                              {
                                                prim: "FAILWITH"
                                              }
                                            ]
                                          ],
                                          []
                                        ]
                                      }
                                    ],
                                    {
                                      prim: "SWAP"
                                    },
                                    [
                                      {
                                        prim: "CAR"
                                      },
                                      {
                                        prim: "CAR",
                                        annots: [
                                          "@%"
                                        ]
                                      }
                                    ],
                                    [
                                      {
                                        prim: "DIP",
                                        args: [
                                          [
                                            {
                                              prim: "DIP",
                                              args: [
                                                [
                                                  {
                                                    prim: "SENDER"
                                                  },
                                                  {
                                                    prim: "CONTRACT",
                                                    args: [
                                                      {
                                                        prim: "unit"
                                                      }
                                                    ],
                                                    annots: [
                                                      "@sender"
                                                    ]
                                                  },
                                                  [
                                                    {
                                                      prim: "IF_NONE",
                                                      args: [
                                                        [
                                                          [
                                                            {
                                                              prim: "UNIT"
                                                            },
                                                            {
                                                              prim: "FAILWITH"
                                                            }
                                                          ]
                                                        ],
                                                        []
                                                      ]
                                                    }
                                                  ],
                                                  {
                                                    prim: "SWAP"
                                                  },
                                                  {
                                                    prim: "CDR",
                                                    annots: [
                                                      "@%"
                                                    ]
                                                  },
                                                  [
                                                    [
                                                      {
                                                        prim: "DUP"
                                                      },
                                                      {
                                                        prim: "CAR"
                                                      },
                                                      {
                                                        prim: "DIP",
                                                        args: [
                                                          [
                                                            {
                                                              prim: "CDR",
                                                              annots: [
                                                                "@%"
                                                              ]
                                                            }
                                                          ]
                                                        ]
                                                      }
                                                    ],
                                                    [
                                                      {
                                                        prim: "DUP"
                                                      },
                                                      {
                                                        prim: "CAR",
                                                        annots: [
                                                          "@%"
                                                        ]
                                                      },
                                                      {
                                                        prim: "DIP",
                                                        args: [
                                                          [
                                                            {
                                                              prim: "CDR",
                                                              annots: [
                                                                "@%"
                                                              ]
                                                            }
                                                          ]
                                                        ]
                                                      }
                                                    ]
                                                  ],
                                                  {
                                                    prim: "DROP"
                                                  },
                                                  {
                                                    prim: "NOW"
                                                  },
                                                  [
                                                    [
                                                      {
                                                        prim: "COMPARE"
                                                      },
                                                      {
                                                        prim: "LT"
                                                      }
                                                    ],
                                                    {
                                                      prim: "IF",
                                                      args: [
                                                        [],
                                                        [
                                                          [
                                                            {
                                                              prim: "UNIT"
                                                            },
                                                            {
                                                              prim: "FAILWITH"
                                                            }
                                                          ]
                                                        ]
                                                      ]
                                                    }
                                                  ],
                                                  {
                                                    prim: "DUP"
                                                  },
                                                  {
                                                    prim: "PUSH",
                                                    args: [
                                                      {
                                                        prim: "mutez"
                                                      },
                                                      {
                                                        int: "0"
                                                      }
                                                    ]
                                                  },
                                                  [
                                                    {
                                                      prim: "COMPARE"
                                                    },
                                                    {
                                                      prim: "LT"
                                                    },
                                                    {
                                                      prim: "IF",
                                                      args: [
                                                        [
                                                          {
                                                            prim: "UNIT"
                                                          },
                                                          {
                                                            prim: "TRANSFER_TOKENS"
                                                          },
                                                          {
                                                            prim: "DIP",
                                                            args: [
                                                              [
                                                                {
                                                                  prim: "SWAP"
                                                                }
                                                              ]
                                                            ]
                                                          },
                                                          {
                                                            prim: "CONS"
                                                          }
                                                        ],
                                                        [
                                                          {
                                                            prim: "DROP"
                                                          },
                                                          {
                                                            prim: "DROP"
                                                          },
                                                          {
                                                            prim: "SWAP"
                                                          }
                                                        ]
                                                      ]
                                                    }
                                                  ]
                                                ]
                                              ]
                                            }
                                          ]
                                        ]
                                      }
                                    ],
                                    {
                                      prim: "UNIT"
                                    },
                                    {
                                      prim: "TRANSFER_TOKENS"
                                    }
                                  ]
                                ]
                              }
                            ]
                          ]
                        }
                      ]
                    ],
                    [
                      {
                        prim: "DUP"
                      },
                      {
                        prim: "DIP",
                        args: [
                          [
                            {
                              prim: "GET"
                            },
                            [
                              {
                                prim: "IF_NONE",
                                args: [
                                  [
                                    [
                                      {
                                        prim: "UNIT"
                                      },
                                      {
                                        prim: "FAILWITH"
                                      }
                                    ]
                                  ],
                                  []
                                ]
                              }
                            ],
                            {
                              prim: "DUP"
                            },
                            [
                              {
                                prim: "CAR"
                              },
                              {
                                prim: "CAR",
                                annots: [
                                  "@%"
                                ]
                              }
                            ],
                            {
                              prim: "CONTRACT",
                              args: [
                                {
                                  prim: "unit"
                                }
                              ],
                              annots: [
                                "@initiator"
                              ]
                            },
                            [
                              {
                                prim: "IF_NONE",
                                args: [
                                  [
                                    [
                                      {
                                        prim: "UNIT"
                                      },
                                      {
                                        prim: "FAILWITH"
                                      }
                                    ]
                                  ],
                                  []
                                ]
                              }
                            ],
                            {
                              prim: "SWAP"
                            },
                            {
                              prim: "CDR"
                            },
                            [
                              [
                                {
                                  prim: "DUP"
                                },
                                {
                                  prim: "CAR"
                                },
                                {
                                  prim: "DIP",
                                  args: [
                                    [
                                      {
                                        prim: "CDR",
                                        annots: [
                                          "@%"
                                        ]
                                      }
                                    ]
                                  ]
                                }
                              ],
                              [
                                {
                                  prim: "DUP"
                                },
                                {
                                  prim: "CAR",
                                  annots: [
                                    "@%"
                                  ]
                                },
                                {
                                  prim: "DIP",
                                  args: [
                                    [
                                      {
                                        prim: "CDR",
                                        annots: [
                                          "@%"
                                        ]
                                      }
                                    ]
                                  ]
                                }
                              ]
                            ],
                            {
                              prim: "SWAP"
                            },
                            {
                              prim: "NOW"
                            },
                            [
                              [
                                {
                                  prim: "COMPARE"
                                },
                                {
                                  prim: "GE"
                                }
                              ],
                              {
                                prim: "IF",
                                args: [
                                  [],
                                  [
                                    [
                                      {
                                        prim: "UNIT"
                                      },
                                      {
                                        prim: "FAILWITH"
                                      }
                                    ]
                                  ]
                                ]
                              }
                            ],
                            {
                              prim: "ADD"
                            },
                            {
                              prim: "UNIT"
                            },
                            {
                              prim: "TRANSFER_TOKENS"
                            },
                            {
                              prim: "SWAP"
                            },
                            [
                              {
                                prim: "DIP",
                                args: [
                                  [
                                    {
                                      prim: "DIP",
                                      args: [
                                        [
                                          {
                                            prim: "SWAP"
                                          }
                                        ]
                                      ]
                                    }
                                  ]
                                ]
                              }
                            ]
                          ]
                        ]
                      }
                    ]
                  ]
                },
                {
                  prim: "NONE",
                  args: [
                    {
                      prim: "pair",
                      args: [
                        {
                          prim: "pair",
                          args: [
                            {
                              prim: "address"
                            },
                            {
                              prim: "address"
                            }
                          ]
                        },
                        {
                          prim: "pair",
                          args: [
                            {
                              prim: "pair",
                              args: [
                                {
                                  prim: "mutez"
                                },
                                {
                                  prim: "timestamp"
                                }
                              ]
                            },
                            {
                              prim: "mutez"
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  annots: [
                    "@none"
                  ]
                },
                {
                  prim: "SWAP"
                },
                {
                  prim: "UPDATE",
                  annots: [
                    "@cleared_map"
                  ]
                },
                {
                  prim: "SWAP"
                },
                {
                  prim: "DIP",
                  args: [
                    [
                      {
                        prim: "SWAP"
                      },
                      {
                        prim: "DIP",
                        args: [
                          [
                            {
                              prim: "PAIR"
                            }
                          ]
                        ]
                      }
                    ]
                  ]
                },
                {
                  prim: "CONS"
                },
                {
                  prim: "PAIR"
                }
              ]
            ]
          }
        ]
      ]
    }
  ],
  storage: {
    prim: "Pair",
    args: [
      {
        int: "4"
      },
      {
        prim: "Unit"
      }
    ]
  }
}
