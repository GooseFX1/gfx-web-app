/* eslint-disable */
export type Gamma = {
  'version': '0.1.0',
  'name': 'gamma',
  'instructions': [
    {
      'name': 'createAmmConfig',
      'docs': [
        '# Arguments',
        '',
        '* `ctx`- The accounts needed by instruction.',
        '* `index` - The index of amm config, there may be multiple config.',
        '* `trade_fee_rate` - Trade fee rate, can be changed.',
        '* `protocol_fee_rate` - The rate of protocol fee within tarde fee.',
        '* `fund_fee_rate` - The rate of fund fee within tarde fee.',
        ''
      ],
      'accounts': [
        {
          'name': 'owner',
          'isMut': true,
          'isSigner': true,
          'docs': [
            'Address to be set as protocol owner.'
          ]
        },
        {
          'name': 'ammConfig',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Initialize AmmConfig state account to store protocol owner address and fee rates'
          ]
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'index',
          'type': 'u16'
        },
        {
          'name': 'tradeFeeRate',
          'type': 'u64'
        },
        {
          'name': 'protocolFeeRate',
          'type': 'u64'
        },
        {
          'name': 'fundFeeRate',
          'type': 'u64'
        },
        {
          'name': 'createPoolFee',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'updateAmmConfig',
      'docs': [
        'Updates the owner of the amm config',
        'Must be called by the current owner or admin',
        '',
        '# Arguments',
        '',
        '* `ctx`- The context of accounts',
        '* `trade_fee_rate`- The new trade fee rate of amm config, be set when `param` is 0',
        '* `protocol_fee_rate`- The new protocol fee rate of amm config, be set when `param` is 1',
        '* `fund_fee_rate`- The new fund fee rate of amm config, be set when `param` is 2',
        '* `new_owner`- The config\'s new owner, be set when `param` is 3',
        '* `new_fund_owner`- The config\'s new fund owner, be set when `param` is 4',
        '* `param`- The vaule can be 0 | 1 | 2 | 3 | 4, otherwise will report a error',
        ''
      ],
      'accounts': [
        {
          'name': 'owner',
          'isMut': false,
          'isSigner': true,
          'docs': [
            'The amm config owner or admin'
          ]
        },
        {
          'name': 'ammConfig',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The amm config account to update'
          ]
        }
      ],
      'args': [
        {
          'name': 'param',
          'type': 'u8'
        },
        {
          'name': 'value',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'updatePoolStatus',
      'docs': [
        'Update pool status for given vaule',
        '',
        '# Arguments',
        '',
        '* `ctx`- The context of accounts',
        '* `status` - The vaule of status',
        ''
      ],
      'accounts': [
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'poolState',
          'isMut': true,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'status',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'collectProtocolFee',
      'docs': [
        'Collect the protocol fee accrued to the pool',
        '',
        '# Arguments',
        '',
        '* `ctx` - The context of accounts',
        '* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1',
        '* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0',
        ''
      ],
      'accounts': [
        {
          'name': 'owner',
          'isMut': false,
          'isSigner': true,
          'docs': [
            'Only admin or owner can collect fee now'
          ]
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'poolState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Pool state stores accumulated protocol fee amount'
          ]
        },
        {
          'name': 'ammConfig',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Amm config account stores owner'
          ]
        },
        {
          'name': 'token0Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that holds pool tokens for token_0'
          ]
        },
        {
          'name': 'token1Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that holds pool tokens for token_1'
          ]
        },
        {
          'name': 'vault0Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of token_0 vault'
          ]
        },
        {
          'name': 'vault1Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of token_1 vault'
          ]
        },
        {
          'name': 'recipientToken0Account',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that receives the collected token_0 protocol fees'
          ]
        },
        {
          'name': 'recipientToken1Account',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that receives the collected token_1 protocol fees'
          ]
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The SPL program to perform token transfers'
          ]
        },
        {
          'name': 'tokenProgram2022',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The SPL program 2022 to perform token transfers'
          ]
        }
      ],
      'args': [
        {
          'name': 'amount0Requested',
          'type': 'u64'
        },
        {
          'name': 'amount1Requested',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'collectFundFee',
      'docs': [
        'Collect the fund fee accrued to the pool',
        '',
        '# Arguments',
        '',
        '* `ctx` - The context of accounts',
        '* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1',
        '* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0',
        ''
      ],
      'accounts': [
        {
          'name': 'owner',
          'isMut': false,
          'isSigner': true,
          'docs': [
            'Only admin or fund_owner can collect fee now'
          ]
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'poolState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Pool state stores accumulated protocol fee amount'
          ]
        },
        {
          'name': 'ammConfig',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Amm config account stores fund_owner'
          ]
        },
        {
          'name': 'token0Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that holds pool tokens for token_0'
          ]
        },
        {
          'name': 'token1Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that holds pool tokens for token_1'
          ]
        },
        {
          'name': 'vault0Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of token_0 vault'
          ]
        },
        {
          'name': 'vault1Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of token_1 vault'
          ]
        },
        {
          'name': 'recipientToken0Account',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that receives the collected token_0 fund fees'
          ]
        },
        {
          'name': 'recipientToken1Account',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that receives the collected token_1 fund fees'
          ]
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The SPL program to perform token transfers'
          ]
        },
        {
          'name': 'tokenProgram2022',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The SPL program 2022 to perform token transfers'
          ]
        }
      ],
      'args': [
        {
          'name': 'amount0Requested',
          'type': 'u64'
        },
        {
          'name': 'amount1Requested',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'initialize',
      'docs': [
        'Creates a pool for the given token pair and the initial price',
        '',
        '# Arguments',
        '',
        '* `ctx`- The context of accounts',
        '* `init_amount_0` - the initial amount_0 to deposit',
        '* `init_amount_1` - the initial amount_1 to deposit',
        '* `open_time` - the timestamp allowed for swap',
        ''
      ],
      'accounts': [
        {
          'name': 'creator',
          'isMut': true,
          'isSigner': true,
          'docs': [
            'Address paying to create the pool. It can be anyone.'
          ]
        },
        {
          'name': 'ammConfig',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Which amm config the pool belongs to'
          ]
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'sign transactions on behalf of the pool',
            'for vault and lp_mint'
          ]
        },
        {
          'name': 'poolState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Initialize an account to store the pool state'
          ]
        },
        {
          'name': 'token0Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Token_0 mint, the key must smaller than token_1 mint.'
          ]
        },
        {
          'name': 'token1Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Token_1 mint, the key must greater than token_0 mint.'
          ]
        },
        {
          'name': 'creatorToken0',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'creator token 0 account'
          ]
        },
        {
          'name': 'creatorToken1',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'creator token 1 account'
          ]
        },
        {
          'name': 'token0Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'creator lp token account'
          ]
        },
        {
          'name': 'token1Vault',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'createPoolFee',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'create pool fee account'
          ]
        },
        {
          'name': 'observationState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'an account to store oracle observations'
          ]
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Program to create mint account and mint tokens'
          ]
        },
        {
          'name': 'token0Program',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Spl token program or token program 2022'
          ]
        },
        {
          'name': 'token1Program',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Spl token program or token program 2022'
          ]
        },
        {
          'name': 'associatedTokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Program to create an ATA for receiving position NFT'
          ]
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'To create a new program account'
          ]
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Sysvar for program account'
          ]
        }
      ],
      'args': [
        {
          'name': 'initAmount0',
          'type': 'u64'
        },
        {
          'name': 'initAmount1',
          'type': 'u64'
        },
        {
          'name': 'openTime',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'initUserPoolLiquidity',
      'accounts': [
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'poolState',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'userPoolLiquidity',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'To create a new program account'
          ]
        }
      ],
      'args': []
    },
    {
      'name': 'deposit',
      'docs': [
        'Creates a pool for the given token pair and the initial price',
        '',
        '# Arguments',
        '',
        '* `ctx`- The context of accounts',
        '* `lp_token_amount` - Pool token amount to transfer. token_a and token_b amount are set by the current exchange rate and size of the pool',
        '* `maximum_token_0_amount` -  Maximum token 0 amount to deposit, prevents excessive slippage',
        '* `maximum_token_1_amount` - Maximum token 1 amount to deposit, prevents excessive slippage',
        ''
      ],
      'accounts': [
        {
          'name': 'owner',
          'isMut': false,
          'isSigner': true,
          'docs': [
            'Pays to mint the position'
          ]
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'poolState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Pool state the owner is depositing into'
          ]
        },
        {
          'name': 'userPoolLiquidity',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'token0Account',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The payer\'s token account to deposit token_0'
          ]
        },
        {
          'name': 'token1Account',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The payer\'s token account to deposit token_1'
          ]
        },
        {
          'name': 'token0Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Pool vault for token_0 to deposit into',
            'The address that holds pool tokens for token_0'
          ]
        },
        {
          'name': 'token1Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Pool vault for token_1 to deposit into',
            'The address that holds pool tokens for token_1'
          ]
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'token Program'
          ]
        },
        {
          'name': 'tokenProgram2022',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Token program 2022'
          ]
        },
        {
          'name': 'vault0Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of token_0 vault'
          ]
        },
        {
          'name': 'vault1Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of token_1 vault'
          ]
        }
      ],
      'args': [
        {
          'name': 'lpTokenAmount',
          'type': 'u64'
        },
        {
          'name': 'maximumToken0Amount',
          'type': 'u64'
        },
        {
          'name': 'maximumToken1Amount',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'withdraw',
      'docs': [
        'Withdraw lp for token0 ande token1',
        '',
        '# Arguments',
        '',
        '* `ctx`- The context of accounts',
        '* `lp_token_amount` - Amount of pool tokens to burn. User receives an output of token a and b based on the percentage of the pool tokens that are returned.',
        '* `minimum_token_0_amount` -  Minimum amount of token 0 to receive, prevents excessive slippage',
        '* `minimum_token_1_amount` -  Minimum amount of token 1 to receive, prevents excessive slippage',
        ''
      ],
      'accounts': [
        {
          'name': 'owner',
          'isMut': false,
          'isSigner': true,
          'docs': [
            'Pays to mint the position'
          ]
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'poolState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Pool state account'
          ]
        },
        {
          'name': 'userPoolLiquidity',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'Owner lp token account',
            'User pool liquidity account'
          ]
        },
        {
          'name': 'token0Account',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The owner\'s token account for receive token_0'
          ]
        },
        {
          'name': 'token1Account',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The owner\'s token account for receive token_1'
          ]
        },
        {
          'name': 'token0Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that holds pool tokens for token_0'
          ]
        },
        {
          'name': 'token1Vault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The address that holds pool tokens for token_1'
          ]
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'token Program'
          ]
        },
        {
          'name': 'tokenProgram2022',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Token program 2022'
          ]
        },
        {
          'name': 'vault0Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of token_0 vault'
          ]
        },
        {
          'name': 'vault1Mint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of token_1 vault'
          ]
        },
        {
          'name': 'memoProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'Pool lp token mint',
            'memo program'
          ]
        }
      ],
      'args': [
        {
          'name': 'lpTokenAmount',
          'type': 'u64'
        },
        {
          'name': 'minimumToken0Amount',
          'type': 'u64'
        },
        {
          'name': 'minimumToken1Amount',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'swapBaseInput',
      'docs': [
        'Swap the tokens in the pool base input amount',
        '',
        '# Arguments',
        '',
        '* `ctx`- The context of accounts',
        '* `amount_in` -  input amount to transfer, output to DESTINATION is based on the exchange rate',
        '* `minimum_amount_out` -  Minimum amount of output token, prevents excessive slippage',
        ''
      ],
      'accounts': [
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true,
          'docs': [
            'The user performing the swap'
          ]
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'ammConfig',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The factory state to read protocol fees'
          ]
        },
        {
          'name': 'poolState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The program account of the pool in which the swap will be performed'
          ]
        },
        {
          'name': 'inputTokenAccount',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The user token account for input token'
          ]
        },
        {
          'name': 'outputTokenAccount',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The user token account for output token'
          ]
        },
        {
          'name': 'inputVault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The vault token account for input token'
          ]
        },
        {
          'name': 'outputVault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The vault token account for output token'
          ]
        },
        {
          'name': 'inputTokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'SPL program for input token transfers'
          ]
        },
        {
          'name': 'outputTokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'SPL program for output token transfers'
          ]
        },
        {
          'name': 'inputTokenMint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of input token'
          ]
        },
        {
          'name': 'outputTokenMint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of output token'
          ]
        },
        {
          'name': 'observationState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The program account for the most recent oracle observation'
          ]
        }
      ],
      'args': [
        {
          'name': 'amountIn',
          'type': 'u64'
        },
        {
          'name': 'minimumAmountOut',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'swapBaseOutput',
      'docs': [
        'Swap the tokens in the pool base output amount',
        '',
        '# Arguments',
        '',
        '* `ctx`- The context of accounts',
        '* `max_amount_in` -  input amount prevents excessive slippage',
        '* `amount_out` -  amount of output token',
        ''
      ],
      'accounts': [
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true,
          'docs': [
            'The user performing the swap'
          ]
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'ammConfig',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The factory state to read protocol fees'
          ]
        },
        {
          'name': 'poolState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The program account of the pool in which the swap will be performed'
          ]
        },
        {
          'name': 'inputTokenAccount',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The user token account for input token'
          ]
        },
        {
          'name': 'outputTokenAccount',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The user token account for output token'
          ]
        },
        {
          'name': 'inputVault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The vault token account for input token'
          ]
        },
        {
          'name': 'outputVault',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The vault token account for output token'
          ]
        },
        {
          'name': 'inputTokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'SPL program for input token transfers'
          ]
        },
        {
          'name': 'outputTokenProgram',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'SPL program for output token transfers'
          ]
        },
        {
          'name': 'inputTokenMint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of input token'
          ]
        },
        {
          'name': 'outputTokenMint',
          'isMut': false,
          'isSigner': false,
          'docs': [
            'The mint of output token'
          ]
        },
        {
          'name': 'observationState',
          'isMut': true,
          'isSigner': false,
          'docs': [
            'The program account for the most recent oracle observation'
          ]
        }
      ],
      'args': [
        {
          'name': 'maxAmountIn',
          'type': 'u64'
        },
        {
          'name': 'amountOut',
          'type': 'u64'
        }
      ]
    }
  ],
  'accounts': [
    {
      'name': 'ammConfig',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'disableCreatePool',
            'type': 'bool'
          },
          {
            'name': 'index',
            'docs': [
              'Config index'
            ],
            'type': 'u16'
          },
          {
            'name': 'tradeFeeRate',
            'docs': [
              'The trade fee, denominated in hundredths of bip (10^-6)'
            ],
            'type': 'u64'
          },
          {
            'name': 'protocolFeeRate',
            'docs': [
              'The protocol fee'
            ],
            'type': 'u64'
          },
          {
            'name': 'fundFeeRate',
            'docs': [
              'The fund fee, denominated in hundredths of bip (10^-6)'
            ],
            'type': 'u64'
          },
          {
            'name': 'createPoolFee',
            'docs': [
              'Fee for creating a new pool'
            ],
            'type': 'u64'
          },
          {
            'name': 'protocolOwner',
            'docs': [
              'Address of the protocol fee owner'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'fundOwner',
            'docs': [
              'Address of the fund fee owner'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'padding',
            'docs': [
              'padding'
            ],
            'type': {
              'array': [
                'u64',
                16
              ]
            }
          }
        ]
      }
    },
    {
      'name': 'observationState',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'initialized',
            'docs': [
              'Whether the ObservationState is enabled'
            ],
            'type': 'bool'
          },
          {
            'name': 'observationIndex',
            'docs': [
              'The most recently updated index of the observations array'
            ],
            'type': 'u16'
          },
          {
            'name': 'poolId',
            'type': 'publicKey'
          },
          {
            'name': 'observations',
            'docs': [
              'observation array'
            ],
            'type': {
              'array': [
                {
                  'defined': 'Observation'
                },
                100
              ]
            }
          },
          {
            'name': 'padding',
            'docs': [
              'padding'
            ],
            'type': {
              'array': [
                'u64',
                4
              ]
            }
          }
        ]
      }
    },
    {
      'name': 'poolState',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'ammConfig',
            'docs': [
              'To which AmmConfig the pool belongs to'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'poolCreator',
            'docs': [
              'Pool Creator'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'token0Vault',
            'docs': [
              'Vault to store Token A of the pool'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'token1Vault',
            'docs': [
              'Vault to store Token B of the pool'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'padding1',
            'docs': [
              'Pool tokens are issued when Token A or Token B are deposited',
              'Pool tokens can be withdrawn back to the original Token A or Token B'
            ],
            'type': {
              'array': [
                'u8',
                32
              ]
            }
          },
          {
            'name': 'token0Mint',
            'docs': [
              'Mint info of Token A'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'token1Mint',
            'docs': [
              'Mint info of Token B'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'token0Program',
            'docs': [
              'token_0 program'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'token1Program',
            'docs': [
              'token_1_program'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'observationKey',
            'docs': [
              'Observation account to store the oracle data'
            ],
            'type': 'publicKey'
          },
          {
            'name': 'authBump',
            'type': 'u8'
          },
          {
            'name': 'status',
            'docs': [
              'Bitwise represenation of the state of the pool',
              'Bit0: 1 - Disable Deposit(value will be 1), 0 - Deposit can be done(normal)',
              'Bit1: 1 - Disable Withdraw(value will be 2), 0 - Withdraw can be done(normal)',
              'Bit2: 1 - Disable Swap(value will be 4), 0 - Swap can be done(normal)'
            ],
            'type': 'u8'
          },
          {
            'name': 'padding2',
            'docs': [
              'lp_mint decimals'
            ],
            'type': 'u8'
          },
          {
            'name': 'mint0Decimals',
            'docs': [
              'mint0 and mint1 decimals'
            ],
            'type': 'u8'
          },
          {
            'name': 'mint1Decimals',
            'type': 'u8'
          },
          {
            'name': 'lpSupply',
            'docs': [
              'True circulating supply of lp_mint tokens without burns and lock-ups'
            ],
            'type': 'u64'
          },
          {
            'name': 'protocolFeesToken0',
            'docs': [
              'The amount of token_0 and token_1 owed to Liquidity Provider'
            ],
            'type': 'u64'
          },
          {
            'name': 'protocolFeesToken1',
            'type': 'u64'
          },
          {
            'name': 'fundFeesToken0',
            'type': 'u64'
          },
          {
            'name': 'fundFeesToken1',
            'type': 'u64'
          },
          {
            'name': 'openTime',
            'docs': [
              'The timestamp allowed for swap in the pool'
            ],
            'type': 'u64'
          },
          {
            'name': 'recentEpoch',
            'docs': [
              'recent epoch'
            ],
            'type': 'u64'
          },
          {
            'name': 'cumulativeTradeFeesToken0',
            'docs': [
              'Trade fees of token_0 after every swap'
            ],
            'type': 'u128'
          },
          {
            'name': 'cumulativeTradeFeesToken1',
            'docs': [
              'Trade fees of token_1 after every swap'
            ],
            'type': 'u128'
          },
          {
            'name': 'cumulativeVolumeToken0',
            'docs': [
              'Cummulative volume of token_0'
            ],
            'type': 'u128'
          },
          {
            'name': 'cumulativeVolumeToken1',
            'docs': [
              'Cummulative volume of token_1'
            ],
            'type': 'u128'
          },
          {
            'name': 'filterPeriod',
            'docs': [
              'Filter period determine high frequency trading time window.'
            ],
            'type': 'u32'
          },
          {
            'name': 'decayPeriod',
            'docs': [
              'Decay period determine when the volatile fee start decay / decrease.'
            ],
            'type': 'u32'
          },
          {
            'name': 'reductionFactor',
            'docs': [
              'Reduction factor controls the volatile fee rate decrement rate.'
            ],
            'type': 'u32'
          },
          {
            'name': 'variableFeeControl',
            'docs': [
              'Used to scale the variable fee component depending on the dynamic of the market'
            ],
            'type': 'u32'
          },
          {
            'name': 'volatilityV2BaseFee',
            'type': 'u64'
          },
          {
            'name': 'volatilityV2MaxFee',
            'type': 'u64'
          },
          {
            'name': 'volatilityV2VolatilityFactor',
            'type': 'u64'
          },
          {
            'name': 'volatilityV2ImbalanceFactor',
            'type': 'u64'
          },
          {
            'name': 'padding',
            'docs': [
              'padding'
            ],
            'type': {
              'array': [
                'u64',
                17
              ]
            }
          }
        ]
      }
    },
    {
      'name': 'userPoolLiquidity',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'user',
            'type': 'publicKey'
          },
          {
            'name': 'poolState',
            'type': 'publicKey'
          },
          {
            'name': 'token0Deposited',
            'type': 'u128'
          },
          {
            'name': 'token1Deposited',
            'type': 'u128'
          },
          {
            'name': 'token0Withdrawn',
            'type': 'u128'
          },
          {
            'name': 'token1Withdrawn',
            'type': 'u128'
          },
          {
            'name': 'lpTokensOwned',
            'type': 'u128'
          },
          {
            'name': 'referrer',
            'type': 'publicKey'
          }
        ]
      }
    }
  ],
  'types': [
    {
      'name': 'Observation',
      'docs': [
        'The element of observations in ObservationState'
      ],
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'blockTimestamp',
            'docs': [
              'The block timestamp of the observation'
            ],
            'type': 'u64'
          },
          {
            'name': 'cumulativeToken0PriceX32',
            'docs': [
              'The cumulative of token0 price during the duration time, Q32.32, the remaining 64 bit for overflow'
            ],
            'type': 'u128'
          },
          {
            'name': 'cumulativeToken1PriceX32',
            'docs': [
              'The cumulative of token1 price during the duration time, Q32.32, the remaining 64 bit for overflow'
            ],
            'type': 'u128'
          }
        ]
      }
    },
    {
      'name': 'TradeDirection',
      'docs': [
        'The direction of a trade, since curves can be specialized to treat each',
        'token differently (by adding offsets or weights)'
      ],
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'ZeroForOne'
          },
          {
            'name': 'OneForZero'
          }
        ]
      }
    },
    {
      'name': 'RoundDirection',
      'docs': [
        'The direction to round.  Used for pool token to trading token conversions to',
        'avoid losing value on any deposit or withdrawal.'
      ],
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'Floor'
          },
          {
            'name': 'Ceiling'
          }
        ]
      }
    },
    {
      'name': 'FeeType',
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'Volatility'
          },
          {
            'name': 'VolatilityV2'
          },
          {
            'name': 'Rebalancing'
          },
          {
            'name': 'Combined'
          }
        ]
      }
    },
    {
      'name': 'PoolStatusBitIndex',
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'Deposit'
          },
          {
            'name': 'Withdraw'
          },
          {
            'name': 'Swap'
          }
        ]
      }
    },
    {
      'name': 'PoolStatusBitFlag',
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'Enable'
          },
          {
            'name': 'Disable'
          }
        ]
      }
    }
  ],
  'events': [
    {
      'name': 'LpChangeEvent',
      'fields': [
        {
          'name': 'poolId',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'lpAmountBefore',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'token0VaultBefore',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'token1VaultBefore',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'token0Amount',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'token1Amount',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'token0TransferFee',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'token1TransferFee',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'changeType',
          'type': 'u8',
          'index': false
        }
      ]
    },
    {
      'name': 'SwapEvent',
      'fields': [
        {
          'name': 'poolId',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'inputVaultBefore',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'outputVaultBefore',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'inputAmount',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'outputAmount',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'inputTransferFee',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'outputTransferFee',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'baseInput',
          'type': 'bool',
          'index': false
        }
      ]
    }
  ],
  'errors': [
    {
      'code': 6000,
      'name': 'NotApproved',
      'msg': 'Not approved'
    },
    {
      'code': 6001,
      'name': 'InvalidOwner',
      'msg': 'Input account owner is not the program address'
    },
    {
      'code': 6002,
      'name': 'EmptySupply',
      'msg': 'Input token account empty'
    },
    {
      'code': 6003,
      'name': 'InvalidInput',
      'msg': 'InvalidInput'
    },
    {
      'code': 6004,
      'name': 'IncorrectLpMint',
      'msg': 'Address of the provided lp token mint is incorrect'
    },
    {
      'code': 6005,
      'name': 'ExceededSlippage',
      'msg': 'Exceeds desired slippage limit'
    },
    {
      'code': 6006,
      'name': 'ZeroTradingTokens',
      'msg': 'Given pool token amount results in zero trading tokens'
    },
    {
      'code': 6007,
      'name': 'NotSupportMint',
      'msg': 'Not support token_2022 mint extension'
    },
    {
      'code': 6008,
      'name': 'InvalidVault',
      'msg': 'invaild vault'
    },
    {
      'code': 6009,
      'name': 'InitLpAmountTooLess',
      'msg': 'Init lp amount is too less(Because 100 amount lp will be locked)'
    },
    {
      'code': 6010,
      'name': 'MathError',
      'msg': 'Math error'
    }
  ]
};
