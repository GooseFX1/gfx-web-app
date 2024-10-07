import { FC } from 'react'
//import { Container } from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import { useGamma } from '@/context'
import { POOL_TYPE } from './constants'
import SearchBar from '@/components/common/SearchBar'
import PositionHeader from './PositionHeader'
import MyPositions from './MyPositions'
import FarmSort from '@/pages/FarmV4/FarmSort'
import useBoolean from '@/hooks/useBoolean'

const Positions: FC = () => {
  const {
    currentPoolType,
    setCurrentPoolType,
    searchTokens,
    setSearchTokens,
    sortConfig
  } = useGamma()
  const [isOpen, setIsOpen] = useBoolean(false)
  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-3.75">
        <h4 className="font-poppins text-average font-semibold dark:text-grey-8 text-black-4">My Positions</h4>
        {/* <div
          className="h-[42px] w-[274px] rounded-[4px] border border-solid items-center justify-between
                    dark:border-black-4 border-grey-4 dark:bg-black-2 bg-white flex flex-row p-2"
        >
          <div>
              <span className="font-poppins text-regular font-semibold dark:text-grey-2 text-grey-1 mr-1.5">
                Pending Yield
              </span>
            <span className="font-poppins text-regular font-semibold dark:text-grey-8 text-black-4">$21.88</span>
          </div>
          <Container
            className="h-[30px] w-[85px] cursor-pointer flex flex-row
                        justify-center items-center !rounded-[200px]"
            colorScheme={'primaryGradient'}
            size={'lg'}
          >
            Claim All
          </Container>
        </div> */}
      </div>
      <div className="flex items-center max-sm:flex-col max-sm:gap-4 mb-3.75">
        <RadioOptionGroup
          defaultValue={'Primary'}
          value={currentPoolType.name}
          className={'w-full min-md:w-max gap-1.25 max-sm:gap-0 max-sm:grid-cols-4 mr-2'}
          optionClassName={`min-md:w-[85px]`}
          options={[
            {
              value: POOL_TYPE.primary.name,
              label: 'Primary',
              onClick: () => setCurrentPoolType(POOL_TYPE.primary)
            },
            {
              value: POOL_TYPE?.hyper?.name,
              label: 'Hyper',
              onClick: () => setCurrentPoolType(POOL_TYPE.hyper)
            }
          ]}
        />
        <div className="flex items-center w-full justify-between">
          <SearchBar
            onChange={(e) => setSearchTokens(e?.target?.value)}
            onClear={() => setSearchTokens('')}
            value={searchTokens}
            className={'!max-w-full flex-1'}
          />
          <div className="flex justify-between ml-3">
           <FarmSort isOpen={isOpen} setIsOpen={setIsOpen.set} />
          </div>
        </div>
      </div>
      <PositionHeader sort={sortConfig.direction} sortType={sortConfig.key} />
      <MyPositions />
    </div>
  )
}

export default Positions