import { AddressLookupTableAccount, Connection, PublicKey } from '@solana/web3.js';

interface CacheLTA {
    [key: string]: AddressLookupTableAccount;
}
declare function getMultipleLookupTableInfo({ connection, address, }: {
    connection: Connection;
    address: PublicKey[];
}): Promise<CacheLTA>;
declare const LOOKUP_TABLE_CACHE: CacheLTA;

export { CacheLTA, LOOKUP_TABLE_CACHE, getMultipleLookupTableInfo };
