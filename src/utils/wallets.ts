import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  LedgerWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  NightlyWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { WalletAdapterNetwork, WalletAdapter } from '@solana/wallet-adapter-base'
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter
} from '@solana-mobile/wallet-adapter-mobile'
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect'

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
    network: network == WalletAdapterNetwork.Testnet ? WalletAdapterNetwork.Devnet : network,
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
  new LedgerWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new Coin98WalletAdapter(),
  new CoinbaseWalletAdapter(),
  new NightlyWalletAdapter()
]
