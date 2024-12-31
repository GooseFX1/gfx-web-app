import { TokenInfo } from './type.js';
import '../../api/type.js';
import '../../module/token.js';
import '@solana/web3.js';
import '../../common/pubKey.js';

declare const SOL_INFO: TokenInfo;
declare const TOKEN_WSOL: TokenInfo;

export { SOL_INFO, TOKEN_WSOL };
