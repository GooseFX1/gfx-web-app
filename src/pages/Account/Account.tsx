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

const WRAPPER = styled.div`
  ${tw`flex flex-row flex-nowrap`}
`
const Account: FC = () => {
  const [selected, setSelected] = useState(0)
  return (
    <WRAPPER>
      <Sidebar selected={selected} setSelected={setSelected} />
      {selected === 0 && <AccountOverview />}
      {selected === 2 && <DepositWithdrawHistory />}
      {selected === 3 && <Trades />}
      {selected === 4 && <FundingHistory />}
      {selected === 5 && <Liquidations />}
    </WRAPPER>
  )
}

export default Account
