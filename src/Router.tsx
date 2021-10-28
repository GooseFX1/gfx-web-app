import React, { FC } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { AppLayout } from './layouts'
import { Crypto, Farm, NFTs, Stocks, Swap } from './pages'
import { APP_PAGE_HEIGHT, CenteredDiv } from './styles'

const WRAPPER = styled(CenteredDiv)`
  min-height: ${APP_PAGE_HEIGHT};
  background-color: ${({ theme }) => theme.bg2};
`

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Redirect from="/" to="/swap" />
      <Switch>
        <AppLayout>
          <WRAPPER>
            <Route exact path="/swap" component={Swap} />
            <Route exact path="/crypto" component={Crypto} />
            <Route exact path="/stocks" component={Stocks} />
            <Route path="/NFTs" component={NFTs} />
            <Route exact path="/farm" component={Farm} />
          </WRAPPER>
        </AppLayout>
      </Switch>
    </BrowserRouter>
  )
}
