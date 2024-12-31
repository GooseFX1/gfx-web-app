import { PublicKey } from '@solana/web3.js';

declare function getATAAddress(owner: PublicKey, mint: PublicKey, programId?: PublicKey): {
    publicKey: PublicKey;
    nonce: number;
};

export { getATAAddress };
