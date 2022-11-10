import {
  GlowWalletAdapter,
  ExodusWalletAdapter,
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

export const getWalletAdapters = (network: WalletAdapterNetwork): any[] => [
  new PhantomWalletAdapter(),
  new GlowWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new ExodusWalletAdapter(),
  new SolletExtensionWalletAdapter({ network }),
  new SolletWalletAdapter({ network }),
  new SolongWalletAdapter(),
  new SlopeWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new SolanaMobileWalletAdapter({
    appIdentity: { name: 'Goosefx App' },
    authorizationResultCache: createDefaultAuthorizationResultCache(),
    cluster: network
  })
]
