/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react'

import AccountOverview from './components/AccountOverview'
import Sidebar, { SideBarTabs } from './components/Sidebar'
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
    <div className="no-scrollbar flex flex-row flex-nowrap overflow-hidden">
      <Sidebar selected={selected} setSelected={setSelected} />
      {selected === 0 && <AccountOverview />}
      {selected === 1 && <DepositWithdrawHistory />}
      {selected === 2 && <Trades />}
      {selected === 3 && <FundingHistory />}
      {selected === 4 && <Liquidations />}
    </div>
  ) : (
    <div className={'flex flex-col'}>
      <SideBarTabs selected={selected} setSelected={setSelected} />
      {selected === 0 && <AccountOverview />}
      {selected === 1 && <MobileDepositWithdrawHistory />}
      {selected === 2 && <MobileTrades />}
      {selected === 3 && <MobileFundingHistory />}
    </div>
  )
}
export default Account
