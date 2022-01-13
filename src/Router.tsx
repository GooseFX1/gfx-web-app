import React, { FC } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { AppLayout } from './layouts'
import { Crypto, Farm, NFTs, Synths, Swap } from './pages'
import { CenteredDiv } from './styles'
import useBlacklisted from './utils/useBlacklisted'

const WRAPPER = styled(CenteredDiv)`
  flex: 1;
  background-color: ${({ theme }) => theme.bg2};
`

export const Router: FC = () => {
  const blacklisted = useBlacklisted()
  console.log('blacklisted', blacklisted)

  return (
    <BrowserRouter>
      <Redirect from="/" to="/crypto" />
      <Switch>
        <AppLayout>
          <WRAPPER>
            <Route exact path="/swap" component={Swap} />
            <Route exact path="/crypto" component={Crypto} />
            <Route
              exact
              path="/synths"
              component={() => {
                if (blacklisted) {
                  window.location.href = 'https://goosefx.io/restricted'
                  return null
                } else {
                  return <Synths />
                }
              }}
            />
            <Route path="/NFTs" component={NFTs} />
            <Route exact path="/farm" component={Farm} />
          </WRAPPER>
        </AppLayout>
      </Switch>
    </BrowserRouter>
  )
}
