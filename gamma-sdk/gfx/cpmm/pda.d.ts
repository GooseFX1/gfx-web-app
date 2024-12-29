import { PublicKey } from '@solana/web3.js';

declare function getPdaPoolAuthority(programId: PublicKey): {
    publicKey: PublicKey;
    nonce: number;
};
declare function getCpmmPdaAmmConfigId(programId: PublicKey, index: number): {
    publicKey: PublicKey;
    nonce: number;
};
declare function getCpmmPdaPoolId(programId: PublicKey, ammConfigId: PublicKey, mintA: PublicKey, mintB: PublicKey): {
    publicKey: PublicKey;
    nonce: number;
};
declare function getPdaLpMint(programId: PublicKey, poolId: PublicKey): {
    publicKey: PublicKey;
    nonce: number;
};
declare function getPdaVault(programId: PublicKey, poolId: PublicKey, mint: PublicKey): {
    publicKey: PublicKey;
    nonce: number;
};
declare function getPdaObservationId(programId: PublicKey, poolId: PublicKey): {
    publicKey: PublicKey;
    nonce: number;
};
declare function getPdaUserLiquidity(programId: PublicKey, poolId: PublicKey, owner: PublicKey): {
    publicKey: PublicKey;
    nonce: number;
};
declare function getCreatePoolKeys({ programId, configId, mintA, mintB, }: {
    programId: PublicKey;
    configId: PublicKey;
    mintA: PublicKey;
    mintB: PublicKey;
}): {
    poolId: PublicKey;
    configId: PublicKey;
    authority: PublicKey;
    vaultA: PublicKey;
    vaultB: PublicKey;
    observationId: PublicKey;
};

export { getCpmmPdaAmmConfigId, getCpmmPdaPoolId, getCreatePoolKeys, getPdaLpMint, getPdaObservationId, getPdaPoolAuthority, getPdaUserLiquidity, getPdaVault };
