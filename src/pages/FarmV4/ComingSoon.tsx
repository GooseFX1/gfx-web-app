import { FC } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'

const ComingSoon: FC<{
  header: string
  value: string
  image: string
  subHeader: string
  tooltip?: string
}> = ({ header, value, image, subHeader, tooltip }): JSX.Element => (
  <div
    className="h-[250px] border border-solid dark:border-black-4 border-grey-4 
      p-2.5 dark:bg-black-2 bg-white rounded-[10px]"
  >
    <Tooltip>
      <TooltipTrigger disabled={!tooltip} asChild>
        <h4
          className="font-poppins text-regular font-semibold text-black-4 dark:text-grey-8 underline 
        decoration-dotted mb-2.5"
        >
          {header}
        </h4>
      </TooltipTrigger>
      <TooltipContent align={'start'}>{tooltip}</TooltipContent>
    </Tooltip>
    {value ? (
      <span className="font-semibold font-poppins text-[28px] dark:text-grey-8 text-black-4">${value}</span>
    ) : (
      <span className="font-semibold font-poppins text-[28px] dark:text-grey-1 text-grey-9">$0.00</span>
    )}
    <div className="h-[143px] dark:bg-black-1 bg-grey-5 mx-auto flex flex-row items-center">
      <img src={`/img/assets/farm_${image}.svg`} alt="chart" />
      <div>
        <div className="font-poppins font-regular font-semibold dark:text-grey-8 text-black-4 mb-2">
          New Features Coming Soon...
        </div>
        <div className="font-regular font-semibold dark:text-grey-2 text-grey-1">{subHeader}</div>
      </div>
    </div>
  </div>
)

export default ComingSoon