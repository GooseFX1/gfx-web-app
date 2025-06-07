
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaDevnet, solanaTestnet } from '@reown/appkit/networks'
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo,
  useAppKitProvider
} from '@reown/appkit/react'
import type { Provider } from '@reown/appkit-adapter-solana/react'


import { APP_URL } from '@/constants'

const projectId = 'f294cea1e9cd00f0e185354688de6620'
const networks = [solana, solanaTestnet, solanaDevnet]

const solanaAdapter = new SolanaAdapter();

const modal = createAppKit({
  adapters: [solanaAdapter],
  networks,
  metadata: {
    name: 'GooseFX',
    description: 'GooseFX | Liquidity Reimagined',
    url: APP_URL,
    icons: ['https://media.goosefx.io/brand/Web_Clip.png']
  },
  projectId,
  themeVariables: {
    '--w3m-color-mix': '#00BB7F',
    '--w3m-border-radius-master': '4px',
    '--w3m-font-family': 'Poppins, sans-serif',
  },
  features: {
    analytics: true
  }
})

export {
  modal,
  useAppKit,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
  useAppKitNetwork,
  useDisconnect,
  useAppKitProvider,
  Provider
}
