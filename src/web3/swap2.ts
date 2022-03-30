import { BN, Program, Provider } from '@project-serum/anchor'
import { Buffer } from 'buffer'
import { publicKeyLayout, u64, Oracle } from './layout'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import {
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  createCloseAccountInstruction
} from '@solana/spl-token-new'

import {
  Connection,
  SystemProgram,
  PublicKey,
  Transaction,
  TransactionSignature,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { ADDRESSES, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, SYSTEM } from './ids'
import {
  createAssociatedTokenAccountIx,
  findAssociatedTokenAddress,
  signAndSendRawTransaction
  //simulateTransaction
} from './utils'
import { ISwapToken } from '../context'
const SwapIDL = require('./idl/swap2.json')
const { blob, seq, struct, u8, u32 } = require('buffer-layout')

const wasm = import('gfx_ssl_wasm')

const getSwapProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    SwapIDL,
    ADDRESSES[network].programs.swap.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )

const PAIR_LAYOUT = struct([
  blob(8, 'sighash'),
  publicKeyLayout('controller'),
  publicKeyLayout('mint1'),
  publicKeyLayout('mint2'),
  blob(8), // padding for alignment
  seq(Oracle, 5, 'oracles'),
  u64('nOracle'),
  blob(58), // Other fields
  publicKeyLayout('fee_collector')
])

const LAYOUT = struct([
  blob(8, 'sighash'),
  publicKeyLayout('controller'),
  publicKeyLayout('mint1'),
  publicKeyLayout('mint2'),
  blob(8),
  publicKeyLayout('oracle1'),
  u8(),
  publicKeyLayout('oracle2'),
  u8(),
  publicKeyLayout('oracle3'),
  u8(),
  publicKeyLayout('oracle4'),
  u8(),
  u32('n'),
  blob(970),
  publicKeyLayout('fee_collector')
])

export const computePoolsPDAs = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  network: WalletAdapterNetwork
): Promise<{ lpTokenMint: PublicKey; pool: PublicKey; pair: PublicKey }> => {
  // const {
  //   programs: {
  //     swap: { address }
  //   }
  // } = ADDRESSES[network] //ADDRESSES[network]

  //pools[[tokenA.symbol, tokenB.symbol].sort((a, b) => a.localeCompare(b)).join('/')]
  //console.log(paired)
  // const poolSeed = [new Buffer('GFXPool', 'utf-8'), new PublicKey(pair[0] + '').toBuffer()]
  // const mintSeed = [new Buffer('GFXLPMint', 'utf-8'), new PublicKey(pair[0] + '').toBuffer()]
  // const PDAs = await Promise.all([
  //   PublicKey.findProgramAddress(mintSeed, address),
  //   PublicKey.findProgramAddress(poolSeed, address)
  // ])
  // const [[lpTokenMint], [pool]] = PDAs
  return { lpTokenMint: null, pair: null, pool: null }
}

const wrapSolToken = async (wallet: any, connection: Connection, amount: number) => {
  try {
    const tx = new Transaction()
    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
    // Create token account to hold your wrapped SOL
    if (associatedTokenAccount)
      tx.add(
        createAssociatedTokenAccountInstruction(wallet.publicKey, associatedTokenAccount, wallet.publicKey, NATIVE_MINT)
      )

    // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
    tx.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: associatedTokenAccount,
        lamports: amount
      }),
      createSyncNativeInstruction(associatedTokenAccount)
    )

    return tx //signAndSendRawTransaction(connection, tx, wallet)
  } catch {
    return null
  }
}

export const getPairDetails = async (tokenA: ISwapToken, tokenB: ISwapToken, network: WalletAdapterNetwork) => {
  const addresses = [new PublicKey(tokenA.address).toBuffer(), new PublicKey(tokenB.address).toBuffer()].sort(
    Buffer.compare
  )

  const pairArr = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL-Pair', 'utf-8'),
      new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
      addresses[0],
      addresses[1]
    ],
    ADDRESSES[network].programs.swap.address
  )

  const pair = pairArr[0]

  return pair
}

