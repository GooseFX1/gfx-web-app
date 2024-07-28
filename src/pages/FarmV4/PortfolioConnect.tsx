import { FC } from "react";
import { Icon } from 'gfx-component-lib'
import { useDarkMode } from '../../context'
import { Connect } from '@/layouts'

const PortfolioConnect: FC = (): JSX.Element => {
    const { mode } = useDarkMode()
    return(
        <div className="flex flex-col items-center justify-center h-[calc(100vh-278px)]">
        <Icon
          src={`img/assets/portfolio_locked_${mode}.svg`}
          className="!max-h-[97px] h-[97px] !max-w-[155px] w-[155px]"
        />
        <div className="font-semibold text-lg font-poppins dark:text-grey-8 text-black-4 mt-3.75">Portfolio</div>
        <div className="font-semibold text-regular dark:text-grey-2 text-grey-1 text-center mb-3.75 mt-1">
          Connect your wallet to view your portfolio, <br /> track pool, token value and more.
        </div>
        <Connect />
      </div>
    )
}

export default PortfolioConnect