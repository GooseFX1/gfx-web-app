
import { Connection, PublicKey } from "@solana/web3.js";
import { getRaydiumCLMMPositions } from "./getPositions/raydium";
import { getMeteoraDynamicCLMMPositions } from "./getPositions/meteora";
import { getOrcaCLMMPositionsForUser } from "./getPositions/orca";
import { MigratePosition, prettifyPositions } from "./getPositions/common";

const RPC_URL = process.env.RPC_URL ?? `https://api.mainnet-beta.solana.com`
const WHIRLPOOL_PROGRAM_ID = new PublicKey(`whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc`);
const USER_ADDRESS = new PublicKey(`2EFe8wtnTFTfsXaTdg76GsqXFuoYsWXXYtQsZboncaJN`);

export const getAllPositions = async() => {
  const connection = new Connection(RPC_URL, 'confirmed');
  const epochInfo = await connection.getEpochInfo();

  const positions = new Array<MigratePosition>();

  // Get Raydium positions
  positions.push(...await getRaydiumCLMMPositions(
    connection,
    USER_ADDRESS,
    {},
    false,
    epochInfo
  ));

  // Get Meteora positions
  positions.push(...await getMeteoraDynamicCLMMPositions(
    connection,
    USER_ADDRESS
  ));

  // Get Orca positions
  positions.push(...await getOrcaCLMMPositionsForUser(
    connection,
    USER_ADDRESS,
    WHIRLPOOL_PROGRAM_ID
  ))

  console.log("Positions", prettifyPositions(positions));
}

if (require.main === module) {
  getAllPositions().catch(console.error)
}