export const swapCreatTX = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  inTokenAmount: number,
  outTokenAmount: number,
  slippage: number,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork,
  txn?: Transaction
): Promise<Transaction> => {
  if (!wallet.publicKey || !wallet.signTransaction) return txn

  const program = getSwapProgram(wallet, connection, network)
  const inst: any = program.instruction
  const tx = txn || new Transaction()

  const amountIn = new BN(inTokenAmount * 10 ** tokenA.decimals)
  const minimumAmountOut = new BN(outTokenAmount * 10 ** tokenB.decimals * (1 - slippage))
  const pair = await getPairDetails(tokenA, tokenB, network)

  const [inTokenAtaUser, outTokenAtaUser] = await Promise.all([
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenB.address))
  ])

  const sslIn = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL', 'utf-8'),
      new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
      new PublicKey(tokenA.address).toBuffer()
    ],
    ADDRESSES[network].programs.swap.address
  )
  const sslOut = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL', 'utf-8'),
      new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
      new PublicKey(tokenB.address).toBuffer()
    ],
    ADDRESSES[network].programs.swap.address
  )
  const vaultIn = await findAssociatedTokenAddress(sslIn[0], new PublicKey(tokenA.address))
  const vaultOut = await findAssociatedTokenAddress(sslOut[0], new PublicKey(tokenB.address))

  if (!(await connection.getAccountInfo(outTokenAtaUser))) {
    tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenB.address), outTokenAtaUser, wallet.publicKey))
  }

  // let walletBuffer = wallet.publicKey + ''
  // let assTokProg = await PublicKey.findProgramAddress(
  //   [new PublicKey(walletBuffer).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(tokenA.address).toBuffer()],
  //   ADDRESSES[network].programs.swap.address
  // )

  // console.log(SYSVAR_RENT_PUBKEY + '', SYSVAR_RENT_PUBKEY + '' === 'SysvarRent111111111111111111111111111111111')
  // console.log(inTokenAtaUser + '', inTokenAtaUser + '' === 'Bp7pJh1UrpWeuvRHCbx788KLAhm3p2KYHJofm8PCf9K')
  // console.log(outTokenAtaUser + '', outTokenAtaUser + '' === '6Lc8K5ECpv2Rs7uWXCvsHhzKJPPqgciqtWCVA4XvKahA')

  try {
    const pairData = await connection.getAccountInfo(pair)
    if (!pairData || !pairData.data) throw new Error('Token Pair do not exist yet.')

    const tokenAccountA = await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenA.address))
    if (tokenA.address !== NATIVE_MINT.toBase58() && !(await connection.getParsedAccountInfo(tokenAccountA)).value) {
      tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenA.address), tokenAccountA, wallet.publicKey))
    }

    const tokenAccountB = await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenB.address))
    if (tokenB.address !== NATIVE_MINT.toBase58() && !(await connection.getParsedAccountInfo(tokenAccountB)).value) {
      tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenB.address), tokenAccountB, wallet.publicKey))
    }

    const data = pairData.data
    const decoded = LAYOUT.decode(data)
    const { oracle1, oracle2, oracle3, oracle4, n, fee_collector } = decoded
    const collector = fee_collector //'Cir93Do3LGMYtYnbxpQAb5Gr5R5mS2c7gTS1AZkvYA3w'

    const remainingAccounts = [
      { isSigner: false, isWritable: false, pubkey: oracle1 },
      { isSigner: false, isWritable: false, pubkey: oracle2 },
      { isSigner: false, isWritable: false, pubkey: oracle3 },
      { isSigner: false, isWritable: false, pubkey: oracle4 }
    ].slice(0, n)

    const accounts = {
      controller: new PublicKey(ADDRESSES[network].programs.swap.controller),
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

    tx.add(
      await inst.rebalanceSwap(amountIn, minimumAmountOut, {
        accounts,
        remainingAccounts
      })
    )
    tx.add(await inst.preSwap({ accounts, remainingAccounts }))
    tx.add(await inst.swap({ accounts, remainingAccounts }))
  } catch (error) {
    console.log(error)
  }

  return tx
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
  try {
    let txn = new Transaction()
    if (tokenA.address === NATIVE_MINT.toBase58()) {
      txn = await wrapSolToken(wallet, connection, inTokenAmount * LAMPORTS_PER_SOL)
    }

    const tx = await swapCreatTX(
      tokenA,
      tokenB,
      inTokenAmount,
      outTokenAmount,
      slippage,
      wallet,
      connection,
      network,
      txn
    )

    // unwrapping sol if tokenB is sol
    if (tokenB.address === NATIVE_MINT.toBase58()) {
      try {
        const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
        if (associatedTokenAccount) {
          const tr = createCloseAccountInstruction(associatedTokenAccount, wallet.publicKey, wallet.publicKey)
          tx.add(tr)
        }
      } catch (e) {
        console.log(e)
      }
    }

    const finalResult = await signAndSendRawTransaction(connection, tx, wallet)
    let result = await connection.confirmTransaction(finalResult)

    if (!result.value.err) {
      return finalResult
    } else {
      return null
    }
  } catch {
    return null
  }
}

export const preSwapAmount = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  inTokenAmount: number,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<TransactionSignature | undefined> => {
  try {
    if (!inTokenAmount || inTokenAmount === 0) return '0'

    const swapWASM = (await wasm).swap
    const OracleRegistry = (await wasm).OracleRegistry
    const pair = await getPairDetails(tokenA, tokenB, network)
    const pairData = await connection.getAccountInfo(pair)
    const sslIn = await PublicKey.findProgramAddress(
      [
        new Buffer('GFX-SSL', 'utf-8'),
        new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
        new PublicKey(tokenA.address).toBuffer()
      ],
      ADDRESSES[network].programs.swap.address
    )
    const sslOut = await PublicKey.findProgramAddress(
      [
        new Buffer('GFX-SSL', 'utf-8'),
        new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
        new PublicKey(tokenB.address).toBuffer()
      ],
      ADDRESSES[network].programs.swap.address
    )
    const tokenASSLData = await connection.getAccountInfo(new PublicKey(sslIn[0]))
    const tokenBSSLData = await connection.getAccountInfo(new PublicKey(sslOut[0]))

    const decoded = PAIR_LAYOUT.decode(pairData.data)
    const { oracles, nOracle } = decoded
    //const oracles = [oracle1, oracle2, oracle3, oracle4]
    const registry = new OracleRegistry()
    for (const oracle of oracles.slice(0, nOracle)) {
      for (const elem of oracle.elements.slice(0, oracle.n)) {
        registry.add_oracle(elem.address.toBuffer(), (await connection.getAccountInfo(elem.address)).data)
      }
    }
    const pseudoAmount = 10000000
    const scale = pseudoAmount / inTokenAmount
    const out = swapWASM(
      tokenASSLData.data,
      tokenBSSLData.data,
      pairData.data,
      registry,
      BigInt(pseudoAmount),
      BigInt(0)
    )
    const differenceInDecimals = tokenA.decimals - tokenB.decimals
    const trueValue = Number(out.toString()) / scale

    return +(trueValue * 10 ** differenceInDecimals).toFixed(7) + ''
  } catch (e) {
    console.log(e)
    return null
  }
}
