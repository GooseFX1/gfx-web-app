import React, { useMemo, FC } from 'react'
import { SSLToken } from '@/pages/FarmV3/constants'
import { useDarkMode } from '@/context'

const OracleIcon: FC<{
  token: SSLToken
}> = ({ token }) => {
  const { mode } = useDarkMode()
  const switchboardTokens: string[] = useMemo(() => ['MSOL', 'JITOSOL'], [])
  const usesSwitchboard: boolean = useMemo(() => switchboardTokens.includes(token?.token), [token])

  return usesSwitchboard ? (
    <a
      href="https://switchboard.xyz/"
      target={'_blank'}
      rel="noreferrer"
      className={`text-regular dark:text-grey-1 text-purple-4 font-bold hover:text-purple-4
      hover:dark:text-grey-1`}
    >
      Powered by
      <img src={`/img/assets/switchboard_${mode}.svg`} alt="switchboard-logo" className="inline mx-1.25" />
      <span className="dark:text-grey-1 text-purple-4 font-bold">Switchboard</span>
    </a>
  ) : (
    <a
      href="https://pyth.network/"
      target={'_blank'}
      rel="noreferrer"
      className={`text-regular dark:text-grey-1 text-purple-4 font-bold hover:text-purple-4 
      hover:dark:text-grey-1`}
    >
      Powered by
      <img src={`/img/assets/pyth_${mode}.svg`} alt="pyth-logo" className="inline mx-1.25" />
      <span className="dark:text-grey-1 text-purple-4 font-bold">PYTH</span>
    </a>
  )
}
export default OracleIcon
