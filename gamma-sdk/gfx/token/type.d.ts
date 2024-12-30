import { GammaToken } from '../../api/type.js';
import { TokenProps } from '../../module/token.js';
import '@solana/web3.js';
import '../../common/pubKey.js';

type TokenInfo = GammaToken & {
    programId?: string;
    priority: number;
    userAdded?: boolean;
    type?: string;
};
interface TokenJson {
    symbol: string;
    name: string;
    mint: string;
    decimals: number;
    extensions: {
        coingeckoId?: string;
    };
    icon: string;
    hasFreeze?: boolean;
}
type SplToken = TokenProps & {
    icon: string;
    id: string;
    extensions: {
        [key in "coingeckoId" | "website" | "whitepaper"]?: string;
    };
    userAdded?: boolean;
};

export { SplToken, TokenInfo, TokenJson };
