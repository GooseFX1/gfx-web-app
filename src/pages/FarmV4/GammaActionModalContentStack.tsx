import React, { FC } from 'react'

type Option = {
  textLeft: string
  textRight: string
}
type GammaActionModalContentStackProps = {
  options: Option[]
}
const GammaActionModalContentStack: FC<GammaActionModalContentStackProps> = ({
  options
}) =>
  <div className={'flex flex-col flex-1 gap-1.25'}>
    {options?.map((option, index) => (
      <div key={index} className={'flex justify-between w-full gap-1.25'}>
        <p className={`text-text-lightmode-secondary dark:text-text-darkmode-secondary text-b2 font-semibold`}>
          {option.textLeft}
        </p>
        <p className={`text-text-lightmode-primary dark:text-text-darkmode-primary text-b2 font-semibold`}>
          {option.textRight}
        </p>
      </div>
    ))}
  </div>

export default GammaActionModalContentStack