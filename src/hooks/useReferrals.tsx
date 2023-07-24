import { useWallet } from '@solana/wallet-adapter-react'
import { useCallback, useEffect, useState } from 'react'
import { Client, Member, Treasury } from '@ladderlabs/buddy-sdk'
import { AccountMeta, Connection, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { useConnectionConfig } from '../context'
import { BN } from '@project-serum/anchor'

// TODO: move to proper constant file?
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const CLIENT_NOT_SET = 'Client is not initialized'
const ORGANIZATION_NAME = 'goose'

export default function useReferrals(): IReferrals {
  const [client, setClient] = useState<Client | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const { publicKey } = useWallet()
  const { connection } = useConnectionConfig()
  useEffect(() => {
    if (connection && publicKey) {
      const client = new Client(connection, publicKey)

      setClient(client)
    }
  }, [connection, publicKey])

  const getMember = useCallback(async () => {
    if (!client) throw CLIENT_NOT_SET

    if (member) return member
    const buddyProfile = await client.buddy.getProfile(publicKey)
    if (!buddyProfile) return null
    const treasuryPDA = client.pda.getTreasuryPDA([buddyProfile.account.pda], [10_000], USDC_MINT)

    // Assumes always only 1 members
    const account = (await client.member.getByTreasuryOwner(treasuryPDA))[0]

    setMember(account)
    return account
  }, [client, publicKey])

  const getName = useCallback(async () => {
    if (!client) throw CLIENT_NOT_SET
    const member = await getMember()

    return member?.account?.name
  }, [client])

  const isNameAvailable = useCallback(
    async (name: string) => {
      if (!client) throw CLIENT_NOT_SET
      return client.member.isMemberAvailable(ORGANIZATION_NAME, name)
    },
    [client]
  )

  const getTreasury = useCallback(async () => {
    if (!client) throw CLIENT_NOT_SET

    return (await (await getMember())?.getOwner()) || null
  }, [client])

  const claim = useCallback(async () => {
    if (!client) throw CLIENT_NOT_SET

    const treasury = await getTreasury()

    return treasury.claim()
  }, [client])

  const createRandomBuddy = useCallback(
    async (referrer: string) => {
      if (!client) throw CLIENT_NOT_SET

      return (await createRandom(connection, publicKey, referrer)).instructions
    },
    [client]
  )

  const getReferred = useCallback(async () => {
    const treasury = await getTreasury()

    return treasury ? await client.member.getByTreasuryReferrer(treasury.account.pda) : null
  }, [])
  const getTotalClaimed = useCallback(async () => {
    const treasury = await getTreasury()
    const buddy = await client.buddy.getProfile(publicKey)
    const zeroBN = new BN(0.0)
    if (!buddy || !treasury) return zeroBN
    const owners = treasury.account.owners.filter((owner) => owner.ownerPda.equals(buddy.account.pda))
    if (owners.length === 0) return zeroBN
    return owners[0].withMultiLevel.claimed
  }, [publicKey])
  return {
    isReady: !!client,
    getMember,
    getName,
    getReferred,
    isNameAvailable,
    getTreasury,
    claim,
    createRandomBuddy,
    referrer: localStorage.getItem('referrer'),
    getTotalClaimed
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
  createRandomBuddy: (referrer: string) => Promise<TransactionInstruction[]>
  referrer: string
  getTotalClaimed: () => Promise<BN>
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
  const name = Client.generateMemberName()
  const memberPDA = client.pda.getMemberPDA(ORGANIZATION_NAME, name)

  const buddyProfile = await client.buddy.getProfile(wallet)

  if (buddyProfile) {
    const treasuryPDA = client.pda.getTreasuryPDA([buddyProfile.account.pda], [10_000], USDC_MINT)

    // Assumes always only 1 members
    const member = (await client.member.getByTreasuryOwner(treasuryPDA))[0]

    // Skips create member if a member already exists
    if (member) return { instructions: [], memberPDA: PublicKey.default }
  }

  const isReferrerValid = await client.initialize.isReferrerValid(referrer, ORGANIZATION_NAME)

  return {
    instructions: await create(connection, wallet, name, referrer),
    memberPDA: isReferrerValid ? memberPDA : PublicKey.default
  }
}

export async function getRemainingAccountsForTransfer(
  connection: Connection,
  wallet: PublicKey,
  memberPDA?: PublicKey
): Promise<AccountMeta[]> {
  const client = new Client(connection, wallet)
  const remainingAccounts = await client.transfer.transferRewardsAccount(memberPDA, USDC_MINT)

  if (remainingAccounts.referrerAccount.toString() === PublicKey.default.toString()) {
    return [
      { pubkey: remainingAccounts.referrerAccount, isWritable: false, isSigner: false },
      { pubkey: remainingAccounts.referrerAccountRewards, isWritable: false, isSigner: false },
      { pubkey: remainingAccounts.referreeAccount, isWritable: false, isSigner: false },
      { pubkey: remainingAccounts.globalReferrerTreasury, isWritable: false, isSigner: false },
      { pubkey: remainingAccounts.globalReferrerTokenAccount, isWritable: false, isSigner: false },
      { pubkey: remainingAccounts.mint, isWritable: false, isSigner: false },
      { pubkey: remainingAccounts.referrerTokenAccount, isWritable: false, isSigner: false }
    ]
  } else {
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
}

export function getProgramId(connection: Connection, wallet: PublicKey): PublicKey {
  const client = new Client(connection, wallet)

  return client.getProgramId()
}
