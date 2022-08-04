import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  //LedgerWalletAdapter,
  SolongWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { createDefaultAuthorizationResultCache, SolanaMobileWalletAdapter } from '@solana-mobile/wallet-adapter-mobile'

export const getWalletAdapters = (network: WalletAdapterNetwork) => [
  new PhantomWalletAdapter(),
  new GlowWalletAdapter(),
  // new SlopeWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  //new LedgerWalletAdapter(),
  new SolongWalletAdapter(),
  new SolletExtensionWalletAdapter({ network }),
  new SolletWalletAdapter({ network }),
  new SolanaMobileWalletAdapter({
    appIdentity: { name: 'Goosefx App' },
    authorizationResultCache: createDefaultAuthorizationResultCache(),
    cluster: network
  })
]
