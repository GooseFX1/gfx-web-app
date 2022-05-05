import React from 'react'
import styled from 'styled-components'

const CONTAINER = styled.div`
  background: ${({ theme }) => theme.bg3};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 30vh;
`
const MorePoolImg = styled.div`
  margin-top: 30px;
`
const MoreText = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.text19};
  bottom: 30px;
  margin-top: 23px;
`

export const MorePoolsSoon = () => {
  return (
    <CONTAINER>
      <MorePoolImg>
        <img src={`/img/assets/moreSoonDark.svg`} alt="" />
      </MorePoolImg>
      <MoreText>More pools coming soon</MoreText>
    </CONTAINER>
  )
}
export default {}
