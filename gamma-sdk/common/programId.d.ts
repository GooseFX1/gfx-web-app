import { PublicKey } from '@solana/web3.js';

declare const FEE_DESTINATION_ID: PublicKey;
declare const CREATE_CPMM_POOL_PROGRAM: PublicKey;
declare const CREATE_CPMM_POOL_AUTH: PublicKey;
declare const CREATE_CPMM_POOL_FEE_ACC: PublicKey;
declare const DEV_CREATE_CPMM_POOL_PROGRAM: PublicKey;
declare const DEV_CREATE_CPMM_POOL_AUTH: PublicKey;
declare const DEV_CREATE_CPMM_POOL_FEE_ACC: PublicKey;
declare const ALL_PROGRAM_ID: {
    CREATE_CPMM_POOL_PROGRAM: PublicKey;
    CREATE_CPMM_POOL_AUTH: PublicKey;
    CREATE_CPMM_POOL_FEE_ACC: PublicKey;
};
type ProgramIdConfig = Partial<typeof ALL_PROGRAM_ID>;
declare const DEVNET_PROGRAM_ID: {
    CREATE_CPMM_POOL_PROGRAM: PublicKey;
    CREATE_CPMM_POOL_AUTH: PublicKey;
    CREATE_CPMM_POOL_FEE_ACC: PublicKey;
    FEE_DESTINATION_ID: PublicKey;
};

export { ALL_PROGRAM_ID, CREATE_CPMM_POOL_AUTH, CREATE_CPMM_POOL_FEE_ACC, CREATE_CPMM_POOL_PROGRAM, DEVNET_PROGRAM_ID, DEV_CREATE_CPMM_POOL_AUTH, DEV_CREATE_CPMM_POOL_FEE_ACC, DEV_CREATE_CPMM_POOL_PROGRAM, FEE_DESTINATION_ID, ProgramIdConfig };
