import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  LedgerWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  NightlyWalletAdapter
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
      icon: '/img/crypto/GOFX.svg'
    },
    authorizationResultCache: createDefaultAuthorizationResultCache(),
    cluster: network,
    onWalletNotFound: createDefaultWalletNotFoundHandler()
  }),
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new LedgerWalletAdapter(),
  new Coin98WalletAdapter(),
  new CoinbaseWalletAdapter(),
  new NightlyWalletAdapter()
]
