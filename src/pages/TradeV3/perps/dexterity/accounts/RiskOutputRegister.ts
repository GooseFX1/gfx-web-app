import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RiskOutputRegisterFields {
  riskEngineOutput: types.HealthResultKind
}

export interface RiskOutputRegisterJSON {
  riskEngineOutput: types.HealthResultJSON
}

export class RiskOutputRegister {
  readonly riskEngineOutput: types.HealthResultKind

  static readonly discriminator = Buffer.from([
    39, 194, 173, 31, 222, 198, 229, 124,
  ])

  static readonly layout = borsh.struct([
    types.HealthResult.layout("riskEngineOutput"),
  ])

  constructor(fields: RiskOutputRegisterFields) {
    this.riskEngineOutput = fields.riskEngineOutput
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<RiskOutputRegister | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<RiskOutputRegister | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): RiskOutputRegister {
    if (!data.slice(0, 8).equals(RiskOutputRegister.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = RiskOutputRegister.layout.decode(data.slice(8))

    return new RiskOutputRegister({
      riskEngineOutput: types.HealthResult.fromDecoded(dec.riskEngineOutput),
    })
  }

  toJSON(): RiskOutputRegisterJSON {
    return {
      riskEngineOutput: this.riskEngineOutput.toJSON(),
    }
  }

  static fromJSON(obj: RiskOutputRegisterJSON): RiskOutputRegister {
    return new RiskOutputRegister({
      riskEngineOutput: types.HealthResult.fromJSON(obj.riskEngineOutput),
    })
  }
}
