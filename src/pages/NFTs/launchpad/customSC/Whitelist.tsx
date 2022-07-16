import { useWallet } from '@solana/wallet-adapter-react'
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} from '@solana/web3.js'
import React, { FC } from 'react'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import {
  pdaWhitelistSeed,
  MAGIC_HAT_PROGRAM_V2_ID,
  COMMUNITY_TIME,
  pdaSeed,
  MAGIC_HAT_CREATOR,
  whiteListAddresses,
  PUBLIC_TIME,
  whiteListAddressesOne
} from './config'
import * as anchor from '@project-serum/anchor'
import idl from './magic_hat.json'
import { Program, BN } from '@project-serum/anchor'
import Borsh from '@project-serum/borsh'
import { notify } from '../../../../utils'
import { getWalletWhitelistPda, getWhitelistConfigPda } from '../candyMachine/candyMachine'

export const Whitelist: FC = () => {
  const { candyMachine, candyMachineState } = useNFTLPSelected()
  const wallet = useWallet()
  let connection = new Connection(clusterApiUrl('devnet'))

  const getProgram = async () => {
    const wallet_t: any = wallet
    const provider = new anchor.Provider(connection, wallet_t, anchor.Provider.defaultOptions())
    const idl_o: any = idl
    return new Program(idl_o, MAGIC_HAT_PROGRAM_V2_ID, provider)
  }

  const createWhitelistConfig = async () => {
    try {
      const walletProgram = await getProgram()
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      )
      console.log(walletProgram)
      //let config_t: any = Borsh.struct(JSON.stringify(config))
      const wallet_create = await walletProgram.rpc.createWhitelistConfig(
        new BN(5),
        new BN(2 * LAMPORTS_PER_SOL),
        new BN(PUBLIC_TIME),
        new BN(0),
        new BN(3 * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        new BN(5),
        new BN(1 * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        new BN(5),
        new BN(1.5 * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        {
          accounts: {
            whitelistConfig: whitelist_config_pda,
            magicHatCreator: wallet.publicKey,
            systemProgram: SystemProgram.programId
          }
        }
      )
      const whitelistConfigAccounts = await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda)
      console.log(whitelistConfigAccounts)
      return { whitelistConfigAccounts }
    } catch (error) {
      console.log('Transaction error: ', error)
    }
  }

  const updateWhitelistConfig = async () => {
    const walletProgram = await getProgram()
    try {
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      )
      const wallet_create = await walletProgram.rpc.updateWhitelistConfig(
        new BN(0),
        new BN(1 * LAMPORTS_PER_SOL),
        new BN(PUBLIC_TIME),
        new BN(0),
        new BN(3 * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        new BN(12),
        new BN(1 * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        new BN(12),
        new BN(1 * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        {
          accounts: {
            whitelistConfig: whitelist_config_pda,
            magicHatCreator: wallet.publicKey
          }
        }
      )
      const whitelistConfigAccounts = await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda)
      console.log(whitelistConfigAccounts)
      // return { whitelistConfigAccounts };
    } catch (error) {
      console.log('Transaction error: ', error)
    }
  }

  const createWhitelistAccountPublic = async () => {
    const walletProgram = await getProgram()
    try {
      const [wallet_pda, wallet_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      )
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), MAGIC_HAT_CREATOR.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      )
      const wallet_create = await walletProgram.rpc.createWhitelistAccountPublic({
        accounts: {
          walletWhitelist: wallet_pda,
          whitelistConfig: whitelist_config_pda,
          whitelistedAddress: wallet.publicKey,
          systemProgram: SystemProgram.programId
        }
      })
      //const whitelistAccounts = await walletProgram.account.walletWhitelist.fetch(wallet_pda)
      //console.log(whitelistAccounts)
      return true
      // return { whitelistAccounts };
    } catch (error) {
      console.log('Transaction error: ', error)
      return false
    }
  }

  const createWhitelistAccount = async (whitelisting_address: PublicKey) => {
    const walletProgram = await getProgram()
    try {
      const [wallet_pda, wallet_bump] = await getWalletWhitelistPda(whitelisting_address)

      const [whitelist_config_pda, bump] = await getWhitelistConfigPda(wallet.publicKey)

      const wallet_create = await walletProgram.rpc.createWhitelistAccount('Two', {
        accounts: {
          walletWhitelist: wallet_pda,
          whitelistConfig: whitelist_config_pda,
          whitelistedAddress: whitelisting_address,
          magicHatCreator: wallet.publicKey,
          systemProgram: SystemProgram.programId
        }
      })
      return true
      // return { whitelistAccounts };
    } catch (error) {
      console.log('Transaction error: ', error)
      return false
    }
  }

  const createWhitelistAccountOne = async (whitelisting_address: PublicKey) => {
    const walletProgram = await getProgram()
    try {
      const [wallet_pda, wallet_bump] = await getWalletWhitelistPda(whitelisting_address)

      const [whitelist_config_pda, bump] = await getWhitelistConfigPda(wallet.publicKey)

      const wallet_create = await walletProgram.rpc.createWhitelistAccount('One', {
        accounts: {
          walletWhitelist: wallet_pda,
          whitelistConfig: whitelist_config_pda,
          whitelistedAddress: whitelisting_address,
          magicHatCreator: wallet.publicKey,
          systemProgram: SystemProgram.programId
        }
      })
      return true
      // return { whitelistAccounts };
    } catch (error) {
      console.log('Transaction error: ', error)
      return false
    }
  }

  const multipleWhitelists = async () => {
    let tx = new Transaction()
    for (let i = 0; i < whiteListAddresses.length; i++) {
      let key = new PublicKey(whiteListAddresses[i])
      let response = await createWhitelistAccount(key)
      if (response) {
        notify({
          message: 'success for: ' + whiteListAddresses[i]
        })
      } else {
        notify({
          message: 'failure for: ' + whiteListAddresses[i]
        })
      }
    }
  }

  const multipleWhitelistsOne = async () => {
    let tx = new Transaction()
    for (let i = 0; i < whiteListAddressesOne.length; i++) {
      let key = new PublicKey(whiteListAddresses[i])
      let response = await createWhitelistAccountOne(key)
      if (response) {
        notify({
          message: 'success for: ' + whiteListAddresses[i]
        })
      } else {
        notify({
          message: 'failure for: ' + whiteListAddresses[i]
        })
      }
    }
  }

  return (
    <div style={{ position: 'relative', top: '100px' }}>
      <button style={{ background: 'red' }} onClick={createWhitelistConfig}>
        Create Whitelist Config
      </button>
      <button style={{ background: 'red' }} onClick={updateWhitelistConfig}>
        Update Whitelist Config
      </button>
      <button style={{ background: 'red' }} onClick={multipleWhitelists}>
        Create whitelisted account TWO
      </button>
      <button style={{ background: 'red' }} onClick={multipleWhitelistsOne}>
        Create whitelisted account ONE
      </button>
    </div>
  )
}
