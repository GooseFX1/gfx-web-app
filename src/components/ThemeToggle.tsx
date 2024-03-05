import { FC } from 'react'
import { useDarkMode } from '../context'
import { Icon, Switch } from 'gfx-component-lib'

export const ThemeToggle: FC = () => {
  const { mode, toggleMode } = useDarkMode()

  return (
    <div className={`pb-0.5 w-max flex flex-row gap-2 items-center`}>
      <Icon
        className={`h-[22px] w-[22px]  sm:h-[24px] sm:w-[24px]`}
        src={`/img/mainnav/moon_${mode}_mode.svg`}
        alt="moon"
      />

      <Switch variant={'secondary'} onClick={toggleMode} />

      <Icon
        className={`h-[22px] w-[22px]  sm:h-[26px] sm:w-[26px]`}
        src={`/img/mainnav/sun_${mode}_mode.svg`}
        alt="sun"
      />
    </div>
  )
}
