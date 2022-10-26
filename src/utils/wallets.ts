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
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter
} from '@solana-mobile/wallet-adapter-mobile'

export const getWalletAdapters = (network: WalletAdapterNetwork) => [
  new SolanaMobileWalletAdapter({
    addressSelector: createDefaultAddressSelector(),
    appIdentity: {
      name: 'GooseFX',
      uri: 'https://goosefx.io/',
      icon: '/img/assets/GOFX-icon.svg'
    },
    authorizationResultCache: createDefaultAuthorizationResultCache(),
    cluster: network,
    onWalletNotFound: createDefaultWalletNotFoundHandler()
  }),
  new PhantomWalletAdapter(),
  new GlowWalletAdapter({ network }),
  new SolflareWalletAdapter({ network }),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new SolongWalletAdapter(),
  new SolletExtensionWalletAdapter({ network }),
  new SolletWalletAdapter({ network }),
  new SlopeWalletAdapter()
]
