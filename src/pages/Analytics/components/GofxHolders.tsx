import React, { useEffect, useState, FC } from 'react'
import styled from 'styled-components'
import { getGofxHolders } from '../../../api/analytics'

export const CARD = styled.span`
  width: 100%;
  padding: 0.8%;
  display: block;
  width: fit-content;
  border-radius: 10px;
  background: linear-gradient(88.43deg, #2a2a2a 1.68%, #181818 105.14%);
`

export const GofxHolders: FC = () => {
  const [holders, setHolders] = useState<null | string>(null)
  useEffect(() => {
    ;(async () => {
      const { data } = await getGofxHolders()
      setHolders(data.holder)
    })()
  }, [])
  return <div>Gofx Holders : {holders ? holders : 'Loading ...'}</div>
}
