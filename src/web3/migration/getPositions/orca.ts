
import { 
  decreaseLiquidityQuoteByLiquidityWithParams,
  WhirlpoolContext, 
  PDAUtil,
  TokenExtensionUtil,
  IGNORE_CACHE,
} from "@orca-so/whirlpools-sdk"
import { BN } from "bn.js"
import { Percentage, ReadOnlyWallet } from "@orca-so/common-sdk"
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, AccountLayout } from "@solana/spl-token"
import { MigratePosition } from "./common"
import { IAccounts } from "@/context"

// Token amount is exactly 1 for both Orca and Raydium
const getLikelyPositionMintsForUser = async (
  connection: Connection, 
  user: PublicKey
): Promise<PublicKey[]> => {
  const tokenAccounts = await connection
    .getTokenAccountsByOwner(user, { programId: TOKEN_PROGRAM_ID }, 'confirmed');
  const token2022Accounts = await connection
    .getTokenAccountsByOwner(user, { programId: TOKEN_2022_PROGRAM_ID }, 'confirmed');
  const accountInfos = tokenAccounts.value.concat(token2022Accounts.value);
  const mints = accountInfos.map(info => {
    return {
      pubkey: info.pubkey,
      account: AccountLayout.decode(Uint8Array.from(info.account.data))
    }
  }).filter(data => data.account.amount === BigInt(1))
  .map(data => data.account.mint);
  
  return mints
}

const getOrcaPositionAccountsForMints = async (
  whirlpoolCtx: WhirlpoolContext,
  mints: PublicKey[], 
): Promise<Array<MigratePosition>> => {
  const addresses = mints.map(mint => PDAUtil.getPosition(whirlpoolCtx.program.programId, mint).publicKey);
  const positions = Array.from((
    await whirlpoolCtx.fetcher.getPositions(addresses, IGNORE_CACHE)).values())
    .filter(position => position !== null)
  const whirlpoolAddresses = Array.from(positions.values()).map(pos => pos.whirlpool);
  const whirlpools = await whirlpoolCtx.fetcher.getPools(whirlpoolAddresses, IGNORE_CACHE); 
  
  const allPositions = new Array<MigratePosition>();
  for (const position of positions) {
    let whirlpool = whirlpools.get(position.whirlpool.toString());
    if (whirlpool === null || whirlpool === undefined) {
      continue;
    }

    const tokenExtensionCtx =
      await TokenExtensionUtil.buildTokenExtensionContext(
        whirlpoolCtx.fetcher,
        whirlpool,
        IGNORE_CACHE
      );

    const positionInfo = decreaseLiquidityQuoteByLiquidityWithParams({
      liquidity: position.liquidity,
      tickCurrentIndex: whirlpool.tickCurrentIndex,
      sqrtPrice: whirlpool.sqrtPrice,
      tickLowerIndex: position.tickLowerIndex,
      tickUpperIndex: position.tickUpperIndex,
      tokenExtensionCtx,
      slippageTolerance: new Percentage(new BN(0), new BN(100))
    });

    allPositions.push({
      source: 'OrcaCLMM',
      tokenA: whirlpool.tokenMintA,
      tokenB: whirlpool.tokenMintB,
      amountTokenA: positionInfo.tokenEstA,
      amountTokenB: positionInfo.tokenEstB
    })
  }

  return allPositions;
}

export const getOrcaCLMMPositionsForUser = async (
  connection: Connection, 
  user: PublicKey,
  programId: PublicKey,
  userTokenAccounts?: IAccounts
): Promise<MigratePosition[]> => {
  const whirlpoolCtx = WhirlpoolContext.from(
    connection, 
    new ReadOnlyWallet(Keypair.generate().publicKey),
    programId
  );

  let positionMints: PublicKey[];
  if (!userTokenAccounts) {
    positionMints = await getLikelyPositionMintsForUser(connection, user);
  } else {
    positionMints = Object.entries(userTokenAccounts)
    .filter(([_, accountInfo]) => accountInfo.amount === '1')
    .map(([mint, _]) => new PublicKey(mint))
  }

  return await getOrcaPositionAccountsForMints(whirlpoolCtx, positionMints);
}