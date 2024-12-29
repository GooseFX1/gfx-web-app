declare enum TxVersion {
    "V0" = 0,
    "LEGACY" = 1
}
declare const InstructionType: {
    CreateAccount: string;
    InitAccount: string;
    CreateATA: string;
    CloseAccount: string;
    TransferAmount: string;
    InitMint: string;
    MintTo: string;
    SetComputeUnitPrice: string;
    SetComputeUnitLimit: string;
    CpmmInitUserLiquidity: string;
    CpmmCreatePool: string;
    CpmmAddLiquidity: string;
    CpmmWithdrawLiquidity: string;
    CpmmSwapBaseIn: string;
    CpmmSwapBaseOut: string;
};

export { InstructionType, TxVersion };
