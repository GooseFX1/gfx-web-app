import { FC } from 'react'
import NetworkStatus from '@/components/footer/NetworkStatus'
import RPCToggle from '@/components/footer/RPCToggle'
import PriorityFee from '@/components/footer/PriorityFee'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NAV_LINKS, navigateTo } from '@/utils/requests'
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
    className={`fixed bottom-0 inline-flex w-screen border-t-1 border-solid
     border-b-border-lightmode-secondary dark:border-border-darkmode-secondary
     bg-background-lightmode-primary dark:bg-background-darkmode-primary
     items-center px-3.75 py-1.5 sm:hidden
     `}
  >
    <div className={'inline-flex mr-auto items-center gap-2'}>
      <NetworkStatus />
      <FooterDivider />

      <RPCToggle />
      <FooterDivider />

      <PriorityFee />
      <FooterDivider />

      <ThemeToggle />
    </div>
    <div className={'inline-flex ml-auto items-center'}>
      <Button
        variant={'ghost'}
        onClick={navigateTo(NAV_LINKS.terms, '_blank')}
        size={'sm'}
        className={'dark:text-text-darkmode-primary text-text-lightmode-primary'}
      >
        Terms Of Service
      </Button>
      <Button
        variant={'ghost'}
        onClick={navigateTo(NAV_LINKS.risks, '_blank')}
        size={'sm'}
        className={'dark:text-text-darkmode-primary text-text-lightmode-primary'}
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
          className={'text-text-lightmode-primary dark:text-text-darkmode-primary text-h6 font-bold'}
        >
          Ottersec
        </a>
      </p>
    </div>
  </footer>
)
