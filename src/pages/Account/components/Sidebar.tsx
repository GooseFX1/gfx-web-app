import { FC, useCallback } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Tabs, TabsList, TabsTrigger, cn } from 'gfx-component-lib'
import { TitleLabel } from '@/pages/TradeV3/perps/components/PerpsGenericComp'
import { useDarkMode } from '@/context'

const WRAPPER = styled.div`
  ${tw`flex flex-col px-5 py-0 w-36 fixed`}
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
  const { mode } = useDarkMode()
  const getTitleImage = useCallback(
    (index) => {
      const isSelected = selected === index
      const imageSrc = `/img/assets/${tabs[index]}${isSelected ? '' : mode}.svg`
      const containerClass = `flex items-center pl-4 justify-start min-w-[120px]`

      return (
        <div className={containerClass}>
          <img src={imageSrc} className="m-1 h-5 w-5" alt={`${tabs[index]} tab icon`} />
          <TitleLabel whiteText={isSelected}>{tabs[index]}</TitleLabel>
        </div>
      )
    },
    [tabs, mode, selected]
  )

  return (
    <WRAPPER
      className="flex flex-col px-2.5 pb-0 mb-0 w-36 h-[calc(100vh - 96px)]
    !border-l-0 !border-t-0 !border-b-0 !overflow-hidden
    border dark:border-r-black-4 border-grey-4 "
    >
      <Tabs defaultValue="0" className="mt-2.5">
        <TabsList className="flex flex-col gap-0 p-0">
          {tabs.map((elem, index) => (
            <TabsTrigger
              className={cn('w-full h-8.75 dark:!bg-black-1 !bg-grey-5')}
              size="xl"
              key={index}
              value={index.toString()}
              variant="primary"
              onClick={() => handleClick(index)}
            >
              <>{getTitleImage(index)}</>
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
