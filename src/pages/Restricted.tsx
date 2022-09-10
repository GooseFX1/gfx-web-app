import React, { FC } from 'react'
import styled from 'styled-components'
import { FlexColumnDiv } from '../styles'

const RESTRICTED = styled(FlexColumnDiv)`
  font-family: Montserrat;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 58px);
  width: 70vw;
  margin: 0 auto;
`

const Restricted: FC = () => (
  <RESTRICTED>
    <h2>Restricted</h2>
    <div>
      Access is prohibited for Belarus, the Central African Republic, the Democratic Republic of Congo, the
      Democratic People’s Republic of Korea, Crimea, Cuba, Iran, Libya, Somalia, Sudan, South Sudan, Syria,
      Thailand, UK, USA, Yemen, Zimbabwe and any other jurisdiction in which accessing or using this website is
      prohibited.
    </div>
  </RESTRICTED>
)

export default Restricted
