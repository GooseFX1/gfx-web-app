import { BN, Program, Provider } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, TransactionSignature, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { ADDRESSES, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, SYSTEM, FEE_PAYER_WITHDRAWAL_ACCT } from './ids'
import { createAssociatedTokenAccountIx, findAssociatedTokenAddress, signAndSendRawTransaction } from './utils'
import { ISwapToken } from '../context'
const SwapIDL = require('./idl/swap2.json')

const getSwapProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    SwapIDL,
    ADDRESSES[network].programs.swap.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )

export const computePoolsPDAs = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  network: WalletAdapterNetwork
): Promise<{ lpTokenMint: PublicKey; pool: PublicKey }> => {
  const {
    pools,
    programs: {
      swap: { address }
    }
  } = ADDRESSES[network]
  const paired = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL-Pair', 'utf-8'),
      new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
      new PublicKey(tokenA.address).toBuffer(),
      new PublicKey(tokenB.address).toBuffer()
    ],
    address
  )

  const pair = { address: paired[0] + '' } //pools[[tokenA.symbol, tokenB.symbol].sort((a, b) => a.localeCompare(b)).join('/')]
  console.log(paired)
  const poolSeed = [new Buffer('GFXPool', 'utf-8'), new PublicKey(pair.address).toBuffer()]
  const mintSeed = [new Buffer('GFXLPMint', 'utf-8'), new PublicKey(pair.address).toBuffer()]
  const PDAs = await Promise.all([
    PublicKey.findProgramAddress(mintSeed, address),
    PublicKey.findProgramAddress(poolSeed, address)
  ])
  const [[lpTokenMint], [pool]] = PDAs
  return { lpTokenMint, pool: new PublicKey(pair.address) }
}

export const swap = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  inTokenAmount: number,
  outTokenAmount: number,
  slippage: number,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<TransactionSignature | undefined> => {
  if (!wallet.publicKey || !wallet.signTransaction) return

  const program = getSwapProgram(wallet, connection, network)
  let inst: any = program.instruction
  const tx = new Transaction()

  console.log(program)

  const amountIn = new BN(inTokenAmount * 10 ** tokenA.decimals)
  const minimumAmountOut = new BN(outTokenAmount * 10 ** tokenB.decimals * (1 - slippage))

  const { lpTokenMint, pool } = await computePoolsPDAs(tokenA, tokenB, network)
  const [inTokenAtaPool, outTokenAtaPool, lpTokenAtaFee, inTokenAtaUser, outTokenAtaUser] = await Promise.all([
    await findAssociatedTokenAddress(pool, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(pool, new PublicKey(tokenB.address)),
    await findAssociatedTokenAddress(pool, lpTokenMint),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenB.address))
  ])

  //console.log(account(pool));

  if (!(await connection.getAccountInfo(outTokenAtaUser))) {
    tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenB.address), outTokenAtaUser, wallet.publicKey))
  }

  const accounts = {
    controller: new PublicKey(ADDRESSES[network].programs.swap.controller),
    pair: new PublicKey(pool),
    sslIn: inTokenAtaPool,
    sslOut: outTokenAtaPool,
    mintIn: lpTokenMint,
    mintOut: lpTokenAtaFee,
    vaultIn: await findAssociatedTokenAddress(inTokenAtaPool, lpTokenMint),
    vaultOut: await findAssociatedTokenAddress(outTokenAtaPool, lpTokenAtaFee),
    userWallet: wallet.publicKey,
    userInAta: inTokenAtaUser,
    userOutAta: outTokenAtaUser,
    instructions: inst,
    feeCollectorAta: await findAssociatedTokenAddress(wallet.publicKey, lpTokenMint),
    feeCollector: wallet.publicKey, //new PublicKey(FEE_PAYER_WITHDRAWAL_ACCT),
    //splProgram: TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    systemProgram: SYSTEM,
    rent: SYSVAR_RENT_PUBKEY,
    amountIn: amountIn,
    minimumAmountOut
  }

  console.log(accounts)
  tx.add(await inst.swap({ accounts })) //amountIn, minimumAmountOut, { accounts }
  console.log({ tx, connection, wallet })
  return signAndSendRawTransaction(connection, tx, wallet)
}
