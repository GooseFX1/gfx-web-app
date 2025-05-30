import { FC } from 'react'
import { useWallet } from '@/hooks/useWallet'
import PortfolioConnect from './PortfolioConnect'
import PortfolioScreen from './PortfolioScreen'

const Portfolio: FC = () => {
  const { connected } = useWallet()
  return <div>{connected ? <PortfolioScreen /> : <PortfolioConnect />}</div>
}

export default Portfolio
