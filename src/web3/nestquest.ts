import { web3, utils } from '@project-serum/anchor'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { purchaseWithSol } from './nestquest-codegen/instructions/purchaseWithSol'
import { purchaseWithGofx } from './nestquest-codegen/instructions/purchaseWithGofx'
import { createAssociatedTokenAccountInstruction } from './account'
import { TOKEN_PROGRAM_ID, ADDRESSES } from './ids'
import { signAndSendRawTransaction } from './utils'

const buildAssocIx = (nftUserAccount: web3.PublicKey, walletPubkey: web3.PublicKey, nftMint: web3.PublicKey) => {
  const temp = []
  createAssociatedTokenAccountInstruction(temp, nftUserAccount, walletPubkey, walletPubkey, nftMint)
  const [tokenIx] = temp
  return tokenIx
}

const fetchAvailableNft = async (
  connection: web3.Connection,
  network: WalletAdapterNetwork
): Promise<{ nft: web3.PublicKey | null; length: number }> => {
  const walletAddress = ADDRESSES[network].programs.nestquestSale.address
  const tokensRaw = await connection.getParsedTokenAccountsByOwner(walletAddress, {
    programId: TOKEN_PROGRAM_ID
  })

  const nfts = tokensRaw.value.flatMap((tk) =>
    tk.account.data.parsed.info.tokenAmount.uiAmount === 1 && tk.account.data.parsed.info.tokenAmount.decimals === 0
      ? [new web3.PublicKey(tk.account.data.parsed.info.mint)]
      : []
  )
  return { nft: nfts[0] || null, length: nfts.length || 0 }
}

const buyWithSOL = async (
  wallet: WalletContextState,
  connection: web3.Connection,
  network: WalletAdapterNetwork,
  nftMint: web3.PublicKey,
  civicGatewayToken: web3.PublicKey
): Promise<web3.Transaction | string | null> => {
  const [nftAuth] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('auth')],
    ADDRESSES[network].programs.nestquestSale.program_id
  )

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
    revenue: ADDRESSES[network].programs.nestquestSale.sol_revenue,
    civicGatewayToken,
    civicGatekeeper: ADDRESSES[network].programs.nestquestSale.civic_gatekeeper,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId
  }

  const transaction = new web3.Transaction()
  const ix = purchaseWithSol(accounts, network)

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
  network: WalletAdapterNetwork,
  nftMint: web3.PublicKey,
  civicGatewayToken: web3.PublicKey
): Promise<web3.Transaction | string | null> => {
  const GOFX_MINT = ADDRESSES['mainnet-beta'].mints.GOFX.address
  const [nftAuth] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('auth')],
    ADDRESSES[network].programs.nestquestSale.program_id
  )

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
    revenue: ADDRESSES[network].programs.nestquestSale.sol_revenue,
    gofxRevenue: ADDRESSES[network].programs.nestquestSale.gofx_revenue,
    civicGatewayToken,
    civicGatekeeper: ADDRESSES[network].programs.nestquestSale.civic_gatekeeper,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId
  }

  const transaction = new web3.Transaction()

  const purchaseIx = purchaseWithGofx(accounts, network)

  const userAssocAccountData = await connection.getAccountInfo(nftUserAccount)

  if (!userAssocAccountData) {
    const tokenIx = buildAssocIx(nftUserAccount, wallet.publicKey, nftMint)
    transaction.add(tokenIx)
  }
  transaction.add(purchaseIx)

  const finalResult = await signAndSendRawTransaction(connection, transaction, wallet)
  const result = await connection.confirmTransaction(finalResult)

  if (!result?.value?.err) {
    return finalResult
  } else {
    return null
  }
}

export { buyWithSOL, buyWithGOFX, fetchAvailableNft }
