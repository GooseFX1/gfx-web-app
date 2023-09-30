import { deserializeUnchecked } from 'borsh'
import { Connection, PublicKey } from '@solana/web3.js'
import { METADATA_PREFIX, METADATA_PROGRAM, MetaplexMetadata } from '../metaplex'
import { PARSE_NFT_ACCOUNT_SCHEMA } from './metadata'
import { fetchUpdatedJwtToken } from '../../api/NFTs'
import { capitalizeFirstLetter } from '../../utils/misc'
import { notify } from '../../utils'
import { USER_SOCIALS } from '../../constants'
import { encode } from 'bs58'
import { Dispatch, SetStateAction } from 'react'
import { USER_CONFIG_CACHE } from '../../types/app_params'
import { Wallet, WalletContextState } from '@solana/wallet-adapter-react'
import { INFTInBag } from '../../types/nft_details'
import { Metaplex, toPublicKey, walletAdapterIdentity } from '@metaplex-foundation/js'
import { AUCTION_HOUSE } from '../ids'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'

const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM)
const metaProgamPublicKeyBuffer = metaProgamPublicKey.toBuffer()
const metaProgamPrefixBuffer = Buffer.from(METADATA_PREFIX)

export const decodeTokenMetadata = async (buffer: Buffer): Promise<MetaplexMetadata> =>
  deserializeUnchecked(PARSE_NFT_ACCOUNT_SCHEMA, MetaplexMetadata, buffer)

/**
 * Get Addresses of Metadata account assosiated with Mint Token
 **/
export async function getSolanaMetadataAddress(tokenMint: PublicKey): Promise<PublicKey> {
  const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM)
  return (
    await PublicKey.findProgramAddress(
      [metaProgamPrefixBuffer, metaProgamPublicKeyBuffer, tokenMint.toBuffer()],
      metaProgamPublicKey
    )
  )[0]
}

export const minimizeTheString = (str: string, neededLength?: number): string => {
  try {
    if (str.length > (neededLength ? neededLength : 12))
      return str.substring(0, neededLength ? neededLength : 12) + '...'
    return str
  } catch (err) {
    return ''
  }
}

const getDaysArray = function (start, end) {
  //eslint-disable-next-line
  for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt))
  }
  return arr
}
function formatDate(input) {
  const datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits1
    month = datePart[1],
    day = datePart[2]
  return day + '-' + month + '-' + year
}
export const formatTommddyyyy = (input: string): string => {
  const datePart = input.match(/\d+/g),
    year = datePart[2],
    month = datePart[1],
    day = datePart[0]
  return month + '-' + day + '-' + year
}

export const getDateInArray = (): string[] => {
  const todayObj = new Date()
  let daylist = getDaysArray(new Date(new Date()), new Date(todayObj.setDate(todayObj.getDate() + 20)))
  daylist = daylist.map((v) => formatDate(v.toISOString().slice(0, 10)))
  return daylist
}

export const getNFTMetadata = async (metadataAccountPublicKey: string, connection: Connection): Promise<any> => {
  try {
    const metadataAddress = new PublicKey(metadataAccountPublicKey)
    const metadataAccount = await connection.getAccountInfo(metadataAddress)
    if (metadataAccount) {
      // Decode metadata account data
      const metadata = Metadata.deserialize(metadataAccount.data)
      return metadata[0]
    } else {
      console.log('Metadata account not found')
      return null
    }
  } catch (err) {
    console.error(err)
    return err
  }
}

export const handleMarketplaceFormat = (name: string): string => {
  const splitString = name.split('_')
  const capString = splitString.map((c) => capitalizeFirstLetter(c.toLowerCase()))
  return capString.join(' ')
}

export const copyToClipboard = async (): Promise<void> => {
  await navigator.clipboard.writeText(window.location.href)
  await notify({ message: `Copied to Clipboard`, icon: 'error', notificationDuration: 2000 })
}
const validExternalLink = (url: string): string => {
  if (url.includes('https://') || url.includes('http://')) {
    return url
  } else {
    return `https://${url}`
  }
}
export const validateSocialLinks = (url: string, social: string): string => {
  switch (social) {
    case USER_SOCIALS.TWITTER:
      return validExternalLink(url.includes(USER_SOCIALS.TWITTER) ? url : `twitter.com/${url}`)
    case USER_SOCIALS.TELEGRAM:
      return validExternalLink(url.includes(USER_SOCIALS.TELEGRAM) ? url : `t.me/${url}`)
    case USER_SOCIALS.DISCORD:
      return validExternalLink(url.includes(USER_SOCIALS.DISCORD) ? url : `discordapp.com/users/${url}`)
  }
}

export const signAndUpdateDetails = async (
  wallet: Wallet,
  isSessionUser: boolean,
  setModal: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  const userCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const createSignMessage = () =>
    'Signing into GooseFX with your wallet \n\n' +
    "Clicking 'Sign' or 'Approve' proves us that wallet is you \n\n" +
    'Please note that NO SOL will be deducted from your wallet during this process. \n' +
    new Date().getTime()
  const publicKey = wallet?.adapter?.publicKey
  const storedToken = userCache?.jwtToken ? userCache?.jwtToken.split('.') : null

  const payload = storedToken ? JSON.parse(atob(storedToken[1])) : null
  // Check if token is missing, if wallet doesn't match, or if token is expired
  if (
    (storedToken === null || payload.wallet !== publicKey.toString() || Date.now() > payload?.exp * 1000) &&
    isSessionUser
  ) {
    // Convert the message into bytes
    const messageForSign = createSignMessage()
    const messageBytes = new TextEncoder().encode(messageForSign)

    try {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      const signedMessage = await wallet?.adapter?.signMessage(messageBytes)
      /* eslint-enable @typescript-eslint/ban-ts-comment */

      const signatureBase58 = encode(signedMessage)
      const updatedJwtToken = await fetchUpdatedJwtToken(publicKey.toString(), signatureBase58, messageForSign)
      console.log(updatedJwtToken)
      window.localStorage.setItem(
        'gfx-user-cache',
        JSON.stringify({
          ...userCache,
          jwtToken: updatedJwtToken
        })
      )
      setModal(true)
    } catch (err) {
      console.error(err)
    }
  } else {
    setModal(true)
  }
}

export const removeNFTFromBag = (
  mintAddress: string,
  setNftInBag: Dispatch<SetStateAction<INFTInBag>>,
  e?: Event | any
): void => {
  if (e) {
    e.stopPropagation()
  }
  setNftInBag((previousNftBag) => {
    const updatedNftBag = { ...previousNftBag }
    delete updatedNftBag[mintAddress]
    return updatedNftBag
  })
}

export const getMetaplexInstance = async (connection: Connection, wallet: WalletContextState): Promise<Metaplex> =>
  new Metaplex(connection).use(walletAdapterIdentity(wallet))

export const findOurAuctionHouse = async (metaplex: Metaplex): Promise<any> =>
  metaplex.auctionHouse().findByAddress({ address: toPublicKey(AUCTION_HOUSE) })
