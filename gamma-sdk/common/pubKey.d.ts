import { AccountMeta, PublicKey } from '@solana/web3.js';

interface AccountMetaProps {
    pubkey: PublicKey;
    isSigner?: boolean;
    isWritable?: boolean;
}
declare function accountMeta({ pubkey, isSigner, isWritable }: AccountMetaProps): AccountMeta;
declare const commonSystemAccountMeta: AccountMeta[];
type PublicKeyish = PublicKey | string;
declare function validateAndParsePublicKey({ publicKey: orgPubKey, transformSol, }: {
    publicKey: PublicKeyish;
    transformSol?: boolean;
}): PublicKey;
declare function tryParsePublicKey(v: string): PublicKey | string;
declare const MEMO_PROGRAM_ID: PublicKey;
declare const MEMO_PROGRAM_ID2: PublicKey;
declare const RENT_PROGRAM_ID: PublicKey;
declare const CLOCK_PROGRAM_ID: PublicKey;
declare const METADATA_PROGRAM_ID: PublicKey;
declare const INSTRUCTION_PROGRAM_ID: PublicKey;
declare const SYSTEM_PROGRAM_ID: PublicKey;
declare const RAYMint: PublicKey;
declare const PAIMint: PublicKey;
declare const SRMMint: PublicKey;
declare const USDCMint: PublicKey;
declare const USDTMint: PublicKey;
declare const mSOLMint: PublicKey;
declare const stSOLMint: PublicKey;
declare const USDHMint: PublicKey;
declare const NRVMint: PublicKey;
declare const ANAMint: PublicKey;
declare const ETHMint: PublicKey;
declare const WSOLMint: PublicKey;
declare const SOLMint: PublicKey;
declare function solToWSol(mint: PublicKeyish): PublicKey;

export { ANAMint, CLOCK_PROGRAM_ID, ETHMint, INSTRUCTION_PROGRAM_ID, MEMO_PROGRAM_ID, MEMO_PROGRAM_ID2, METADATA_PROGRAM_ID, NRVMint, PAIMint, PublicKeyish, RAYMint, RENT_PROGRAM_ID, SOLMint, SRMMint, SYSTEM_PROGRAM_ID, USDCMint, USDHMint, USDTMint, WSOLMint, accountMeta, commonSystemAccountMeta, mSOLMint, solToWSol, stSOLMint, tryParsePublicKey, validateAndParsePublicKey };
