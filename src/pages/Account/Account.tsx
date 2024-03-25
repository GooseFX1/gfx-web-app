import { FC, useState } from 'react'

import AccountOverview from './components/AccountOverview'
import Sidebar from './components/Sidebar'
import DepositWithdrawHistory from './components/DepositWithdaw'
import Trades from './components/Trades'
import FundingHistory from './components/FundingHistory'
import Liquidations from './components/Liquidations'
import { checkMobile } from '../../utils'
import { MobileNav } from './components/Mobile/MobileNav'
import MobileAccountOverview from './components/Mobile/AccountOverview'
import MobileDepositWithdrawHistory from './components/Mobile/DepositWithdaw'
import MobileTrades from './components/Mobile/Trades'
import MobileFundingHistory from './components/Mobile/FundingHistory'

const Account: FC = () => {
  const [selected, setSelected] = useState(0)
  const [selectedMenuItem, setSelectedMenuItem] = useState<'Deposits' | 'Trades' | 'Funding'>('Deposits')
  return !checkMobile() ? (
    <div className="no-scrollbar flex flex-row flex-nowrap">
      <Sidebar selected={selected} setSelected={setSelected} />
      {selected === 0 && <AccountOverview />}
      {selected === 2 && <DepositWithdrawHistory />}
      {selected === 3 && <Trades />}
      {selected === 4 && <FundingHistory />}
      {selected === 5 && <Liquidations />}
    </div>
  ) : (
    <div className={'flex flex-col'}>
      <MobileNav
        selected={selected}
        setSelected={setSelected}
        selectedMenuItem={selectedMenuItem}
        setSelectedMenuItem={setSelectedMenuItem}
      />
      {selected === 0 && <MobileAccountOverview />}
      {selected == 1 && selectedMenuItem === 'Deposits' && <MobileDepositWithdrawHistory />}
      {selected == 1 && selectedMenuItem === 'Trades' && <MobileTrades />}
      {selected == 1 && selectedMenuItem === 'Funding' && <MobileFundingHistory />}
    </div>
  )
}
export default Account
