import {
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  NightlyWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  WalletConnectWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { WalletAdapter, WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter
} from '@solana-mobile/wallet-adapter-mobile'
import { MoongateWalletAdapter } from '@moongate/moongate-adapter'

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
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      relayUrl: 'wss://relay.walletconnect.com',
      projectId: 'f294cea1e9cd00f0e185354688de6620',
      metadata: {
        name: 'GooseFX',
        description: 'Solana Defi',
        url: 'https://goosefx.io',
        icons: ['https://media.goosefx.io/logos/Web_Clip.svg']
      }
    }
  }),
  new MoongateWalletAdapter({ position: 'bottom-right' }),
  new LedgerWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new Coin98WalletAdapter(),
  new CoinbaseWalletAdapter(),
  new NightlyWalletAdapter()
]
