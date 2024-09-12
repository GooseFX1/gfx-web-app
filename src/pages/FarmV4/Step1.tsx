import { Dispatch, FC, SetStateAction } from 'react'

const Step1: FC<{
  slider: any
  setIsCreatePool: Dispatch<SetStateAction<boolean>>
  setLocalPoolType: Dispatch<SetStateAction<string>>
}> = ({ setIsCreatePool, slider, setLocalPoolType }) => (
  <>
    <div
      className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4 
        border-grey-4 p-2.5 h-17"
    >
      <span className="text-purple-3">Step 1</span> of 3
      <div className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">Create A Pool</div>
    </div>
    <div className="py-3 px-2.5">
      <div
        className="border border-solid dark:border-black-4 border-grey-4 
          dark:bg-black-1 bg-grey-5 rounded-tiny p-2.5 cursor-pointer
          hover:border-grey-1 dark:hover:border-grey-4"
        onClick={() => {
          setLocalPoolType('Primary')
          slider.current.slickGoTo(1)
        }}
      >
        <div className="flex flex-row">
          <img src="img/assets/farm_primary.svg" alt="primary" height={20} width={20} className="mr-1.5" />
          <span className="text-[18px] font-sans font-semibold dark:text-grey-8 text-black-4">Primary</span>
        </div>
        <div className="mt-2.5 text-regular font-semibold text-grey-1 dark:text-grey-2">
          Create a pool with blue-chip assets such as SOL, LSTs, stables, etc.
        </div>
      </div>
    </div>
    <div className="py-3 px-2.5">
      <div
        className="border border-solid dark:border-black-4 border-grey-4 
          dark:bg-black-1 bg-grey-5 rounded-tiny p-2.5 cursor-pointer
          hover:border-grey-1 dark:hover:border-grey-4"
        onClick={() => {
          setLocalPoolType('Hyper')
          slider.current.slickGoTo(1)
        }}
      >
        <div className="flex flex-row">
          <img src="img/assets/farm_hyper.svg" alt="hyper" height={20} width={20} className="mr-1.5" />
          <span className="text-[18px] font-sans font-semibold dark:text-grey-8 text-black-4">Hyper</span>
        </div>
        <div className="mt-2.5 text-regular font-semibold text-grey-1 dark:text-grey-2">
          Create a pool for any non blue-chip assets that do not exist in Primar, 
          such as memecoins and newly launched tokens.
        </div>
      </div>
    </div>
    <div className="py-3 px-2.5">
      <div
        className="border border-solid dark:border-black-4 border-grey-4 
          dark:bg-black-1 bg-grey-5 rounded-tiny p-2.5 h-[110px] cursor-pointer
          hover:border-grey-1 dark:hover:border-grey-4"
        onClick={() => {
          setIsCreatePool(false)
          window.open('https://docs.goosefx.io/features/farm')
        }}
      >
        <div className="flex flex-row">
          <img src="img/assets/question-icn.svg" alt="primary" height={20} width={20} className="mr-1.5" />
          <span className="text-[18px] font-sans font-semibold dark:text-grey-8 text-black-4">
            Need some help?
          </span>
        </div>
        <div className="mt-2.5 text-regular font-semibold text-grey-1 dark:text-grey-2">
          Not sure which pool to create? Tap here to visit our docs FAQ and more information.
        </div>
      </div>
    </div>
    <br />
    <br />
    <br />
  </>
)


export default Step1
