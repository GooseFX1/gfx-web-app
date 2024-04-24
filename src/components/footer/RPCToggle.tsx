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
import { FooterItem, FooterItemContent } from '@/components/footer/FooterItem'
import { EndPointName, useConnectionConfig, useDarkMode, USER_CACHE } from '@/context'
import { Circle } from '@/components/common/Circle'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import { testRPC } from '@/utils/requests'
import useBreakPoint from '@/hooks/useBreakPoint'

const RPCToggle: FC = () => {
  const { mode } = useDarkMode()
  const { isMobile } = useBreakPoint()
  const { endpointName, setEndpointName } = useConnectionConfig()
  const [RPC, setRPC] = useState<EndPointName>(endpointName)
  const [rpcUrl, setRpcUrl] = useState('')
  const [error, setError] = useState('')
  const providerSrc = useMemo(
    () => `/img/mainnav/provider_${endpointName.toLowerCase()}_${mode}.svg`,
    [endpointName, mode]
  )
  const handleSave = useCallback(() => {
    if (RPC === 'Custom') {
      testRPC(rpcUrl).then((res) => {
        if (res) {
          const existingCache = JSON.parse(window.localStorage.getItem(USER_CACHE))
          window.localStorage.setItem(USER_CACHE, JSON.stringify({ ...existingCache, endpoint: rpcUrl }))
          setEndpointName(RPC)
          setError('')
        } else {
          setError('Invalid RPC URL')
        }
      })

      return
    }
    setError('')
    setEndpointName(RPC)
  }, [RPC, setEndpointName, rpcUrl])
  const onCustomRPCClear = useCallback(() => {
    setError('')
    setRpcUrl('')
  }, [])
  //TODO: replace with actual latency
  const latency = 58

  const saveDisabled = endpointName == RPC || (RPC == 'Custom' && rpcUrl.trim() === '')
  const content = useMemo(() => {
    const trigger = (
      <FooterItemContent className={'gap-0 cursor-pointer'}>
        {endpointName} <Icon src={providerSrc} />
      </FooterItemContent>
    )
    const renderContent = (
      <>
        <div
          className={'inline-flex gap-2 min-md:gap-0 min-md:justify-between items-center text-b2 font-semibold'}
        >
          <div className={'inline-flex gap-1 items-center'}>
            <p>RPC Settings</p>
            <IconTooltip tooltipType={'outline'}>
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
              label: <RPCLineItem title={'Default'} endpoint={'GooseFX'} />,
              value: 'GooseFX'
            },
            {
              label: <RPCLineItem title={'Helius'} endpoint={'Helius'} />,
              value: 'Helius'
            }
            // {
            //   label: <RPCLineItem title={'Custom'} endpoint={'Custom'} />,
            //   value: 'Custom'
            // }
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
        <Dialog>
          <DialogOverlay />
          <DialogTrigger>{trigger}</DialogTrigger>
          <DialogContent placement={'bottom'}>
            <DialogCloseDefault className={'top-2'} />
            <DialogBody
              className={`border-1 border-solid border-border-lightmode-primary 
          dark:border-border-darkmode-primary rounded-t-[10px] px-2.5 py-3 flex flex-col gap-2.5`}
            >
              {renderContent}
            </DialogBody>
          </DialogContent>
        </Dialog>
      )
    }
    return (
      <Popover>
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent className={'mb-2 gap-3.5'}>{renderContent}</PopoverContent>
      </Popover>
    )
  }, [RPC, error, handleSave, providerSrc, saveDisabled, rpcUrl, onCustomRPCClear, isMobile, mode, latency])
  return <FooterItem title={'RPC:'}>{content}</FooterItem>
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