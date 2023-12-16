import { FC, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
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

const DESKTOPWRAPPER = styled.div`
  ${tw`flex flex-row flex-nowrap`}
`
const MOBILEWRAPPER = styled.div`
  ${tw`flex flex-col `}
`
const Account: FC = () => {
  const [selected, setSelected] = useState(0)
  const [selectedMenuItem, setSelectedMenuItem] = useState<'Deposits' | 'Trades' | 'Funding'>('Deposits')
  return !checkMobile() ? (
    <DESKTOPWRAPPER>
      <Sidebar selected={selected} setSelected={setSelected} />
      {selected === 0 && <AccountOverview />}
      {selected === 2 && <DepositWithdrawHistory />}
      {selected === 3 && <Trades />}
      {selected === 4 && <FundingHistory />}
      {selected === 5 && <Liquidations />}
    </DESKTOPWRAPPER>
  ) : (
    <MOBILEWRAPPER>
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
    </MOBILEWRAPPER>
  )
}
export default Account
