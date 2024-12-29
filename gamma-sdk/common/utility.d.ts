import { PublicKey } from '@solana/web3.js';
import { l as ReplaceType } from '../type-f1af695b.js';
import '@solana/spl-token';
import '../module/amount.js';
import 'bn.js';
import './number.js';
import './logger.js';
import '../module/fraction.js';
import '../module/token.js';
import './pubKey.js';
import '../module/currency.js';
import '../api/api.js';
import 'axios';
import '../solana/type.js';
import '../api/type.js';
import '../api/url.js';
import './txTool/txType.js';
import './owner.js';
import './txTool/lookupTable.js';

declare function sleep(ms: number): Promise<void>;
declare function getTimestamp(): number;
declare function notInnerObject(v: unknown): v is Record<string, any>;
declare function jsonInfo2PoolKeys<T>(jsonInfo: T): ReplaceType<T, string, PublicKey>;

export { getTimestamp, jsonInfo2PoolKeys, notInnerObject, sleep };
