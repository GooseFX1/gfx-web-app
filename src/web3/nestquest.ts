import { web3, utils } from '@project-serum/anchor'
import { BaseSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { purchaseWithSol } from './nestquest-codegen/instructions/purchaseWithSol'
import { purchaseWithGofx } from './nestquest-codegen/instructions/purchaseWithGofx'
import { PROGRAM_ID } from './nestquest-codegen/programId'
import { createAssociatedTokenAccountInstruction } from './account'
import { TOKEN_PROGRAM_ID, ADDRESSES } from './ids'
import { signAndSendRawTransaction } from './utils'

const GOFX_MINT = ADDRESSES['mainnet-beta'].mints.GOFX.address

const buildAssocIx = (nftUserAccount: web3.PublicKey, walletPubkey: web3.PublicKey, nftMint: web3.PublicKey) => {
  const temp = []
  createAssociatedTokenAccountInstruction(temp, nftUserAccount, walletPubkey, walletPubkey, nftMint)
  const [tokenIx] = temp
  return tokenIx
}

const fetchAvailableNft = async (connection: web3.Connection): Promise<web3.PublicKey | null> => {
  const walletAddress = new web3.PublicKey('3QvkzDXSgrLmsCK5ZDoddPFL7tYjzC5oHiiA5TJ9NsoA')
  const tokensRaw = await connection.getParsedTokenAccountsByOwner(walletAddress, {
    programId: TOKEN_PROGRAM_ID
  })

  const nfts = tokensRaw.value.flatMap((tk) =>
    tk.account.data.parsed.info.tokenAmount.uiAmount === 1 && tk.account.data.parsed.info.tokenAmount.decimals === 0
      ? [new web3.PublicKey(tk.account.data.parsed.info.mint)]
      : []
  )

  return nfts[0] || null
}

const buyWithSOL = async (
  wallet: WalletContextState,
  connection: web3.Connection,
  nftMint: web3.PublicKey
): Promise<web3.Transaction | string | null> => {
  const [nftAuth] = await web3.PublicKey.findProgramAddress([Buffer.from('auth')], PROGRAM_ID)

  const nftVault = await utils.token.associatedAddress({
    mint: nftMint,
    owner: nftAuth
  })

  const nftUserAccount = await utils.token.associatedAddress({
    mint: nftMint,
    owner: wallet.publicKey
  })

  const accounts = {
    payer: wallet.publicKey,
    nftVault,
    nftUserAccount,
    nftAuth,
    nftMint,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId
  }

  const transaction = new web3.Transaction()
  const ix = purchaseWithSol(accounts)

  const userAssocAccountData = await connection.getAccountInfo(nftUserAccount)

  if (!userAssocAccountData) {
    const tokenIx = buildAssocIx(nftUserAccount, wallet.publicKey, nftMint)
    transaction.add(tokenIx)
  }

  transaction.add(ix)

  const finalResult = await signAndSendRawTransaction(connection, transaction, wallet)
  const result = await connection.confirmTransaction(finalResult)

  if (!result?.value?.err) {
    return finalResult
  } else {
    return null
  }
}

const buyWithGOFX = async (
  wallet: any,
  connection: web3.Connection,
  nftMint: web3.PublicKey
): Promise<web3.Transaction> => {
  const [nftAuth] = await web3.PublicKey.findProgramAddress([Buffer.from('auth')], PROGRAM_ID)

  const nftVault = await utils.token.associatedAddress({
    mint: nftMint,
    owner: nftAuth
  })

  const nftUserAccount = await utils.token.associatedAddress({
    mint: nftMint,
    owner: wallet.publicKey
  })

  const gofxUserAccount = await utils.token.associatedAddress({
    mint: GOFX_MINT,
    owner: wallet.publicKey
  })

  const gofxVault = await utils.token.associatedAddress({
    mint: GOFX_MINT,
    owner: nftAuth
  })

  const accounts = {
    payer: wallet.publicKey,
    gofxUserAccount,
    gofxVault,
    gofxMint: GOFX_MINT,
    nftVault,
    nftUserAccount,
    nftAuth,
    nftMint,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId
  }

  const transaction = new web3.Transaction()

  const purchaseIx = purchaseWithGofx(accounts)

  const userAssocAccountData = await connection.getAccountInfo(nftUserAccount)

  if (!userAssocAccountData) {
    const tokenIx = buildAssocIx(nftUserAccount, wallet.publicKey, nftMint)
    transaction.add(tokenIx)
  }
  transaction.add(purchaseIx)

  return transaction
}

export { buyWithSOL, buyWithGOFX, fetchAvailableNft }
