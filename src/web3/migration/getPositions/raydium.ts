import { Connection, EpochInfo, PublicKey } from "@solana/web3.js"
import { MigratePosition } from "./common";
import { 
  Clmm, 
  clmmComputeInfoToApiInfo, 
  CLMM_PROGRAM_ID, 
  fetchMultipleMintInfos, 
  PoolFetchType,
  PositionUtils, 
  Raydium, 
  TokenAccount, 
  TokenAccountRaw, 
  ApiV3PoolInfoConcentratedItem,
  ApiV3PoolInfoItem
} from "@raydium-io/raydium-sdk-v2"

const getAllCLMMPoolsFromAPI = async(raydium: Raydium): Promise<Array<ApiV3PoolInfoConcentratedItem>> => {
  const pools = new Array<ApiV3PoolInfoItem>();
  let page = 1;
  while (true) {
    const response = await raydium.api.getPoolList({
      type: PoolFetchType.Concentrated,
      sort: 'liquidity',
      order: 'desc',
      pageSize: 100,
      page,
    });
    pools.push(...response.data);
    if (!response.hasNextPage) {
      break;
    }
    page += 1;
  }

  return pools as ApiV3PoolInfoConcentratedItem[]
}

const getCLMMPoolInfosFromAPI = async (
  raydium: Raydium, 
  poolIds: string[]
): Promise<Array<ApiV3PoolInfoConcentratedItem>> => {
  return await Promise.all(chunks(poolIds, 100).map(async (ids) => {
    return ((await raydium.api.fetchPoolById({ ids: ids.join(',') })) as ApiV3PoolInfoConcentratedItem[]) 
  })).then(pools => pools.flat())
}

const getCLMMPoolInfosFromRPC = async (
  raydium: Raydium, 
  poolIds: (string | PublicKey)[]
): Promise<Array<ApiV3PoolInfoConcentratedItem>> => {
  const clmm = new Clmm({
    scope: raydium,
    moduleName: "gfxMigrate",
  });
  const rpcPools = await clmm.getRpcClmmPoolInfos({poolIds, config: {
    batchRequest: true,
    chunkCount: 99,
  }});
  const mints = new Set<PublicKey>();

  Object.values(rpcPools).forEach((p) => {
    mints.add(p.mintA);
    mints.add(p.mintB)
  });
  const fetchMintInfoRes = await fetchMultipleMintInfos({
    connection: raydium.connection,
    mints: Array.from(mints)
  }); 

  const { computeClmmPoolInfo } = await clmm.getComputeClmmPoolInfos({
    clmmPoolsRpcInfo: rpcPools,
    mintInfos: fetchMintInfoRes
  });
  return Object.values(computeClmmPoolInfo).map(p => clmmComputeInfoToApiInfo(p))
}

export const getRaydiumCLMMPositions = async (
  connection: Connection,
  user: PublicKey,
  poolMap: Record<string, ApiV3PoolInfoConcentratedItem> = {},
  useRpc = true,
  epochInfo?: EpochInfo,
  tokenAccounts?: TokenAccount[],
  tokenAccountRawInfos?: TokenAccountRaw[]
): Promise<Array<MigratePosition>> => {
  const raydium = await Raydium.load({
    connection,
    owner: user,
    signAllTransactions: undefined,
    tokenAccounts,
    tokenAccountRawInfos, 
    disableLoadToken: true,
    disableFeatureCheck: true
  });
  const ownerPositions = await raydium.clmm.getOwnerPositionInfo({ programId: CLMM_PROGRAM_ID });
  const poolsToFetch = ownerPositions.map(position => position.poolId.toString())
    .filter(poolId => !poolMap[poolId]);

  if (!epochInfo) {
    epochInfo = await raydium.connection.getEpochInfo();
  }

  let pools: Array<ApiV3PoolInfoConcentratedItem>;
  if (poolsToFetch.length != 0) {
    if (useRpc) {
      pools = await getCLMMPoolInfosFromRPC(raydium, poolsToFetch);
    } else {
      pools = await getCLMMPoolInfosFromAPI(raydium, poolsToFetch);
    }
    pools.forEach(pool => {
      if (!pool) return;
      poolMap[pool.id] = pool;
    });
  }

  const migratePositions = new Array<MigratePosition>();
  for (const ownerPosition of ownerPositions) {
    let poolInfo = poolMap[ownerPosition.poolId.toString()];
    if (!poolInfo) {
      continue;
    }
    const position = PositionUtils.getAmountsFromLiquidity({
      poolInfo,
      ownerPosition,
      liquidity: ownerPosition.liquidity,
      slippage: 0,
      add: false,
      epochInfo
    })
    migratePositions.push({
      source: 'RaydiumCLMM',
      tokenA: new PublicKey(poolInfo.mintA.address),
      tokenB: new PublicKey(poolInfo.mintB.address),
      amountTokenA: position.amountSlippageA.amount,
      amountTokenB: position.amountSlippageB.amount,
    });
  }

  return migratePositions
}

function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) =>
    array.slice(index * size, (index + 1) * size)
  )
}
