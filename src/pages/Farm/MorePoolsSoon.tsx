import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Lottie from 'lottie-react'
import MorePools from '../../animations/MorePools_dark.json'
import MorePoolsLite from '../../animations/MorePools_lite.json'
import { useDarkMode, useFarmContext } from '../../context'
import tw from 'twin.macro'
import { checkMobile } from '../../utils'

const CONTAINER = styled.div`
  ${tw`flex flex-col items-center min-h-[30vh]`}
  background: ${({ theme }) => theme.bg17};
  @media (max-width: 500px) {
    width: 100vw;
  }
`
const MorePoolImg = styled.div`
  .animation-404 {
    ${tw`w-[188px] h-[120px] mt-[70px]`}
  }
`
const MoreText = styled.div`
  ${tw`not-italic font-semibold text-xl mt-[30px] mb-[50px]`}
  color: ${({ theme }) => theme.text19};
`

export const MorePoolsSoon = ({ tableRef, length }: any) => {
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
      <td colSpan={7}>
        <CONTAINER
          style={{
            paddingTop: tableHeight < seventyVh && !checkMobile() ? seventyVh - tableHeight : 0
          }}
        >
          <MorePoolImg>
            <Lottie animationData={mode == 'dark' ? MorePools : MorePoolsLite} className="animation-404" />
          </MorePoolImg>
          <MoreText>More pools coming soon</MoreText>
        </CONTAINER>
      </td>
    </tr>
  )
}
