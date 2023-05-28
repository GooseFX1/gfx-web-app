import React, { useEffect, useState, FC } from 'react'
import styled from 'styled-components'
import Lottie from 'lottie-react'
import MorePools from '../../animations/MorePools_dark.json'
import MorePoolsLite from '../../animations/MorePools_lite.json'
import { useDarkMode, useFarmContext } from '../../context'
import 'twin.macro'
import 'styled-components/macro'
import { checkMobile } from '../../utils'

const MorePoolImg = styled.div`
  .animation-404 {
    width: 188px;
    height: 120px;
    margin-top: 70px;
  }
`

export const MorePoolsSoon: FC<any> = ({ tableRef, length }) => {
  const { mode } = useDarkMode()
  const screenHeight = window.innerHeight
  const seventyVh = screenHeight / 1.34
  const [tableHeight, setHeight] = useState<number>()
  const { toggleDeposited } = useFarmContext()
  const getSizes = () => {
    const newHeight = tableRef.current?.clientHeight
    setHeight(newHeight)
  }
  useEffect(() => {
    getSizes()
  }, [length, toggleDeposited])

  return (
    <tr>
      <td colSpan={7} tw="pt-[90px]">
        <div
          tw="flex flex-col items-center min-h-[30vh] sm:w-full dark:bg-black-3 bg-white"
          style={{
            paddingTop: tableHeight < seventyVh && !checkMobile() ? seventyVh - tableHeight : 0
          }}
        >
          <MorePoolImg>
            <Lottie animationData={mode == 'dark' ? MorePools : MorePoolsLite} className="animation-404" />
          </MorePoolImg>
          <div tw="dark:text-grey-1 text-grey-2 not-italic font-semibold mt-[30px]">More pools coming soon</div>
        </div>
      </td>
    </tr>
  )
}
