/* eslint-disable */
/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/gamma.json`.
 */
export type Gamma = {
    "address": "GAMMA7meSFWaBXF25oSUgmGRwaW6sCMFLmBNiMSdbHVT",
    "metadata": {
      "name": "gamma",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "calculateRewards",
        "docs": [
          "Calculate rewards for the user",
          "",
          "* `ctx` - The context of accounts",
          ""
        ],
        "discriminator": [
          199,
          115,
          201,
          124,
          71,
          81,
          143,
          252
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "poolState"
          },
          {
            "name": "rewardInfo",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    119,
                    97,
                    114,
                    100,
                    95,
                    105,
                    110,
                    102,
                    111,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "reward_info.start_at",
                  "account": "rewardInfo"
                },
                {
                  "kind": "account",
                  "path": "reward_info.mint",
                  "account": "rewardInfo"
                }
              ]
            }
          },
          {
            "name": "userRewardInfo",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    95,
                    114,
                    101,
                    119,
                    97,
                    114,
                    100,
                    95,
                    105,
                    110,
                    102,
                    111,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                },
                {
                  "kind": "account",
                  "path": "rewardInfo"
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "userPoolLiquidity",
            "docs": [
              "User pool liquidity account"
            ],
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "claimRewards",
        "docs": [
          "Claim rewards for the user",
          "Transfers the amount of tokens calculated for the user to their reward token account",
          "",
          "# Arguments",
          "",
          "* `ctx` - The context of accounts",
          ""
        ],
        "discriminator": [
          4,
          144,
          132,
          71,
          116,
          23,
          151,
          80
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "authority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "poolState"
          },
          {
            "name": "rewardInfo",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    119,
                    97,
                    114,
                    100,
                    95,
                    105,
                    110,
                    102,
                    111,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "reward_info.start_at",
                  "account": "rewardInfo"
                },
                {
                  "kind": "account",
                  "path": "reward_info.mint",
                  "account": "rewardInfo"
                }
              ]
            }
          },
          {
            "name": "rewardVault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    119,
                    97,
                    114,
                    100,
                    95,
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                },
                {
                  "kind": "account",
                  "path": "rewardInfo"
                }
              ]
            }
          },
          {
            "name": "userTokenAccount",
            "writable": true
          },
          {
            "name": "userRewardInfo",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    95,
                    114,
                    101,
                    119,
                    97,
                    114,
                    100,
                    95,
                    105,
                    110,
                    102,
                    111,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                },
                {
                  "kind": "account",
                  "path": "rewardInfo"
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "rewardMint",
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "collectFundFee",
        "docs": [
          "Collect the fund fee accrued to the pool",
          "",
          "# Arguments",
          "",
          "* `ctx` - The context of accounts",
          "* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1",
          "* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0",
          ""
        ],
        "discriminator": [
          167,
          138,
          78,
          149,
          223,
          194,
          6,
          126
        ],
        "accounts": [
          {
            "name": "owner",
            "docs": [
              "Only admin or fund_owner can collect fee now"
            ],
            "signer": true
          },
          {
            "name": "authority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "poolState",
            "docs": [
              "Pool state stores accumulated protocol fee amount"
            ],
            "writable": true
          },
          {
            "name": "ammConfig",
            "docs": [
              "Amm config account stores fund_owner"
            ]
          },
          {
            "name": "token0Vault",
            "docs": [
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "token1Vault",
            "docs": [
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "vault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "vault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          },
          {
            "name": "recipientToken0Account",
            "docs": [
              "The address that receives the collected token_0 fund fees"
            ],
            "writable": true
          },
          {
            "name": "recipientToken1Account",
            "docs": [
              "The address that receives the collected token_1 fund fees"
            ],
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "The SPL program to perform token transfers"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "The SPL program 2022 to perform token transfers"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          }
        ],
        "args": [
          {
            "name": "amount0Requested",
            "type": "u64"
          },
          {
            "name": "amount1Requested",
            "type": "u64"
          }
        ]
      },
      {
        "name": "collectProtocolFee",
        "docs": [
          "Collect the protocol fee accrued to the pool",
          "",
          "# Arguments",
          "",
          "* `ctx` - The context of accounts",
          "* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1",
          "* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0",
          ""
        ],
        "discriminator": [
          136,
          136,
          252,
          221,
          194,
          66,
          126,
          89
        ],
        "accounts": [
          {
            "name": "owner",
            "docs": [
              "Only admin or owner can collect fee now"
            ],
            "signer": true
          },
          {
            "name": "authority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "poolState",
            "docs": [
              "Pool state stores accumulated protocol fee amount"
            ],
            "writable": true
          },
          {
            "name": "ammConfig",
            "docs": [
              "Amm config account stores owner"
            ]
          },
          {
            "name": "token0Vault",
            "docs": [
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "token1Vault",
            "docs": [
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "vault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "vault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          },
          {
            "name": "recipientToken0Account",
            "docs": [
              "The address that receives the collected token_0 protocol fees"
            ],
            "writable": true
          },
          {
            "name": "recipientToken1Account",
            "docs": [
              "The address that receives the collected token_1 protocol fees"
            ],
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "The SPL program to perform token transfers"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "The SPL program 2022 to perform token transfers"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          }
        ],
        "args": [
          {
            "name": "amount0Requested",
            "type": "u64"
          },
          {
            "name": "amount1Requested",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createAmmConfig",
        "docs": [
          "The configuation of AMM protocol, include trade fee and protocol fee",
          "# Arguments",
          "",
          "* `ctx`- The accounts needed by instruction.",
          "* `index` - The index of amm config, there may be multiple config.",
          "* `trade_fee_rate` - Trade fee rate, can be changed.",
          "* `protocol_fee_rate` - The rate of protocol fee within tarde fee.",
          "* `fund_fee_rate` - The rate of fund fee within tarde fee.",
          ""
        ],
        "discriminator": [
          137,
          52,
          237,
          212,
          215,
          117,
          108,
          104
        ],
        "accounts": [
          {
            "name": "owner",
            "docs": [
              "Address to be set as protocol owner."
            ],
            "writable": true,
            "signer": true,
            "address": "9QcHinaHcJFdzSHeiF1yGchcuQk3qPFNV13q6dZJbAny"
          },
          {
            "name": "ammConfig",
            "docs": [
              "Initialize AmmConfig state account to store protocol owner address and fee rates"
            ],
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    97,
                    109,
                    109,
                    95,
                    99,
                    111,
                    110,
                    102,
                    105,
                    103
                  ]
                },
                {
                  "kind": "arg",
                  "path": "index"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "tradeFeeRate",
            "type": "u64"
          },
          {
            "name": "protocolFeeRate",
            "type": "u64"
          },
          {
            "name": "fundFeeRate",
            "type": "u64"
          },
          {
            "name": "createPoolFee",
            "type": "u64"
          },
          {
            "name": "maxOpenTime",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createRewards",
        "docs": [
          "Create rewards for the pool",
          "Initializes a new reward info account and a reward vault account",
          "Transfers the rewards to the reward vault",
          "",
          "# Arguments",
          "",
          "* `ctx` - The context of accounts",
          "* `start_time` - The start time of the reward",
          "* `end_time` - The end time of the reward",
          "* `reward_amount` - The amount of the reward",
          ""
        ],
        "discriminator": [
          124,
          251,
          145,
          232,
          5,
          173,
          159,
          223
        ],
        "accounts": [
          {
            "name": "rewardProvider",
            "writable": true,
            "signer": true
          },
          {
            "name": "authority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "poolState"
          },
          {
            "name": "rewardInfo",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    119,
                    97,
                    114,
                    100,
                    95,
                    105,
                    110,
                    102,
                    111,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "arg",
                  "path": "startTime"
                },
                {
                  "kind": "account",
                  "path": "rewardMint"
                }
              ]
            }
          },
          {
            "name": "rewardProvidersTokenAccount",
            "writable": true
          },
          {
            "name": "rewardVault",
            "docs": [
              "For reward to deposit into."
            ],
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    119,
                    97,
                    114,
                    100,
                    95,
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                },
                {
                  "kind": "account",
                  "path": "rewardInfo"
                }
              ]
            }
          },
          {
            "name": "rewardMint",
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createSwapReferral",
        "docs": [
          "Initialize swap referrals for an existing AMM config",
          "# Arguments",
          "",
          "* `ctx` - The accounts needed by the instruction, including those used by cpi to the referral program",
          "* `name` - The project name, passed to the referral program. Must be less than 50 chars in length",
          "* `default_share_bps` - Percentage share of fees to referrers. Must be less than 10_000"
        ],
        "discriminator": [
          67,
          131,
          93,
          236,
          56,
          6,
          40,
          77
        ],
        "accounts": [
          {
            "name": "admin",
            "docs": [
              "Admin signer for this operation"
            ],
            "signer": true
          },
          {
            "name": "owner",
            "address": "9QcHinaHcJFdzSHeiF1yGchcuQk3qPFNV13q6dZJbAny"
          },
          {
            "name": "payer",
            "writable": true,
            "signer": true
          },
          {
            "name": "ammConfig",
            "docs": [
              "The config acts as the base for its referral project"
            ],
            "writable": true
          },
          {
            "name": "project",
            "writable": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "referralProgram",
            "address": "REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3"
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "defaultShareBps",
            "type": "u16"
          }
        ]
      },
      {
        "name": "deposit",
        "docs": [
          "Creates a pool for the given token pair and the initial price",
          "",
          "# Arguments",
          "",
          "* `ctx`- The context of accounts",
          "* `lp_token_amount` - Pool token amount to transfer. token_a and token_b amount are set by the current exchange rate and size of the pool",
          "* `maximum_token_0_amount` -  Maximum token 0 amount to deposit, prevents excessive slippage",
          "* `maximum_token_1_amount` - Maximum token 1 amount to deposit, prevents excessive slippage",
          ""
        ],
        "discriminator": [
          242,
          35,
          198,
          137,
          82,
          225,
          242,
          182
        ],
        "accounts": [
          {
            "name": "owner",
            "docs": [
              "Owner of the liquidity provided"
            ],
            "signer": true
          },
          {
            "name": "authority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "poolState",
            "docs": [
              "Pool state the owner is depositing into"
            ],
            "writable": true
          },
          {
            "name": "userPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "token0Account",
            "docs": [
              "The payer's token account to deposit token_0"
            ],
            "writable": true
          },
          {
            "name": "token1Account",
            "docs": [
              "The payer's token account to deposit token_1"
            ],
            "writable": true
          },
          {
            "name": "token0Vault",
            "docs": [
              "Pool vault for token_0 to deposit into",
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "token1Vault",
            "docs": [
              "Pool vault for token_1 to deposit into",
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "vault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "vault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          }
        ],
        "args": [
          {
            "name": "lpTokenAmount",
            "type": "u64"
          },
          {
            "name": "maximumToken0Amount",
            "type": "u64"
          },
          {
            "name": "maximumToken1Amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initUserPoolLiquidity",
        "discriminator": [
          227,
          221,
          200,
          212,
          36,
          107,
          149,
          36
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "poolState"
          },
          {
            "name": "userPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "docs": [
              "To create a new program account"
            ],
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "partner",
            "type": {
              "option": "string"
            }
          }
        ]
      },
      {
        "name": "initialize",
        "docs": [
          "Creates a pool for the given token pair and the initial price",
          "",
          "# Arguments",
          "",
          "* `ctx`- The context of accounts",
          "* `init_amount_0` - the initial amount_0 to deposit",
          "* `init_amount_1` - the initial amount_1 to deposit",
          "* `open_time` - the timestamp allowed for swap",
          "* `max_trade_fee_rate` - The maximum trade fee that can be charged on swaps",
          "* `volatility_factor` - The volatility factor of the pool to determine the trade fee",
          ""
        ],
        "discriminator": [
          175,
          175,
          109,
          31,
          13,
          152,
          155,
          237
        ],
        "accounts": [
          {
            "name": "creator",
            "docs": [
              "Address paying to create the pool. It can be anyone."
            ],
            "writable": true,
            "signer": true
          },
          {
            "name": "ammConfig",
            "docs": [
              "Which amm config the pool belongs to"
            ]
          },
          {
            "name": "authority",
            "docs": [
              "sign transactions on behalf of the pool",
              "for vault and lp_mint"
            ],
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "poolState",
            "docs": [
              "Initialize an account to store the pool state"
            ],
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "ammConfig"
                },
                {
                  "kind": "account",
                  "path": "token0Mint"
                },
                {
                  "kind": "account",
                  "path": "token1Mint"
                }
              ]
            }
          },
          {
            "name": "userPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "creator"
                }
              ]
            }
          },
          {
            "name": "token0Mint",
            "docs": [
              "Token_0 mint, the key must smaller than token_1 mint."
            ]
          },
          {
            "name": "token1Mint",
            "docs": [
              "Token_1 mint, the key must greater than token_0 mint."
            ]
          },
          {
            "name": "creatorToken0",
            "docs": [
              "creator token 0 account"
            ],
            "writable": true
          },
          {
            "name": "creatorToken1",
            "docs": [
              "creator token 1 account"
            ],
            "writable": true
          },
          {
            "name": "token0Vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    111,
                    111,
                    108,
                    95,
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "token0Mint"
                }
              ]
            }
          },
          {
            "name": "token1Vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    111,
                    111,
                    108,
                    95,
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "token1Mint"
                }
              ]
            }
          },
          {
            "name": "createPoolFee",
            "docs": [
              "create pool fee account"
            ],
            "writable": true,
            "address": "8PhehuioLjhJ35A5eavazJSwoXcA4J7WwzgoWDBDFSuY"
          },
          {
            "name": "observationState",
            "docs": [
              "an account to store oracle observations"
            ],
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    111,
                    98,
                    115,
                    101,
                    114,
                    118,
                    97,
                    116,
                    105,
                    111,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                }
              ]
            }
          },
          {
            "name": "tokenProgram",
            "docs": [
              "Program to create mint account and mint tokens"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "token0Program",
            "docs": [
              "Spl token program or token program 2022"
            ]
          },
          {
            "name": "token1Program",
            "docs": [
              "Spl token program or token program 2022"
            ]
          },
          {
            "name": "associatedTokenProgram",
            "docs": [
              "Program to create an ATA for receiving position NFT"
            ],
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          },
          {
            "name": "systemProgram",
            "docs": [
              "To create a new program account"
            ],
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "rent",
            "docs": [
              "Sysvar for program account"
            ],
            "address": "SysvarRent111111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "initAmount0",
            "type": "u64"
          },
          {
            "name": "initAmount1",
            "type": "u64"
          },
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "maxTradeFeeRate",
            "type": "u64"
          },
          {
            "name": "volatilityFactor",
            "type": "u64"
          }
        ]
      },
      {
        "name": "migrateMeteoraDlmmToGamma",
        "docs": [
          "Migrate from Meteora Dlmm to Gamma"
        ],
        "discriminator": [
          166,
          33,
          209,
          228,
          15,
          46,
          252,
          67
        ],
        "accounts": [
          {
            "name": "dlmmPosition",
            "writable": true
          },
          {
            "name": "dlmmLbPair",
            "writable": true
          },
          {
            "name": "dlmmBinArrayBitmapExtension",
            "writable": true,
            "optional": true
          },
          {
            "name": "dlmmReserveX",
            "writable": true
          },
          {
            "name": "dlmmReserveY",
            "writable": true
          },
          {
            "name": "dlmmBinArrayLower",
            "writable": true
          },
          {
            "name": "dlmmBinArrayUpper",
            "writable": true
          },
          {
            "name": "dlmmProgram",
            "address": "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"
          },
          {
            "name": "dlmmEventAuthority"
          },
          {
            "name": "tokenXProgram"
          },
          {
            "name": "tokenYProgram"
          },
          {
            "name": "gammaOwner",
            "docs": [
              "The owner LP Position in Gamma pool"
            ],
            "signer": true
          },
          {
            "name": "gammaAuthority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "gammaPoolState",
            "docs": [
              "Gamma Pool state the owner is depositing into"
            ],
            "writable": true
          },
          {
            "name": "gammaUserPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "gammaPoolState"
                },
                {
                  "kind": "account",
                  "path": "gammaOwner"
                }
              ]
            }
          },
          {
            "name": "gammaToken0Account",
            "docs": [
              "The payer's token account to deposit token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Account",
            "docs": [
              "The payer's token account to deposit token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaToken0Vault",
            "docs": [
              "Pool vault for token_0 to deposit into",
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Vault",
            "docs": [
              "Pool vault for token_1 to deposit into",
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "gammaVault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "gammaVault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          }
        ],
        "args": [
          {
            "name": "binLiquidityReduction",
            "type": {
              "vec": {
                "defined": {
                  "name": "binLiquidityReduction"
                }
              }
            }
          },
          {
            "name": "maximumToken0Amount",
            "type": "u64"
          },
          {
            "name": "maximumToken1Amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "migrateOrcaWhirlpoolToGamma",
        "docs": [
          "Migrate from Orca Whirlpool to Gamma for simple spl tokens"
        ],
        "discriminator": [
          197,
          196,
          129,
          5,
          64,
          184,
          129,
          242
        ],
        "accounts": [
          {
            "name": "whirlpoolProgram",
            "address": "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
          },
          {
            "name": "whirlpool",
            "writable": true
          },
          {
            "name": "tokenProgramA"
          },
          {
            "name": "tokenProgramB"
          },
          {
            "name": "memoProgram",
            "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          },
          {
            "name": "whirlpoolPosition",
            "writable": true
          },
          {
            "name": "whirlpoolPositionTokenAccount"
          },
          {
            "name": "whirlpoolTokenVaultA",
            "writable": true
          },
          {
            "name": "whirlpoolTokenVaultB",
            "writable": true
          },
          {
            "name": "whirlpoolTickArrayLower",
            "writable": true
          },
          {
            "name": "whirlpoolTickArrayUpper",
            "writable": true
          },
          {
            "name": "gammaOwner",
            "docs": [
              "The owner LP Position in Gamma pool"
            ],
            "signer": true
          },
          {
            "name": "gammaAuthority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "gammaPoolState",
            "docs": [
              "Gamma Pool state the owner is depositing into"
            ],
            "writable": true
          },
          {
            "name": "gammaUserPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "gammaPoolState"
                },
                {
                  "kind": "account",
                  "path": "gammaOwner"
                }
              ]
            }
          },
          {
            "name": "gammaToken0Account",
            "docs": [
              "The payer's token account to deposit token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Account",
            "docs": [
              "The payer's token account to deposit token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaToken0Vault",
            "docs": [
              "Pool vault for token_0 to deposit into",
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Vault",
            "docs": [
              "Pool vault for token_1 to deposit into",
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "gammaVault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "gammaVault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          }
        ],
        "args": [
          {
            "name": "liquidityAmount",
            "type": "u128"
          },
          {
            "name": "tokenMinA",
            "type": "u64"
          },
          {
            "name": "tokenMinB",
            "type": "u64"
          },
          {
            "name": "maximumToken0Amount",
            "type": "u64"
          },
          {
            "name": "maximumToken1Amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "migrateOrcaWhirlpoolToGammaV2",
        "docs": [
          "Migrate from Orca Whirlpool to Gamma for token 2022"
        ],
        "discriminator": [
          48,
          74,
          173,
          201,
          189,
          38,
          220,
          244
        ],
        "accounts": [
          {
            "name": "whirlpoolProgram",
            "address": "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
          },
          {
            "name": "whirlpool",
            "writable": true
          },
          {
            "name": "tokenProgramA"
          },
          {
            "name": "tokenProgramB"
          },
          {
            "name": "memoProgram",
            "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          },
          {
            "name": "whirlpoolPosition",
            "writable": true
          },
          {
            "name": "whirlpoolPositionTokenAccount"
          },
          {
            "name": "whirlpoolTokenVaultA",
            "writable": true
          },
          {
            "name": "whirlpoolTokenVaultB",
            "writable": true
          },
          {
            "name": "whirlpoolTickArrayLower",
            "writable": true
          },
          {
            "name": "whirlpoolTickArrayUpper",
            "writable": true
          },
          {
            "name": "gammaOwner",
            "docs": [
              "The owner LP Position in Gamma pool"
            ],
            "signer": true
          },
          {
            "name": "gammaAuthority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "gammaPoolState",
            "docs": [
              "Gamma Pool state the owner is depositing into"
            ],
            "writable": true
          },
          {
            "name": "gammaUserPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "gammaPoolState"
                },
                {
                  "kind": "account",
                  "path": "gammaOwner"
                }
              ]
            }
          },
          {
            "name": "gammaToken0Account",
            "docs": [
              "The payer's token account to deposit token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Account",
            "docs": [
              "The payer's token account to deposit token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaToken0Vault",
            "docs": [
              "Pool vault for token_0 to deposit into",
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Vault",
            "docs": [
              "Pool vault for token_1 to deposit into",
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "gammaVault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "gammaVault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          }
        ],
        "args": [
          {
            "name": "liquidityAmount",
            "type": "u128"
          },
          {
            "name": "tokenMinA",
            "type": "u64"
          },
          {
            "name": "tokenMinB",
            "type": "u64"
          },
          {
            "name": "remainingAccounts",
            "type": {
              "option": {
                "defined": {
                  "name": "remainingAccountsInfo"
                }
              }
            }
          },
          {
            "name": "maximumToken0Amount",
            "type": "u64"
          },
          {
            "name": "maximumToken1Amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "migrateRaydiumClmmToGamma",
        "docs": [
          "Migrate from Raydium Clmm to Gamma"
        ],
        "discriminator": [
          53,
          162,
          11,
          109,
          57,
          57,
          186,
          248
        ],
        "accounts": [
          {
            "name": "raydiumClmmProgram",
            "address": "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
          },
          {
            "name": "raydiumClmmNftOwner",
            "signer": true
          },
          {
            "name": "raydiumClmmNftAccount"
          },
          {
            "name": "raydiumClmmPersonalPosition",
            "writable": true
          },
          {
            "name": "raydiumClmmPoolState",
            "writable": true
          },
          {
            "name": "raydiumClmmProtocolPosition",
            "writable": true
          },
          {
            "name": "raydiumClmmTokenVault0",
            "docs": [
              "Token_0 vault"
            ],
            "writable": true
          },
          {
            "name": "raydiumClmmTokenVault1",
            "writable": true
          },
          {
            "name": "raydiumClmmTickArrayLower",
            "writable": true
          },
          {
            "name": "raydiumClmmTickArrayUpper",
            "writable": true
          },
          {
            "name": "gammaOwner",
            "docs": [
              "Owner of the liquidity provided"
            ],
            "signer": true
          },
          {
            "name": "gammaAuthority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "gammaPoolState",
            "docs": [
              "Pool state the owner is depositing into"
            ],
            "writable": true
          },
          {
            "name": "gammaUserPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "gammaPoolState"
                },
                {
                  "kind": "account",
                  "path": "gammaOwner"
                }
              ]
            }
          },
          {
            "name": "gammaToken0Account",
            "docs": [
              "The payer's token account to deposit token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Account",
            "docs": [
              "The payer's token account to deposit token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaToken0Vault",
            "docs": [
              "Pool vault for token_0 to deposit into",
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Vault",
            "docs": [
              "Pool vault for token_1 to deposit into",
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaVault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "gammaVault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          }
        ],
        "args": [
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "amount0Min",
            "type": "u64"
          },
          {
            "name": "amount1Min",
            "type": "u64"
          },
          {
            "name": "maximumToken0Amount",
            "type": "u64"
          },
          {
            "name": "maximumToken1Amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "migrateRaydiumClmmToGammaV2",
        "docs": [
          "Migrate from Raydium Clmm to Gamma for token 2022"
        ],
        "discriminator": [
          138,
          127,
          173,
          116,
          184,
          119,
          160,
          145
        ],
        "accounts": [
          {
            "name": "raydiumClmmProgram",
            "address": "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
          },
          {
            "name": "raydiumClmmNftOwner",
            "signer": true
          },
          {
            "name": "raydiumClmmNftAccount"
          },
          {
            "name": "raydiumClmmPersonalPosition",
            "writable": true
          },
          {
            "name": "raydiumClmmPoolState",
            "writable": true
          },
          {
            "name": "raydiumClmmProtocolPosition",
            "writable": true
          },
          {
            "name": "raydiumClmmTokenVault0",
            "writable": true
          },
          {
            "name": "raydiumClmmTokenVault1",
            "writable": true
          },
          {
            "name": "raydiumClmmTickArrayLower",
            "writable": true
          },
          {
            "name": "raydiumClmmTickArrayUpper",
            "writable": true
          },
          {
            "name": "memoProgram",
            "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          },
          {
            "name": "gammaOwner",
            "docs": [
              "Owner of the liquidity provided"
            ],
            "signer": true
          },
          {
            "name": "gammaAuthority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "gammaPoolState",
            "docs": [
              "Pool state the owner is depositing into"
            ],
            "writable": true
          },
          {
            "name": "gammaUserPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "gammaPoolState"
                },
                {
                  "kind": "account",
                  "path": "gammaOwner"
                }
              ]
            }
          },
          {
            "name": "gammaToken0Account",
            "docs": [
              "The payer's token account to deposit token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Account",
            "docs": [
              "The payer's token account to deposit token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaToken0Vault",
            "docs": [
              "Pool vault for token_0 to deposit into",
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Vault",
            "docs": [
              "Pool vault for token_1 to deposit into",
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaVault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "gammaVault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          }
        ],
        "args": [
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "amount0Min",
            "type": "u64"
          },
          {
            "name": "amount1Min",
            "type": "u64"
          },
          {
            "name": "maximumToken0Amount",
            "type": "u64"
          },
          {
            "name": "maximumToken1Amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "migrateRaydiumCpSwapToGamma",
        "docs": [
          "Migrate from Raydium Cpmm Swap to Gamma"
        ],
        "discriminator": [
          39,
          52,
          202,
          253,
          131,
          163,
          42,
          16
        ],
        "accounts": [
          {
            "name": "raydiumCpSwapProgram"
          },
          {
            "name": "owner",
            "docs": [
              "Owner of the liquidity provided"
            ],
            "writable": true,
            "signer": true
          },
          {
            "name": "raydiumCpSwapAuthority"
          },
          {
            "name": "raydiumCpSwapPoolState",
            "docs": [
              "Pool state account"
            ],
            "writable": true
          },
          {
            "name": "raydiumCpSwapOwnerLpToken",
            "docs": [
              "Owner lp token account"
            ],
            "writable": true
          },
          {
            "name": "raydiumCpSwapToken0Vault",
            "docs": [
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "raydiumCpSwapToken1Vault",
            "docs": [
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "raydiumCpSwapVault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "raydiumCpSwapVault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          },
          {
            "name": "raydiumCpSwapLpMint",
            "docs": [
              "Pool lp token mint"
            ],
            "writable": true
          },
          {
            "name": "memoProgram",
            "docs": [
              "memo program"
            ],
            "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          },
          {
            "name": "gammaOwner",
            "docs": [
              "Owner of the liquidity provided"
            ],
            "signer": true
          },
          {
            "name": "gammaAuthority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "gammaPoolState",
            "docs": [
              "Pool state the owner is depositing into"
            ],
            "writable": true
          },
          {
            "name": "gammaUserPoolLiquidity",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "gammaPoolState"
                },
                {
                  "kind": "account",
                  "path": "gammaOwner"
                }
              ]
            }
          },
          {
            "name": "gammaToken0Account",
            "docs": [
              "The payer's token account to deposit token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Account",
            "docs": [
              "The payer's token account to deposit token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaToken0Vault",
            "docs": [
              "Pool vault for token_0 to deposit into",
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "gammaToken1Vault",
            "docs": [
              "Pool vault for token_1 to deposit into",
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "gammaVault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ]
          },
          {
            "name": "gammaVault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ]
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          }
        ],
        "args": [
          {
            "name": "lpTokenAmountWithdraw",
            "type": "u64"
          },
          {
            "name": "minimumToken0Amount",
            "type": "u64"
          },
          {
            "name": "minimumToken1Amount",
            "type": "u64"
          },
          {
            "name": "maximumToken0Amount",
            "type": "u64"
          },
          {
            "name": "maximumToken1Amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "rebalanceKamino",
        "discriminator": [
          153,
          94,
          34,
          16,
          92,
          181,
          147,
          215
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "gammaAuthority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "poolState",
            "docs": [
              "The program account of the pool in which the swap will be performed"
            ],
            "writable": true
          },
          {
            "name": "tokenVault",
            "docs": [
              "The vault token account for token 0"
            ],
            "writable": true
          },
          {
            "name": "tokenMint",
            "writable": true
          },
          {
            "name": "kaminoReserve",
            "writable": true
          },
          {
            "name": "kaminoLendingMarket",
            "writable": true
          },
          {
            "name": "lendingMarketAuthority"
          },
          {
            "name": "reserveLiquiditySupply",
            "writable": true
          },
          {
            "name": "reserveCollateralMint",
            "writable": true
          },
          {
            "name": "gammaPoolDestinationCollateral",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    111,
                    111,
                    108,
                    95,
                    107,
                    97,
                    109,
                    105,
                    110,
                    111,
                    95,
                    100,
                    101,
                    112,
                    111,
                    115,
                    105,
                    116,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "tokenMint"
                }
              ]
            }
          },
          {
            "name": "instructionSysvarAccount",
            "address": "Sysvar1nstructions1111111111111111111111111"
          },
          {
            "name": "liquidityTokenProgram"
          },
          {
            "name": "collateralTokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "kaminoProgram",
            "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "swapBaseInput",
        "docs": [
          "Swap the tokens in the pool base input amount",
          "",
          "# Arguments",
          "",
          "* `ctx`- The context of accounts",
          "* `amount_in` -  input amount to transfer, output to DESTINATION is based on the exchange rate",
          "* `minimum_amount_out` -  Minimum amount of output token, prevents excessive slippage",
          ""
        ],
        "discriminator": [
          143,
          190,
          90,
          218,
          196,
          30,
          51,
          222
        ],
        "accounts": [
          {
            "name": "payer",
            "docs": [
              "The user performing the swap"
            ],
            "signer": true
          },
          {
            "name": "authority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "ammConfig",
            "docs": [
              "The factory state to read protocol fees"
            ]
          },
          {
            "name": "poolState",
            "docs": [
              "The program account of the pool in which the swap will be performed"
            ],
            "writable": true
          },
          {
            "name": "inputTokenAccount",
            "docs": [
              "The user token account for input token"
            ],
            "writable": true
          },
          {
            "name": "outputTokenAccount",
            "docs": [
              "The user token account for output token"
            ],
            "writable": true
          },
          {
            "name": "inputVault",
            "docs": [
              "The vault token account for input token"
            ],
            "writable": true
          },
          {
            "name": "outputVault",
            "docs": [
              "The vault token account for output token"
            ],
            "writable": true
          },
          {
            "name": "inputTokenProgram",
            "docs": [
              "SPL program for input token transfers"
            ]
          },
          {
            "name": "outputTokenProgram",
            "docs": [
              "SPL program for output token transfers"
            ]
          },
          {
            "name": "inputTokenMint",
            "docs": [
              "The mint of input token"
            ]
          },
          {
            "name": "outputTokenMint",
            "docs": [
              "The mint of output token"
            ]
          },
          {
            "name": "observationState",
            "docs": [
              "The program account for the most recent oracle observation"
            ],
            "writable": true
          }
        ],
        "args": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minimumAmountOut",
            "type": "u64"
          }
        ]
      },
      {
        "name": "swapBaseOutput",
        "docs": [
          "Swap the tokens in the pool base output amount",
          "",
          "# Arguments",
          "",
          "* `ctx`- The context of accounts",
          "* `max_amount_in` -  input amount prevents excessive slippage",
          "* `amount_out` -  amount of output token",
          ""
        ],
        "discriminator": [
          55,
          217,
          98,
          86,
          163,
          74,
          180,
          173
        ],
        "accounts": [
          {
            "name": "payer",
            "docs": [
              "The user performing the swap"
            ],
            "signer": true
          },
          {
            "name": "authority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "ammConfig",
            "docs": [
              "The factory state to read protocol fees"
            ]
          },
          {
            "name": "poolState",
            "docs": [
              "The program account of the pool in which the swap will be performed"
            ],
            "writable": true
          },
          {
            "name": "inputTokenAccount",
            "docs": [
              "The user token account for input token"
            ],
            "writable": true
          },
          {
            "name": "outputTokenAccount",
            "docs": [
              "The user token account for output token"
            ],
            "writable": true
          },
          {
            "name": "inputVault",
            "docs": [
              "The vault token account for input token"
            ],
            "writable": true
          },
          {
            "name": "outputVault",
            "docs": [
              "The vault token account for output token"
            ],
            "writable": true
          },
          {
            "name": "inputTokenProgram",
            "docs": [
              "SPL program for input token transfers"
            ]
          },
          {
            "name": "outputTokenProgram",
            "docs": [
              "SPL program for output token transfers"
            ]
          },
          {
            "name": "inputTokenMint",
            "docs": [
              "The mint of input token"
            ]
          },
          {
            "name": "outputTokenMint",
            "docs": [
              "The mint of output token"
            ]
          },
          {
            "name": "observationState",
            "docs": [
              "The program account for the most recent oracle observation"
            ],
            "writable": true
          }
        ],
        "args": [
          {
            "name": "maxAmountIn",
            "type": "u64"
          },
          {
            "name": "amountOut",
            "type": "u64"
          }
        ]
      },
      {
        "name": "updateAmmConfig",
        "docs": [
          "Updates the owner of the amm config",
          "Must be called by the current owner or admin",
          "",
          "# Arguments",
          "",
          "* `ctx`- The context of accounts",
          "* `trade_fee_rate`- The new trade fee rate of amm config, be set when `param` is 0",
          "* `protocol_fee_rate`- The new protocol fee rate of amm config, be set when `param` is 1",
          "* `fund_fee_rate`- The new fund fee rate of amm config, be set when `param` is 2",
          "* `new_owner`- The config's new owner, be set when `param` is 3",
          "* `new_fund_owner`- The config's new fund owner, be set when `param` is 4",
          "* `param`- The vaule can be 0 | 1 | 2 | 3 | 4, otherwise will report a error",
          ""
        ],
        "discriminator": [
          49,
          60,
          174,
          136,
          154,
          28,
          116,
          200
        ],
        "accounts": [
          {
            "name": "owner",
            "docs": [
              "The amm config owner or admin"
            ],
            "signer": true,
            "address": "9QcHinaHcJFdzSHeiF1yGchcuQk3qPFNV13q6dZJbAny"
          },
          {
            "name": "ammConfig",
            "docs": [
              "The amm config account to update"
            ],
            "writable": true
          }
        ],
        "args": [
          {
            "name": "param",
            "type": "u16"
          },
          {
            "name": "value",
            "type": "u64"
          }
        ]
      },
      {
        "name": "updatePool",
        "docs": [
          "Update pool status for given vaule",
          "",
          "# Arguments",
          "",
          "* `ctx`- The context of accounts",
          "* `param`- The param of pool status",
          "* `status` - The value",
          ""
        ],
        "discriminator": [
          239,
          214,
          170,
          78,
          36,
          35,
          30,
          34
        ],
        "accounts": [
          {
            "name": "authority",
            "signer": true
          },
          {
            "name": "poolState",
            "writable": true
          },
          {
            "name": "ammConfig"
          }
        ],
        "args": [
          {
            "name": "param",
            "type": "u32"
          },
          {
            "name": "value",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdraw",
        "docs": [
          "Withdraw lp for token0 ande token1",
          "",
          "# Arguments",
          "",
          "* `ctx`- The context of accounts",
          "* `lp_token_amount` - Amount of pool tokens to burn. User receives an output of token a and b based on the percentage of the pool tokens that are returned.",
          "* `minimum_token_0_amount` -  Minimum amount of token 0 to receive, prevents excessive slippage",
          "* `minimum_token_1_amount` -  Minimum amount of token 1 to receive, prevents excessive slippage",
          ""
        ],
        "discriminator": [
          183,
          18,
          70,
          156,
          148,
          109,
          161,
          34
        ],
        "accounts": [
          {
            "name": "owner",
            "docs": [
              "Owner of the liquidity provided"
            ],
            "signer": true
          },
          {
            "name": "authority",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116,
                    95,
                    97,
                    110,
                    100,
                    95,
                    108,
                    112,
                    95,
                    109,
                    105,
                    110,
                    116,
                    95,
                    97,
                    117,
                    116,
                    104,
                    95,
                    115,
                    101,
                    101,
                    100
                  ]
                }
              ]
            }
          },
          {
            "name": "poolState",
            "docs": [
              "Pool state account"
            ],
            "writable": true
          },
          {
            "name": "userPoolLiquidity",
            "docs": [
              "User pool liquidity account"
            ],
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    112,
                    111,
                    111,
                    108,
                    45,
                    108,
                    105,
                    113,
                    117,
                    105,
                    100,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "poolState"
                },
                {
                  "kind": "account",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "token0Account",
            "docs": [
              "The owner's token account for receive token_0"
            ],
            "writable": true
          },
          {
            "name": "token1Account",
            "docs": [
              "The owner's token account for receive token_1"
            ],
            "writable": true
          },
          {
            "name": "token0Vault",
            "docs": [
              "The address that holds pool tokens for token_0"
            ],
            "writable": true
          },
          {
            "name": "token1Vault",
            "docs": [
              "The address that holds pool tokens for token_1"
            ],
            "writable": true
          },
          {
            "name": "tokenProgram",
            "docs": [
              "token Program"
            ],
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "tokenProgram2022",
            "docs": [
              "Token program 2022"
            ],
            "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
          },
          {
            "name": "vault0Mint",
            "docs": [
              "The mint of token_0 vault"
            ],
            "writable": true
          },
          {
            "name": "vault1Mint",
            "docs": [
              "The mint of token_1 vault"
            ],
            "writable": true
          },
          {
            "name": "memoProgram",
            "docs": [
              "memo program"
            ],
            "address": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          },
          {
            "name": "kaminoProgram",
            "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
          },
          {
            "name": "instructionSysvarAccount",
            "address": "Sysvar1nstructions1111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "lpTokenAmount",
            "type": "u64"
          },
          {
            "name": "minimumToken0Amount",
            "type": "u64"
          },
          {
            "name": "minimumToken1Amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "ammConfig",
        "discriminator": [
          218,
          244,
          33,
          104,
          203,
          203,
          43,
          111
        ]
      },
      {
        "name": "observationState",
        "discriminator": [
          122,
          174,
          197,
          53,
          129,
          9,
          165,
          132
        ]
      },
      {
        "name": "poolState",
        "discriminator": [
          247,
          237,
          227,
          245,
          215,
          195,
          222,
          70
        ]
      },
      {
        "name": "rewardInfo",
        "discriminator": [
          39,
          7,
          129,
          22,
          241,
          96,
          83,
          133
        ]
      },
      {
        "name": "userPoolLiquidity",
        "discriminator": [
          0,
          141,
          89,
          29,
          236,
          6,
          14,
          15
        ]
      },
      {
        "name": "userRewardInfo",
        "discriminator": [
          110,
          57,
          251,
          139,
          250,
          236,
          213,
          178
        ]
      }
    ],
    "types": [
      {
        "name": "accountsType",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "transferHookA"
            },
            {
              "name": "transferHookB"
            },
            {
              "name": "transferHookReward"
            },
            {
              "name": "transferHookInput"
            },
            {
              "name": "transferHookIntermediate"
            },
            {
              "name": "transferHookOutput"
            },
            {
              "name": "supplementalTickArrays"
            },
            {
              "name": "supplementalTickArraysOne"
            },
            {
              "name": "supplementalTickArraysTwo"
            }
          ]
        }
      },
      {
        "name": "ammConfig",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "disableCreatePool",
              "type": "bool"
            },
            {
              "name": "index",
              "docs": [
                "Config index"
              ],
              "type": "u16"
            },
            {
              "name": "tradeFeeRate",
              "docs": [
                "The trade fee, denominated in hundredths of bip (10^-6)"
              ],
              "type": "u64"
            },
            {
              "name": "protocolFeeRate",
              "docs": [
                "The protocol fee"
              ],
              "type": "u64"
            },
            {
              "name": "fundFeeRate",
              "docs": [
                "The fund fee, denominated in hundredths of bip (10^-6)"
              ],
              "type": "u64"
            },
            {
              "name": "createPoolFee",
              "docs": [
                "Fee for creating a new pool"
              ],
              "type": "u64"
            },
            {
              "name": "protocolOwner",
              "docs": [
                "Address of the protocol fee owner"
              ],
              "type": "pubkey"
            },
            {
              "name": "fundOwner",
              "docs": [
                "Address of the fund fee owner"
              ],
              "type": "pubkey"
            },
            {
              "name": "referralProject",
              "docs": [
                "Address of the referral project"
              ],
              "type": "pubkey"
            },
            {
              "name": "maxOpenTime",
              "docs": [
                "Max open time for a pool in seconds"
              ],
              "type": "u64"
            },
            {
              "name": "secondaryAdmin",
              "type": "pubkey"
            },
            {
              "name": "padding",
              "docs": [
                "padding"
              ],
              "type": {
                "array": [
                  "u64",
                  7
                ]
              }
            }
          ]
        }
      },
      {
        "name": "binLiquidityReduction",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "binId",
              "type": "i32"
            },
            {
              "name": "bpsToRemove",
              "type": "u16"
            }
          ]
        }
      },
      {
        "name": "lpChangeEvent",
        "docs": [
          "Emitted when deposit or withdraw"
        ],
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "poolId",
              "type": "pubkey"
            },
            {
              "name": "lpAmountBefore",
              "type": "u64"
            },
            {
              "name": "token0VaultBefore",
              "type": "u64"
            },
            {
              "name": "token1VaultBefore",
              "type": "u64"
            },
            {
              "name": "token0Amount",
              "type": "u64"
            },
            {
              "name": "token1Amount",
              "type": "u64"
            },
            {
              "name": "token0TransferFee",
              "type": "u64"
            },
            {
              "name": "token1TransferFee",
              "type": "u64"
            },
            {
              "name": "changeType",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "migrationEvent",
        "docs": [
          "Emitted when migration"
        ],
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "fromPool",
              "type": "pubkey"
            },
            {
              "name": "toPool",
              "type": "pubkey"
            },
            {
              "name": "token0AmountWithdrawn",
              "type": "u64"
            },
            {
              "name": "token1AmountWithdrawn",
              "type": "u64"
            },
            {
              "name": "lpTokensMigrated",
              "type": "u128"
            }
          ]
        }
      },
      {
        "name": "observation",
        "docs": [
          "The element of observations in ObservationState"
        ],
        "serialization": "bytemuckunsafe",
        "repr": {
          "kind": "rust",
          "packed": true
        },
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "blockTimestamp",
              "docs": [
                "The block timestamp of the observation"
              ],
              "type": "u64"
            },
            {
              "name": "cumulativeToken0PriceX32",
              "docs": [
                "The cumulative of token0 price during the duration time, Q32.32, the remaining 64 bit for overflow"
              ],
              "type": "u128"
            },
            {
              "name": "cumulativeToken1PriceX32",
              "docs": [
                "The cumulative of token1 price during the duration time, Q32.32, the remaining 64 bit for overflow"
              ],
              "type": "u128"
            }
          ]
        }
      },
      {
        "name": "observationState",
        "serialization": "bytemuckunsafe",
        "repr": {
          "kind": "rust",
          "packed": true
        },
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "initialized",
              "docs": [
                "Whether the ObservationState is enabled"
              ],
              "type": "bool"
            },
            {
              "name": "observationIndex",
              "docs": [
                "The most recently updated index of the observations array"
              ],
              "type": "u16"
            },
            {
              "name": "poolId",
              "type": "pubkey"
            },
            {
              "name": "observations",
              "docs": [
                "observation array"
              ],
              "type": {
                "array": [
                  {
                    "defined": {
                      "name": "observation"
                    }
                  },
                  100
                ]
              }
            },
            {
              "name": "padding",
              "docs": [
                "padding"
              ],
              "type": {
                "array": [
                  "u64",
                  4
                ]
              }
            }
          ]
        }
      },
      {
        "name": "partnerInfo",
        "serialization": "bytemuckunsafe",
        "repr": {
          "kind": "rust",
          "packed": true
        },
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "partnerId",
              "type": "u64"
            },
            {
              "name": "lpTokenLinkedWithPartner",
              "type": "u64"
            },
            {
              "name": "cumulativeFeeTotalTimesTvlShareToken0",
              "type": "u64"
            },
            {
              "name": "cumulativeFeeTotalTimesTvlShareToken1",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "partnerType",
        "repr": {
          "kind": "rust"
        },
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "assetDash"
            }
          ]
        }
      },
      {
        "name": "poolState",
        "serialization": "bytemuckunsafe",
        "repr": {
          "kind": "rust",
          "packed": true
        },
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "ammConfig",
              "docs": [
                "To which AmmConfig the pool belongs to"
              ],
              "type": "pubkey"
            },
            {
              "name": "poolCreator",
              "docs": [
                "Pool Creator"
              ],
              "type": "pubkey"
            },
            {
              "name": "token0Vault",
              "docs": [
                "Vault to store Token A of the pool"
              ],
              "type": "pubkey"
            },
            {
              "name": "token1Vault",
              "docs": [
                "Vault to store Token B of the pool"
              ],
              "type": "pubkey"
            },
            {
              "name": "padding1",
              "docs": [
                "Pool tokens are issued when Token A or Token B are deposited",
                "Pool tokens can be withdrawn back to the original Token A or Token B"
              ],
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "token0Mint",
              "docs": [
                "Mint info of Token A"
              ],
              "type": "pubkey"
            },
            {
              "name": "token1Mint",
              "docs": [
                "Mint info of Token B"
              ],
              "type": "pubkey"
            },
            {
              "name": "token0Program",
              "docs": [
                "token_0 program"
              ],
              "type": "pubkey"
            },
            {
              "name": "token1Program",
              "docs": [
                "token1Program"
              ],
              "type": "pubkey"
            },
            {
              "name": "observationKey",
              "docs": [
                "Observation account to store the oracle data"
              ],
              "type": "pubkey"
            },
            {
              "name": "authBump",
              "type": "u8"
            },
            {
              "name": "status",
              "docs": [
                "Bitwise represenation of the state of the pool",
                "Bit0: 1 - Disable Deposit(value will be 1), 0 - Deposit can be done(normal)",
                "Bit1: 1 - Disable Withdraw(value will be 2), 0 - Withdraw can be done(normal)",
                "Bit2: 1 - Disable Swap(value will be 4), 0 - Swap can be done(normal)"
              ],
              "type": "u8"
            },
            {
              "name": "padding2",
              "docs": [
                "lp_mint decimals"
              ],
              "type": "u8"
            },
            {
              "name": "mint0Decimals",
              "docs": [
                "mint0 and mint1 decimals"
              ],
              "type": "u8"
            },
            {
              "name": "mint1Decimals",
              "type": "u8"
            },
            {
              "name": "lpSupply",
              "docs": [
                "True circulating supply of lp_mint tokens without burns and lock-ups"
              ],
              "type": "u64"
            },
            {
              "name": "protocolFeesToken0",
              "docs": [
                "The amount of token_0 and token_1 owed to Liquidity Provider"
              ],
              "type": "u64"
            },
            {
              "name": "protocolFeesToken1",
              "type": "u64"
            },
            {
              "name": "fundFeesToken0",
              "type": "u64"
            },
            {
              "name": "fundFeesToken1",
              "type": "u64"
            },
            {
              "name": "openTime",
              "docs": [
                "The timestamp allowed for swap in the pool"
              ],
              "type": "u64"
            },
            {
              "name": "recentEpoch",
              "docs": [
                "recent epoch"
              ],
              "type": "u64"
            },
            {
              "name": "cumulativeTradeFeesToken0",
              "docs": [
                "Trade fees of token_0 after every swap"
              ],
              "type": "u128"
            },
            {
              "name": "cumulativeTradeFeesToken1",
              "docs": [
                "Trade fees of token_1 after every swap"
              ],
              "type": "u128"
            },
            {
              "name": "cumulativeVolumeToken0",
              "docs": [
                "Cummulative volume of token_0"
              ],
              "type": "u128"
            },
            {
              "name": "cumulativeVolumeToken1",
              "docs": [
                "Cummulative volume of token_1"
              ],
              "type": "u128"
            },
            {
              "name": "latestDynamicFeeRate",
              "docs": [
                "latest dynamic fee rate"
              ],
              "type": "u64"
            },
            {
              "name": "maxTradeFeeRate",
              "type": "u64"
            },
            {
              "name": "volatilityFactor",
              "type": "u64"
            },
            {
              "name": "token0VaultAmount",
              "type": "u64"
            },
            {
              "name": "token1VaultAmount",
              "type": "u64"
            },
            {
              "name": "maxSharedToken0",
              "type": "u64"
            },
            {
              "name": "maxSharedToken1",
              "type": "u64"
            },
            {
              "name": "partners",
              "type": {
                "array": [
                  {
                    "defined": {
                      "name": "partnerInfo"
                    }
                  },
                  1
                ]
              }
            },
            {
              "name": "token0AmountInKamino",
              "type": "u64"
            },
            {
              "name": "token1AmountInKamino",
              "type": "u64"
            },
            {
              "name": "withdrawnKaminoProfitToken0",
              "type": "u64"
            },
            {
              "name": "withdrawnKaminoProfitToken1",
              "type": "u64"
            },
            {
              "name": "padding",
              "docs": [
                "padding"
              ],
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            }
          ]
        }
      },
      {
        "name": "remainingAccountsInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "slices",
              "type": {
                "vec": {
                  "defined": {
                    "name": "remainingAccountsSlice"
                  }
                }
              }
            }
          ]
        }
      },
      {
        "name": "remainingAccountsSlice",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "accountsType",
              "type": {
                "defined": {
                  "name": "accountsType"
                }
              }
            },
            {
              "name": "length",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "rewardInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "pool",
              "type": "pubkey"
            },
            {
              "name": "startAt",
              "type": "u64"
            },
            {
              "name": "endRewardsAt",
              "type": "u64"
            },
            {
              "name": "mint",
              "type": "pubkey"
            },
            {
              "name": "totalToDisburse",
              "type": "u64"
            },
            {
              "name": "rewardedBy",
              "type": "pubkey"
            }
          ]
        }
      },
      {
        "name": "swapEvent",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "poolId",
              "type": "pubkey"
            },
            {
              "name": "inputVaultBefore",
              "docs": [
                "pool vault - trade_fees"
              ],
              "type": "u64"
            },
            {
              "name": "outputVaultBefore",
              "docs": [
                "pool_vault - trade_fees"
              ],
              "type": "u64"
            },
            {
              "name": "inputAmount",
              "docs": [
                "calculate result without transfer fees"
              ],
              "type": "u64"
            },
            {
              "name": "outputAmount",
              "docs": [
                "calculate result without transfer fees"
              ],
              "type": "u64"
            },
            {
              "name": "inputMint",
              "docs": [
                "input mint for the swap"
              ],
              "type": "pubkey"
            },
            {
              "name": "outputMint",
              "docs": [
                "output mint for the swap"
              ],
              "type": "pubkey"
            },
            {
              "name": "inputTransferFee",
              "docs": [
                "transfer fees on input token using token extensions"
              ],
              "type": "u64"
            },
            {
              "name": "outputTransferFee",
              "docs": [
                "transfer fees on output token using token extensions"
              ],
              "type": "u64"
            },
            {
              "name": "baseInput",
              "type": "bool"
            },
            {
              "name": "dynamicFee",
              "docs": [
                "dynamic_fees after this swap"
              ],
              "type": "u128"
            }
          ]
        }
      },
      {
        "name": "userPoolLiquidity",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "user",
              "type": "pubkey"
            },
            {
              "name": "poolState",
              "type": "pubkey"
            },
            {
              "name": "token0Deposited",
              "type": "u128"
            },
            {
              "name": "token1Deposited",
              "type": "u128"
            },
            {
              "name": "token0Withdrawn",
              "type": "u128"
            },
            {
              "name": "token1Withdrawn",
              "type": "u128"
            },
            {
              "name": "lpTokensOwned",
              "type": "u128"
            },
            {
              "name": "partner",
              "type": {
                "option": {
                  "defined": {
                    "name": "partnerType"
                  }
                }
              }
            },
            {
              "name": "padding",
              "type": {
                "array": [
                  "u8",
                  23
                ]
              }
            }
          ]
        }
      },
      {
        "name": "userRewardInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "user",
              "type": "pubkey"
            },
            {
              "name": "rewardInfo",
              "type": "pubkey"
            },
            {
              "name": "poolState",
              "type": "pubkey"
            },
            {
              "name": "totalClaimed",
              "type": "u64"
            },
            {
              "name": "totalRewards",
              "type": "u64"
            },
            {
              "name": "rewardsLastCalculatedAt",
              "type": "u64"
            }
          ]
        }
      }
    ]
  };
  