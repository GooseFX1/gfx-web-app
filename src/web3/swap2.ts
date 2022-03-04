import { BN, Program, Provider, workspace } from '@project-serum/anchor'
import { accountFlagsLayout, publicKeyLayout, u128, u64 } from './layout'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, TransactionSignature, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { ADDRESSES, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, SYSTEM, FEE_PAYER_WITHDRAWAL_ACCT } from './ids'
import { createAssociatedTokenAccountIx, findAssociatedTokenAddress, signAndSendRawTransaction } from './utils'
import { ISwapToken } from '../context'
const SwapIDL = require('./idl/swap2.json')
const { blob, seq, struct, u8 } = require('buffer-layout')

const getSwapProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    SwapIDL,
    ADDRESSES.devnet.programs.swap.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )

const LAYOUT = struct([
  publicKeyLayout('controller'),
  publicKeyLayout('mint1'),
  publicKeyLayout('mint2'),
  blob(1),
  publicKeyLayout('oracle1'),
  publicKeyLayout('oracle2'),
  publicKeyLayout('oracle3'),
  publicKeyLayout('oracle4'),
  u8('n'),
  blob(1)
])

export const computePoolsPDAs = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  network: WalletAdapterNetwork
): Promise<{ lpTokenMint: PublicKey; pool: PublicKey; pair: PublicKey }> => {
  const {
    programs: {
      swap: { address }
    }
  } = ADDRESSES.devnet //ADDRESSES[network]
  let addresses = [new PublicKey(tokenA.address), new PublicKey(tokenB.address)].sort()

  const pair = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL-Pair', 'utf-8'),
      new PublicKey(ADDRESSES.devnet.programs.swap.controller).toBuffer(),
      addresses[0].toBuffer(),
      addresses[1].toBuffer()
    ],
    address
  )

  //pools[[tokenA.symbol, tokenB.symbol].sort((a, b) => a.localeCompare(b)).join('/')]
  //console.log(paired)
  const poolSeed = [new Buffer('GFXPool', 'utf-8'), new PublicKey(pair[0] + '').toBuffer()]
  const mintSeed = [new Buffer('GFXLPMint', 'utf-8'), new PublicKey(pair[0] + '').toBuffer()]
  const PDAs = await Promise.all([
    PublicKey.findProgramAddress(mintSeed, address),
    PublicKey.findProgramAddress(poolSeed, address)
  ])
  const [[lpTokenMint], [pool]] = PDAs
  return { lpTokenMint, pair: new PublicKey(pair[0] + ''), pool }
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
  const { owner, data } = await connection.getAccountInfo(wallet.publicKey)
  console.log(owner + '', data)
  const decoded = LAYOUT.decode(data)

  console.log(decoded)

  let inst: any = program.instruction
  const tx = new Transaction()

  const amountIn = new BN(inTokenAmount * 10 ** tokenA.decimals)
  const minimumAmountOut = new BN(outTokenAmount * 10 ** tokenB.decimals * (1 - slippage))

  const { lpTokenMint, pool, pair } = await computePoolsPDAs(tokenA, tokenB, network)
  const [inTokenAtaPool, outTokenAtaPool, lpTokenAtaFee, inTokenAtaUser, outTokenAtaUser] = await Promise.all([
    await findAssociatedTokenAddress(pool, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(pool, new PublicKey(tokenB.address)),
    await findAssociatedTokenAddress(pool, lpTokenMint),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenB.address))
  ])

  //let pair_acc = program.account(pair)
  console.log(program)

  let sslIn = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL', 'utf-8'),
      new PublicKey(ADDRESSES.devnet.programs.swap.controller).toBuffer(),
      new PublicKey(tokenA.address).toBuffer()
    ],
    ADDRESSES.devnet.programs.swap.address
  )
  let sslOut = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL', 'utf-8'),
      new PublicKey(ADDRESSES.devnet.programs.swap.controller).toBuffer(),
      new PublicKey(tokenB.address).toBuffer()
    ],
    ADDRESSES.devnet.programs.swap.address
  )
  let vaultIn = await findAssociatedTokenAddress(sslIn[0], new PublicKey(tokenA.address))
  let vaultOut = await findAssociatedTokenAddress(sslOut[0], new PublicKey(tokenB.address))

  if (!(await connection.getAccountInfo(outTokenAtaUser))) {
    tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenB.address), outTokenAtaUser, wallet.publicKey))
  }

  let collector = 'Cir93Do3LGMYtYnbxpQAb5Gr5R5mS2c7gTS1AZkvYA3w'

  // let walletBuffer = wallet.publicKey + ''
  // let assTokProg = await PublicKey.findProgramAddress(
  //   [new PublicKey(walletBuffer).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(tokenA.address).toBuffer()],
  //   ADDRESSES.devnet.programs.swap.address
  // )

  // console.log(SYSVAR_RENT_PUBKEY + '', SYSVAR_RENT_PUBKEY + '' == 'SysvarRent111111111111111111111111111111111')
  // console.log(inTokenAtaUser + '', inTokenAtaUser + '' == 'Bp7pJh1UrpWeuvRHCbx788KLAhm3p2KYHJofm8PCf9K')
  // console.log(outTokenAtaUser + '', outTokenAtaUser + '' == '6Lc8K5ECpv2Rs7uWXCvsHhzKJPPqgciqtWCVA4XvKahA')

  const accounts = {
    controller: new PublicKey(ADDRESSES.devnet.programs.swap.controller),
    pair,
    sslIn: sslIn[0],
    sslOut: sslOut[0],
    mintIn: new PublicKey(tokenA.address),
    mintOut: new PublicKey(tokenB.address),
    vaultIn,
    vaultOut,
    userWallet: wallet.publicKey,
    userInAta: inTokenAtaUser,
    userOutAta: outTokenAtaUser,
    instructions: new PublicKey('Sysvar1nstructions1111111111111111111111111'),
    feeCollectorAta: await findAssociatedTokenAddress(new PublicKey(collector), new PublicKey(tokenA.address)),
    feeCollector: new PublicKey(collector),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    systemProgram: SYSTEM,
    rent: SYSVAR_RENT_PUBKEY
  }

  tx.add(await inst.rebalanceSwap(amountIn, minimumAmountOut, { accounts }))
  // tx.add(await inst.preSwap({ accounts }))
  // tx.add(await inst.swap({ accounts })) //amountIn, minimumAmountOut, { accounts }
  return signAndSendRawTransaction(connection, tx, wallet)
}
