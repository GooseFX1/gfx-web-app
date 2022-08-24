import React, { useEffect, useState } from 'react'
import { getGofxHolders } from '../../../api/analytics'

export const GofxHolders = () => {
  const [holders, setHolders] = useState<null | string>(null)
  useEffect(() => {
    ;(async () => {
      const { data } = await getGofxHolders()
      setHolders(data.holder)
    })()
  }, [])
  return <div>Gofx Holders : {holders ? holders : 'Loading ...'}</div>
}
