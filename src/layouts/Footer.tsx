import { FC } from 'react'
import NetworkStatus from '@/components/footer/NetworkStatus'
import RPCToggle from '@/components/footer/RPCToggle'
// import PriorityFee from '@/components/footer/PriorityFee'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NAV_LINKS, navigateToCurried } from '@/utils/requests'
import { Button, cn } from 'gfx-component-lib'

export const FooterDivider: FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      `w-[1px] bg-border-lightmode-secondary 
dark:bg-border-darkmode-secondary h-4`,
      className
    )}
  />
)
export const Footer: FC = () => (
  <footer
    className={`inline-flex w-screen border-t-1 border-solid
     border-b-border-lightmode-secondary dark:border-border-darkmode-secondary
     bg-background-lightmode-primary dark:bg-background-darkmode-primary
     items-center px-3.75 py-0.25 mt-auto sm:p-2.5 min-lg:fixed min-lg:bottom-0
     `}
  >
    <div className={'inline-flex mr-auto items-center gap-2 sm:hidden'}>
      <NetworkStatus />
      <FooterDivider />

      <RPCToggle />
      <FooterDivider />

      {/*<PriorityFee />*/}
      {/*<FooterDivider />*/}

      <ThemeToggle size={'sm'} colorScheme={'secondary'} />
    </div>
    <div className={'inline-flex ml-auto items-center sm:flex-wrap sm:gap-3.75 sm:gap-y-2.5'}>
      <Button
        variant={'ghost'}
        onClick={navigateToCurried(NAV_LINKS.terms, '_blank')}
        size={'sm'}
        className={'sm:p-0 sm:text-h5 dark:text-text-darkmode-primary text-text-blue text-h6 sm:h-[26px]'}
      >
        Terms Of Service
      </Button>
      <Button
        variant={'ghost'}
        onClick={navigateToCurried(NAV_LINKS.risks, '_blank')}
        size={'sm'}
        className={'sm:p-0 sm:text-h5 dark:text-text-darkmode-primary text-text-blue text-h6 sm:h-[26px]'}
      >
        Risks & Disclaimers
      </Button>
      <p
        className={`text-h6 font-bold text-text-lightmode-tertiary dark:text-text-darkmode-tertiary h-[10px]
        content-center`}
      >
        Copyright {new Date().getFullYear()} GOOSEFX. Security audits by&nbsp;
        <a
          href={NAV_LINKS.securityAudit}
          target={'_blank'}
          className={'text-text-blue dark:text-text-darkmode-primary text-h6 font-bold'}
          rel="noreferrer"
        >
          Ottersec
        </a>
      </p>
    </div>
  </footer>
)
