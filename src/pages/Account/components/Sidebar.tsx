import { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Tabs, TabsList, TabsTrigger, cn } from 'gfx-component-lib'
import { TitleLabel } from '@/pages/TradeV3/perps/components/PerpsGenericComp'

const WRAPPER = styled.div`
  ${tw`flex flex-col px-5  w-36`}
`

type SidebarProps = {
  selected: number
  setSelected: React.Dispatch<React.SetStateAction<number>>
}
const Sidebar: FC<SidebarProps> = ({ selected, setSelected }) => {
  const handleClick = (num: number) => {
    setSelected(num)
  }
  const tabs = ['Overview', 'Deposits', 'Trades', 'Funding']

  return (
    <WRAPPER
      className="flex flex-col px-5 pb-0 mb-0 w-36 h-[calc(100vh - 56px - 40px)]
    !border-l-0 border-t-0 border-b-0 border border-r-black-4 dark:border-t-0 dark:border-b-0"
    >
      <Tabs defaultValue="0" className="!dark:bg-black-1 bg-grey-5">
        <TabsList className="flex flex-col mt-2 dark:!bg-black-1  ">
          {tabs.map((elem, index) => (
            <TabsTrigger
              className={cn('w-full h-8.75 dark:!bg-black-1')}
              size="xl"
              key={index}
              value={index.toString()}
              variant="primary"
              onClick={() => handleClick(index)}
            >
              <TitleLabel whiteText={selected === index}>{elem}</TitleLabel>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* {tabs.map((tab, index) => (
        <SPAN key={tab} className={selected == index ? 'selected' : undefined} onClick={() => handleClick(index)}>
          {tab}
        </SPAN>
      ))} */}
    </WRAPPER>
  )
}

export default Sidebar
