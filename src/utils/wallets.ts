import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  SolongWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter
} from '@solana-mobile/wallet-adapter-mobile'

export const getWalletAdapters = (network: WalletAdapterNetwork) => [
  new PhantomWalletAdapter(),
  new GlowWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new SolongWalletAdapter(),
  new SolletExtensionWalletAdapter({ network }),
  new SolletWalletAdapter({ network }),
  new SlopeWalletAdapter(),
  new SolanaMobileWalletAdapter({
    appIdentity: { name: 'Goosefx App' },
    authorizationResultCache: createDefaultAuthorizationResultCache(),
    cluster: network
  })
]
