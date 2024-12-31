import { PublicKey } from '@solana/web3.js';
import BN__default from 'bn.js';
import { BigNumberish } from '../../common/number.js';
import { GetStructureSchema } from '../../marshmallow/buffer-layout.js';
import { splAccountLayout } from './layout.js';
import '../../marshmallow/index.js';

type SplAccountLayout = typeof splAccountLayout;
type SplAccount = GetStructureSchema<SplAccountLayout>;
interface TokenAccountRaw {
    programId: PublicKey;
    pubkey: PublicKey;
    accountInfo: SplAccount;
}
interface TokenAccount {
    publicKey?: PublicKey;
    mint: PublicKey;
    isAssociated?: boolean;
    amount: BN__default;
    isNative: boolean;
    programId: PublicKey;
}
interface getCreatedTokenAccountParams {
    mint: PublicKey;
    config?: {
        associatedOnly?: boolean;
    };
}
interface HandleTokenAccountParams {
    side: "in" | "out";
    amount: BigNumberish;
    mint: PublicKey;
    programId?: PublicKey;
    tokenAccount?: PublicKey;
    payer?: PublicKey;
    bypassAssociatedCheck: boolean;
    skipCloseAccount?: boolean;
    checkCreateATAOwner?: boolean;
}
interface GetOrCreateTokenAccountParams {
    mint: PublicKey;
    owner: PublicKey;
    createInfo?: {
        payer: PublicKey;
        amount?: BigNumberish;
    };
    associatedOnly: boolean;
    notUseTokenAccount?: boolean;
    skipCloseAccount?: boolean;
    tokenProgram?: PublicKey | string;
    checkCreateATAOwner?: boolean;
}

export { GetOrCreateTokenAccountParams, HandleTokenAccountParams, SplAccount, SplAccountLayout, TokenAccount, TokenAccountRaw, getCreatedTokenAccountParams };
