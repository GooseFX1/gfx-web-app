import React, { FC, useCallback, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
  Icon,
  IconTooltip,
  Input,
  InputElementRight,
  InputGroup,
  Popover,
  PopoverContent,
  PopoverTrigger
} from 'gfx-component-lib'
import { FooterItem, FooterItemContent, FooterItemProps } from '@/components/footer/FooterItem'
import { EndPointName, useConnectionConfig, useDarkMode } from '@/context'
import { Circle } from '@/components/common/Circle'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import { testRPC } from '@/utils/requests'
import useBreakPoint from '@/hooks/useBreakPoint'
import useBoolean from '@/hooks/useBoolean'
import useUserCache from '@/hooks/useUserCache'

type RPCToggleProps = Omit<FooterItemProps, 'title'>
const RPCToggle: FC<RPCToggleProps> = ({ ...rest }) => {
  const { mode } = useDarkMode()
  const { isMobile } = useBreakPoint()
  const { endpointName, setEndpointName, latency } = useConnectionConfig()
  const [RPC, setRPC] = useState<EndPointName>(endpointName)
  const [rpcUrl, setRpcUrl] = useState('')
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useBoolean(false)
  const {updateUserCache} = useUserCache()
  const providerSrc = useMemo(
    () => `/img/mainnav/provider_${endpointName.toLowerCase()}_${mode}.svg`,
    [endpointName, mode]
  )
  const handleSave = useCallback(() => {
    if (RPC === 'Custom') {
      testRPC(rpcUrl).then((res) => {
        if (res) {
          updateUserCache({endpoint: rpcUrl})
          setEndpointName(RPC)
          setError('')
          setIsOpen.off()
        } else {
          setError('Invalid RPC URL')
        }
      })

      return
    }
    setError('')
    setIsOpen.off()
    setEndpointName(RPC)
  }, [RPC, setEndpointName, rpcUrl])
  const onCustomRPCClear = useCallback(() => {
    setError('')
    setRpcUrl('')
  }, [])

  const saveDisabled = endpointName == RPC || (RPC == 'Custom' && rpcUrl.trim() === '')
  const content = useMemo(() => {
    const trigger = (
      <FooterItemContent className={'gap-0 cursor-pointer'}>
        {endpointName}&nbsp;
        <Icon src={providerSrc} />
      </FooterItemContent>
    )
    const renderContent = (
      <>
        <div
          className={'inline-flex gap-2 min-md:gap-0 min-md:justify-between items-center text-b2 font-semibold'}
        >
          <div className={'inline-flex gap-1 items-center'}>
            <h5 className={'max-sm:text-h3 text-h5'}>RPC Settings</h5>
            <IconTooltip tooltipType={'outline'} portal={false}>
              An RPC node, allows users of the RPC node to submit new transactions to be included in blocks. Select
              your RPC or up to enter a custom one.
            </IconTooltip>
          </div>
          <div className={'inline-flex gap-1 items-center'}>
            <Circle className={'bg-background-green'} />
            <p>{latency}ms</p>
          </div>
        </div>
        <RadioOptionGroup
          defaultValue={RPC}
          onChange={(v) => setRPC(v as EndPointName)}
          options={[
            {
              label: <RPCLineItem title={'QuickNode'} endpoint={'QuickNode'} />,
              value: 'QuickNode'
            },
            {
              label: <RPCLineItem title={'Helius'} endpoint={'Helius'} />,
              value: 'Helius'
            },
            {
              label: <RPCLineItem title={'Custom'} endpoint={'Custom'} />,
              value: 'Custom'
            }
          ]}
        />
        {RPC == 'Custom' && (
          <>
            <InputGroup
              rightItem={
                <InputElementRight show={Boolean(error)}>
                  <Button variant={'ghost'} onClick={onCustomRPCClear}>
                    <Icon
                      size={'sm'}
                      src={`/img/assets/search_farm_${mode}.svg`}
                      alt="search-icon"
                      className={'cursor-pointer'}
                    />
                  </Button>
                </InputElementRight>
              }
            >
              <Input
                className={
                  Boolean(error) &&
                  `border-border-red focus:border-border-red dark:border-border-red 
            dark:focus:border-border-red`
                }
                value={rpcUrl}
                placeholder={'Enter custom RPC'}
                onChange={(e) => setRpcUrl(e.target.value)}
              />
            </InputGroup>
            {error && <p className={'text-red-500'}>{error}</p>}
          </>
        )}

        <Button fullWidth colorScheme={'blue'} disabled={saveDisabled} onClick={handleSave}>
          Save
        </Button>
      </>
    )
    if (isMobile) {
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen.set}>
          <DialogOverlay />
          <DialogTrigger>{trigger}</DialogTrigger>
          <DialogContent
            placement={'bottom'}
            className={'w-screen rounded-t-[10px]'}
            onOpenAutoFocus={(event) => {
              event.preventDefault()
            }}
          >
            <DialogCloseDefault className={'top-2'} />
            <DialogBody
              className={`border-1 border-solid border-border-lightmode-primary 
          dark:border-border-darkmode-primary rounded-t-[10px] px-2.5 py-3 flex flex-col gap-2.5 max-sm:gap-3.75`}
            >
              {renderContent}
            </DialogBody>
          </DialogContent>
        </Dialog>
      )
    }
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen.set}>
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent
          className={'w-auto mb-2 gap-3.5'}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
          }}
        >
          {renderContent}
        </PopoverContent>
      </Popover>
    )
  }, [
    RPC,
    error,
    handleSave,
    providerSrc,
    saveDisabled,
    rpcUrl,
    onCustomRPCClear,
    isMobile,
    mode,
    latency,
    isOpen
  ])
  return (
    <FooterItem title={'RPC:'} {...rest}>
      {content}
    </FooterItem>
  )
}

export default RPCToggle

const RPCLineItem: FC<{ title: string; endpoint: EndPointName }> = ({ title, endpoint }) => {
  const { mode } = useDarkMode()
  return (
    <div className={'inline-flex gap-1 items-center'}>
      <Icon size={'sm'} src={`/img/mainnav/provider_${endpoint.toLowerCase()}_${mode}.svg`} />
      <p className={'text-h4 font-poppins font-semibold'}>{title}</p>
    </div>
  )
}
