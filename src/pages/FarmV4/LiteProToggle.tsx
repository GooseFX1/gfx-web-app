import { useRewardToggle } from "@/context";
import { Button, Icon } from "gfx-component-lib";
import { ReactElement } from "react";

export const LiteProToggle = (): ReactElement => {
    const { isProMode, setIsProMode } = useRewardToggle()
    return (
        <Button
            className="h-[30px] w-[67px] py-1 px-2 bg-gradient-to-br from-green-gradient-3 to-green-gradient-4
            border-[1.5px] border-solid border-[#31E591]"
            variant={'secondary'}
            onClick={setIsProMode.toggle}
        >
            <Icon src={`img/assets/${isProMode ? 'pro' : 'lite'}.svg`} 
            alt="?-icon" className="max-sm:mr-2.5" size='sm' />
            <div className="text-white font-bold text-regular">{isProMode ? 'PRO' : 'LITE'}</div>
        </Button>
    )
}