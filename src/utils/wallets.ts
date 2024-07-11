import {
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  NightlyWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { WalletAdapter, WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter
} from '@solana-mobile/wallet-adapter-mobile'
import { MoongateWalletAdapter } from '@moongate/moongate-adapter'
import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter'

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
  new MoongateWalletAdapter({ position: 'bottom-right' }),
  new LedgerWalletAdapter(),
    new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      projectId: 'bd4997ce3ede37c95770ba10a3804dad'
    }
  }),
  new CoinbaseWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new Coin98WalletAdapter(),
  new NightlyWalletAdapter()
]
