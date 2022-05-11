export const feesColumns = [
  {
    title: 'Fee Tier',
    dataIndex: 'feeTier',
    key: 'feeTier'
  },
  {
    title: 'Holding Requierments',
    dataIndex: 'holding',
    key: 'holding'
  },
  {
    title: 'Taker',
    dataIndex: 'taker',
    key: 'taker'
  },
  {
    title: 'Maker',
    dataIndex: 'maker',
    key: 'maker'
  }
]
export const dataSource = [
  {
    key: '1',
    feeTier: '0',
    holding: '< 100',
    taker: '0.04%',
    maker: '0%',
    amount: 100
  },
  {
    key: '2',
    feeTier: '1',
    holding: '100',
    taker: '0.039%',
    maker: '0%',
    amount: 1000
  },
  {
    key: '3',
    feeTier: '2',
    holding: '1000',
    taker: '0.038%',
    maker: '0%',
    amount: 10000
  },
  {
    key: '4',
    feeTier: '3',
    holding: '10,000',
    taker: '0.036%',
    maker: '0%',
    amount: 100000
  },
  {
    key: '5',
    feeTier: '4',
    holding: '100,000',
    taker: '0.034%',
    maker: '0%',
    amount: 1000000
  },
  {
    key: '6',
    feeTier: '5',
    holding: '1,000,000',
    taker: '0.032%',
    maker: '0%',
    amount: 1000001
  },
  {
    key: '7',
    feeTier: '6',
    holding: '+1,000,000',
    taker: '0.03%',
    maker: '0%',
    amount: -1
  }
]
