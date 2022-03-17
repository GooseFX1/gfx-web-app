export const supportedData = [
  {
    id: '1',
    image: 'GOFX',
    name: 'GOFX',
    earned: '0',
    apr: '56%',
    rewards: '100% GOFX',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Single Sided'
  }
]
export const mockDataSource = [
  {
    id: '1',
    image: 'SRM-GOFX',
    name: 'SRM GOFX',
    earned: '0',
    apr: '56%',
    rewards: 'SRM 40% /  GOFX 60%',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Double Sided'
  },
  {
    id: '2',
    image: 'SRM-GOFX',
    name: 'SRM GOFX',
    earned: '0',
    apr: '56%',
    rewards: 'SRM 40% /  GOFX 60%',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: false,
    type: 'Double Sided'
  },
  {
    id: '3',
    image: 'SRM-GOFX',
    name: 'SRM GOFX',
    earned: '0',
    apr: '56%',
    rewards: 'SRM 40% /  GOFX 60%',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Double Sided'
  },
  {
    id: '4',
    image: 'SRM-GOFX',
    name: 'SRM GOFX',
    earned: '0',
    apr: '56%',
    rewards: 'SRM 40% /  GOFX 60%',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: false,
    type: 'Double Sided'
  },
  {
    id: '5',
    image: 'SRM-GOFX',
    name: 'SRM GOFX',
    earned: '0',
    apr: '56%',
    rewards: 'SRM 40% /  GOFX 60%',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Double Sided'
  },
  {
    id: '6',
    image: 'SRM-GOFX',
    name: 'SRM GOFX',
    earned: '0',
    apr: '56%',
    rewards: 'SRM 40% /  GOFX 60%',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Double Sided'
  },
  // Single Sided
  {
    id: '7',
    image: 'GOFX',
    name: 'GOFX',
    earned: '0',
    apr: '56%',
    rewards: '100% GOFX',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Single Sided'
  },
  {
    id: '8',
    image: 'SRM',
    name: 'SRM',
    earned: '0',
    apr: '22%',
    rewards: '100% SRM',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Single Sided'
  },
  {
    id: '9',
    image: 'SOL',
    name: 'SOL',
    earned: '0',
    apr: '200%',
    rewards: '100% SOL',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Single Sided'
  },
  {
    id: '10',
    image: 'GOFX',
    name: 'GOFX',
    earned: '0',
    apr: '120%',
    rewards: '100% GOFX',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Single Sided'
  },
  // Insurance
  {
    id: '11',
    image: 'GOFX',
    name: 'GOFX',
    earned: '0',
    apr: '56%',
    rewards: '100% GOFX',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Insurance'
  },
  {
    id: '12',
    image: 'SRM',
    name: 'SRM',
    earned: '0',
    apr: '22%',
    rewards: '100% SRM',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Insurance'
  },
  {
    id: '13',
    image: 'SOL',
    name: 'SOL',
    earned: '0',
    apr: '200%',
    rewards: '100% SOL',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Insurance'
  },
  {
    id: '14',
    image: 'GOFX',
    name: 'GOFX',
    earned: '0',
    apr: '120%',
    rewards: '100% GOFX',
    liquidity: '$ 350,114,029',
    volume: '$ 47,856',
    connected: true,
    type: 'Insurance'
  }
]

export const categories = [
  { name: 'All pools', icon: 'All pools' },
  { name: 'Single Sided', icon: 'Single Sided' }
  // { name: 'Double Sided', icon: 'Double Sided' },
  // { name: 'Insurance', icon: 'Insurance' }
]

export const stakedEarnedMockData = [
  {
    id: '0',
    title: 'Staked',
    value: '55.4589 SOL',
    price: '$ 13,254.67 usd'
  },
  {
    id: '1',
    title: 'Earned',
    value: '0.78234 SOL',
    price: '$ 187.761 usd'
  }
]

export const messageMockData = [
  {
    id: 0,
    info: {
      title: 'Stake deposit sucessfull!',
      icon: 'checked-border-icon',
      text1: 'You deposit 27.729 SOL',
      text2: 'Farm:  SOL - USDC'
    },
    error: {
      title: 'Stake deposit error!',
      icon: 'error-border-icon',
      text1: 'Please try again, if the error persist pelase contact support.'
    }
  },
  {
    id: 1,
    info: {
      title: 'Farm un stake and claim',
      icon: 'checked-border-icon',
      text1: 'You withdraw: 30.55 SOL',
      text2: 'Rewards: 0.78234 SOL',
      text3: 'Farm:  SOL - USDC '
    },
    error: {
      title: 'Unstake withdraw error!',
      icon: 'error-border-icon',
      text1: 'Please try again, if the error persist pelase contact support.'
    }
  }
]

export const stakeOrClaimInfoMockData = [
  {
    id: 0,
    value: '27.729 SOL',
    action: 'Stake'
  },
  {
    id: 1,
    value: '0.00 SOL',
    action: 'Unstake and claim'
  }
]
