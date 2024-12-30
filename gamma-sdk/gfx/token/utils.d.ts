import { Connection, PublicKey } from '@solana/web3.js';
import { RawMint, TransferFeeConfig } from '@solana/spl-token';
import { TokenAmount } from '../../module/amount.js';
import { BigNumberish } from '../../common/number.js';
import { Token } from '../../module/token.js';
import { TokenInfo } from './type.js';
import { JupiterListToken } from '../../api/type.js';
import 'bn.js';
import '../../common/logger.js';
import '../../module/fraction.js';
import '../../module/currency.js';
import '../../common/pubKey.js';

declare const parseTokenInfo: ({ connection, mint, }: {
    connection: Connection;
    mint: PublicKey | string;
}) => Promise<RawMint | undefined>;
declare const toTokenInfo: ({ mint, decimals, programId, logoURI, priority, }: {
    mint: PublicKey;
    decimals: number;
    programId?: PublicKey | string;
    priority?: number;
    logoURI?: string;
}) => TokenInfo;
declare const toToken: (props: Omit<TokenInfo, "priority">) => Token;
declare const toTokenAmount: ({ amount, isRaw, name, ...props }: Omit<TokenInfo, "priority"> & {
    amount: BigNumberish;
    isRaw?: boolean;
    name?: string;
}) => TokenAmount;
declare function solToWSolToken<T extends JupiterListToken | TokenInfo>(token: T): T;
declare function wSolToSolToken<T extends JupiterListToken | TokenInfo>(token: T): T;
declare const toGammaApiToken: ({ address, programId, decimals, ...props }: {
    address: string;
    programId: string;
    decimals: number;
} & Partial<JupiterListToken>) => JupiterListToken & {
    programId: string;
};
declare const toFeeConfig: (config?: TransferFeeConfig) => JupiterListToken["extensions"]["feeConfig"] | undefined;

export { parseTokenInfo, solToWSolToken, toFeeConfig, toGammaApiToken, toToken, toTokenAmount, toTokenInfo, wSolToSolToken };
