import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useCallback, useEffect, useState } from 'react'
import { Client, Member, Treasury } from '@ladderlabs/buddy-sdk'
import { AccountMeta, Connection, PublicKey, TransactionInstruction } from '@solana/web3.js'

// TODO: move to proper constant file?
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

const CLIENT_NOT_SET = 'Client is not initialized'

const ORGANIZATION_NAME = 'goose'

export default function useReferrals(): IReferrals {
  const [client, setClient] = useState<Client | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    if (connection && publicKey) setClient(new Client(connection, publicKey))
  }, [connection, publicKey])

  const getMember = useCallback(async () => {
    if (client) throw CLIENT_NOT_SET

    if (member) return member
    const treasuryPDA = client.pda.getTreasuryPDA([publicKey], [10_000], USDC_MINT)

    // Assumes always only 1 members
    const account = (await client.member.getByTreasuryOwner(treasuryPDA))[0]

    setMember(account)

    return account
  }, [client])

  const getName = useCallback(async () => {
    if (client) throw CLIENT_NOT_SET

    return (await getMember()).account.name
  }, [client])

  const isNameAvailable = useCallback(
    async (name: string) => {
      if (client) throw CLIENT_NOT_SET
      return client.member.isMemberAvailable(ORGANIZATION_NAME, name)
    },
    [client]
  )

  const getTreasury = useCallback(async () => {
    if (client) throw CLIENT_NOT_SET

    return await (await getMember()).getOwner()
  }, [client])

  const claim = useCallback(async () => {
    if (client) throw CLIENT_NOT_SET

    const treasury = await getTreasury()
    return treasury.claim()
  }, [])

  const getReferred = useCallback(async () => {
    const treasury = await getTreasury()

    return await client.member.getByTreasuryReferrer(treasury.account.pda)
  }, [])

  return {
    isReady: !!client,
    getMember,
    getName,
    getReferred,
    isNameAvailable,
    getTreasury,
    claim,
    referrer: localStorage.getItem('referrer')
  }
}

interface IReferrals {
  isReady: boolean
  getMember: () => Promise<Member>
  getName: () => Promise<string>
  getReferred: () => Promise<Member[]>
  isNameAvailable: (name: string) => Promise<boolean>
  getTreasury: () => Promise<Treasury>
  claim: () => Promise<TransactionInstruction[]>
  referrer: string
}

export async function create(
  connection: Connection,
  wallet: PublicKey,
  name: string,
  referrer: string
): Promise<TransactionInstruction[]> {
  const client = new Client(connection, wallet)

  return await client.initialize.createMember(ORGANIZATION_NAME, name, referrer)
}

export async function createRandom(
  connection: Connection,
  wallet: PublicKey,
  referrer: string
): Promise<{ instructions: TransactionInstruction[]; memberPDA: PublicKey }> {
  const client = new Client(connection, wallet)
  const name = client.initialize.generateMemberName()
  const memberPDA = client.pda.getMemberPDA(ORGANIZATION_NAME, name)

  //TODO: remove referrer localStorage here?

  return { instructions: await create(connection, wallet, name, referrer), memberPDA: memberPDA }
}

export async function getRemainingAccountsForTransfer(
  connection: Connection,
  wallet: PublicKey,
  memberPDA: PublicKey
): Promise<AccountMeta[]> {
  const client = new Client(connection, wallet)
  const remainingAccounts = await client.transfer.transferRewardsAccount(memberPDA, USDC_MINT)

  return [
    { pubkey: remainingAccounts.referrerAccount, isWritable: true, isSigner: false },
    { pubkey: remainingAccounts.referrerAccountRewards, isWritable: true, isSigner: false },
    { pubkey: remainingAccounts.referreeAccount, isWritable: true, isSigner: false },
    { pubkey: remainingAccounts.globalReferrerTreasury, isWritable: true, isSigner: false },
    { pubkey: remainingAccounts.globalReferrerTokenAccount, isWritable: true, isSigner: false },
    { pubkey: remainingAccounts.mint, isWritable: false, isSigner: false },
    { pubkey: remainingAccounts.referrerTokenAccount, isWritable: true, isSigner: false }
  ]
}
