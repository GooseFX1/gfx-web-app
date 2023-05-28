import {
  BackpackWalletAdapter,
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  LedgerWalletAdapter,
  BraveWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  NightlyWalletAdapter,
  ExodusWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { WalletAdapter } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter
} from '@solana-mobile/wallet-adapter-mobile'

export const getWalletAdapters = (network: WalletAdapterNetwork): WalletAdapter[] => [
  new SolanaMobileWalletAdapter({
    addressSelector: createDefaultAddressSelector(),
    appIdentity: {
      name: 'GooseFX',
      uri: 'https://app.goosefx.io/',
      icon: '/img/assets/GOFX-icon.svg'
    },
    authorizationResultCache: createDefaultAuthorizationResultCache(),
    cluster: network,
    onWalletNotFound: createDefaultWalletNotFoundHandler()
  }),
  new BackpackWalletAdapter(),
  new PhantomWalletAdapter(),
  new GlowWalletAdapter({ network }),
  new SolflareWalletAdapter({ network }),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new LedgerWalletAdapter(),
  new BraveWalletAdapter(),
  new Coin98WalletAdapter(),
  new CoinbaseWalletAdapter(),
  new NightlyWalletAdapter(),
  new ExodusWalletAdapter()
]
