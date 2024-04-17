import { FC } from 'react'
import { useDarkMode } from '../context'
import { Switch } from 'gfx-component-lib'

export const ThemeToggle: FC = () => {
  const { mode, toggleMode } = useDarkMode()

  return (
    <div className={'pb-0.5 w-max flex flex-row items-center justify-center gap-2'}>
      <img
        className="h-[22px] w-[22px] sm:h-[24px] sm:w-[24px]"
        src={`/img/mainnav/moon_${mode}_mode.svg`}
        alt="moon"
      />
      <Switch checked={mode != 'dark'} variant={'secondary'} onClick={toggleMode} />
      <img
        className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]"
        src={`/img/mainnav/sun_${mode}_mode.svg`}
        alt="sun"
      />
    </div>
  )
}
