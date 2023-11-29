import React, { useCallback, useState, useEffect } from 'react'
import RewardsLeftSidePanel from './leftPanel/RewardsLeftSidePanel'
import RewardsRightSidePanel from './rightPanel/RewardsRightSidePanel'

function Rewards(): JSX.Element {
  const [apy, setApy] = useState<number>(0)
  const fetchApy = useCallback(
    () =>
      fetch('https://api-services.goosefx.io/gofx-stake/getApy')
        .then((res) => res.json())
        .then((res) => setApy(Number(res.data)))
        .catch((err) => console.error('failed to fetch apy', err)),
    []
  )
  useEffect(() => {
    const id = setInterval(fetchApy, 10000)
    return () => clearInterval(id)
  }, [fetchApy])
  return (
    <>
      <RewardsLeftSidePanel apy={apy} />
      <RewardsRightSidePanel apy={apy} />
    </>
  )
}

export default Rewards
