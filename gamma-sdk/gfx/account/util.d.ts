import { PublicKey, AccountInfo, RpcResponseAndContext, GetProgramAccountsResponse } from '@solana/web3.js';
import { TokenAccount, TokenAccountRaw } from './types.js';
import 'bn.js';
import '../../common/number.js';
import '../../marshmallow/buffer-layout.js';
import './layout.js';
import '../../marshmallow/index.js';

interface ParseTokenAccount {
    owner: PublicKey;
    solAccountResp?: AccountInfo<Buffer> | null;
    tokenAccountResp: RpcResponseAndContext<GetProgramAccountsResponse>;
}
declare function parseTokenAccountResp({ owner, solAccountResp, tokenAccountResp }: ParseTokenAccount): {
    tokenAccounts: TokenAccount[];
    tokenAccountRawInfos: TokenAccountRaw[];
};
declare function generatePubKey({ fromPublicKey, programId, }: {
    fromPublicKey: PublicKey;
    programId: PublicKey;
}): {
    publicKey: PublicKey;
    seed: string;
};

export { ParseTokenAccount, generatePubKey, parseTokenAccountResp };
