import React, { FC } from 'react'
import { SSLToken } from '@/pages/FarmV3/constants'
import { useDarkMode } from '@/context'

const OracleIcon: FC<{
  token: SSLToken
}> = ({ token }) => {
  const { mode } = useDarkMode()
  return token?.token === 'MSOL' || token?.token === 'JITOSOL' ? (
    <a
      href="https://switchboard.xyz/"
      target={'_blank'}
      rel="noreferrer"
      className="flex text-regular dark:text-grey-1 text-purple-4 font-bold justify-center"
    >
      Powered by
      <img src={`/img/assets/switchboard_${mode}.svg`} alt="switchboard-logo" className="mx-1.25" />
      <span className="dark:text-grey-1 text-purple-4 font-bold">Switchboard</span>
    </a>
  ) : (
    <a
      href="https://pyth.network/"
      target={'_blank'}
      rel="noreferrer"
      className="flex text-regular dark:text-grey-1 text-purple-4 font-bold justify-center"
    >
      Powered by
      <img src={`/img/assets/pyth_${mode}.svg`} alt="pyth-logo" className="mx-1.25" />
      <span className="dark:text-grey-1 text-purple-4 font-bold">PYTH</span>
    </a>
  )
}
export default OracleIcon
