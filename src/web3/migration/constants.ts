import { BN } from 'bn.js'
import { IDL } from './meteora/dlmm_idl'

// Raydium CPMM CONSTANTS:
export const RAYDIUM_CPMM_PROGRAM_ID = 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C'
export const RAYDIUM_CPMM_FEE_RECEIVER = 'DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8'
export const RAYDIUM_CPMM_POOL_VAULT_SEED = 'pool_vault'
export const RAYDIUM_CPMM_AUTHORITY_SEED = 'vault_and_lp_mint_auth_seed'
export const RAYDIUM_CPMM_AMM_CONFIG_SEED = 'amm_config'
export const RAYDIUM_CPMM_POOL_SEED = 'pool'
export const RAYDIUM_CPMM_OBSERVATION_SEED = 'observation'
// Raydium CLMM CONSTANTS:
export const RAYDIUM_CLMM_PROGRAM_ID = 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK'
export const RAYDIUM_CLMM_POOL_VAULT_SEED = 'pool_vault'
export const RAYDIUM_CLMM_AUTHORITY_SEED = 'authority'
export const RAYDIUM_CLMM_AMM_CONFIG_SEED = 'amm_config'
export const RAYDIUM_CLMM_POOL_SEED = 'pool'
export const RAYDIUM_CLMM_POOL_REWARD_VAULT_SEED = 'pool_reward_vault'
export const RAYDIUM_CLMM_POOL_TICK_ARRAY_BITMAP_SEED = 'pool_tick_array_bitmap_extension'
export const RAYDIUM_CLMM_OBSERVATION_SEED = 'observation'
export const RAYDIUM_CLMM_TICK_ARRAY_SEED = 'tick_array'
// Meteora DLMM CONSTANTS:
export const METEORA_DLMM_PROGRAM_ID = 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo'
const CONSTANTS = Object.entries(IDL.constants);
export const MAX_BIN_ARRAY_SIZE = new BN(
  CONSTANTS.find(([k, v]) => v.name == "MAX_BIN_PER_ARRAY")?.[1].value ?? 0
);
export const MAX_BIN_PER_POSITION = new BN(
  CONSTANTS.find(([k, v]) => v.name == "MAX_BIN_PER_POSITION")?.[1].value ?? 0
);
export const BIN_ARRAY_BITMAP_SIZE = new BN(
  CONSTANTS.find(([k, v]) => v.name == "BIN_ARRAY_BITMAP_SIZE")?.[1].value ?? 0
);
export const EXTENSION_BINARRAY_BITMAP_SIZE = new BN(
  CONSTANTS.find(([k, v]) => v.name == "EXTENSION_BINARRAY_BITMAP_SIZE")?.[1]
    .value ?? 0
);
// Orca Whirlpool CONSTANTS:
export const ORCA_WHIRLPOOL_PROGRAM_ID = 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'
export const WHIRLPOOL_SEED = "whirlpool";
export const WHIRLPOOL_POSITION_SEED = "position";
export const WHIRLPOOL_METADATA_SEED = "metadata";
export const WHIRLPOOL_TICK_ARRAY_SEED = "tick_array";
export const WHIRLPOOL_FEE_TIER_SEED = "fee_tier";
export const WHIRLPOOL_ORACLE_SEED = "oracle";
export const WHIRLPOOL_POSITION_BUNDLE_SEED = "position_bundle";
export const WHIRLPOOL_BUNDLED_POSITION_SEED = "bundled_position";
export const WHIRLPOOL_CONFIG_EXTENSION_SEED = "config_extension";
export const WHIRLPOOL_TOKEN_BADGE_SEED = "token_badge";