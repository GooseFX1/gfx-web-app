import { useDarkMode, useRewardToggle } from "@/context";
import { Button, Icon } from "gfx-component-lib";
import { ReactElement } from "react";

export const LiteProToggle = (): ReactElement => {
    const { isProMode, setIsProMode, setIsPortfolio } = useRewardToggle()
    const { mode } = useDarkMode()
    return (
        <Button
            className={`h-[30px] w-[75px] border-[1.5px] border-solid 
            ${isProMode ? 'dark:bg-gradient-5 bg-gradient-6 border-purple-3' : 'bg-gradient-4 border-[#31E591]'}`}
            variant={'secondary'}
            onClick={() => {
                setIsPortfolio.off()
                setIsProMode.toggle()
            }}
        >
            <Icon src={`img/assets/${isProMode ? `pro_${mode}` : `lite_${mode}`}.svg`} 
            alt="?-icon" className="max-sm:mr-2.5" size='sm' />
            <div className="text-black-4 dark:text-white font-bold text-regular">
                {isProMode ? 'PRO' : 'LITE'}
            </div>
        </Button>
    )
}