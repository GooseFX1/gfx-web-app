import { type IAccounts } from "@/context";
import { Connection } from "@solana/web3.js"
import { PoolInfoLayout, SqrtPriceMath } from '@raydium-io/raydium-sdk-v2'

// Get the list of the wallet's tokens(already provided)
// For a pool, given its tokenA and tokenB, get the matching raydium, orca pools for that pool. Read its lpToken mint.
// Scan the wallet's list of tokens for that mint. If it exists, use the balance to calculate the position.
// Create a unified type for that position.

// To make this faster, the 2nd step can be cached for each pool on the frontend
