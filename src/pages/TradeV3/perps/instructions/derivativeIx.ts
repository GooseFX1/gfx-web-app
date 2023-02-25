/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import instruments from '../idl/instruments.json'
import * as anchor from '@project-serum/anchor'
import { Connection, SystemProgram } from '@solana/web3.js'
import { INSTRUMENTS_ID } from '../perpsConstants'
import { Program } from '@project-serum/anchor'
import { sendPerpsTransaction } from '../../../NFTs/launchpad/candyMachine/connection'

const getInstrumentsProgram = async (connection: Connection, wallet: any) => {
  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions())
  const idl_o: any = instruments
  return new Program(idl_o, INSTRUMENTS_ID, provider)
}

export const initializeDerivative = async (accounts, params, wallet: any, connection: Connection) => {
  const program = await getInstrumentsProgram(connection, wallet)

  const ix = await program.instruction.initializeDerivative(params, {
    accounts: {
      derivativeMetadata: accounts.derivativeMetadata,
      priceOracle: accounts.priceOracle,
      marketProductGroup: accounts.marketProductGroup,
      payer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      clock: accounts.clock
    }
  })

  const response = await sendPerpsTransaction(connection, wallet, [ix], [])
  return response
}
