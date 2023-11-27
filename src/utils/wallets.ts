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
      projectId: process.env.REACT_APP_WALLETCONNECT_ID
    }
  }),
  new LedgerWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new Coin98WalletAdapter(),
  new CoinbaseWalletAdapter(),
  new NightlyWalletAdapter()
]
