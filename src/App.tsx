import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { DarkModeProvider } from './context'
import { AppLayout } from './layouts'
import { Crypto, Farm, NFTs, Swap, Synths } from './pages'
import { APP_PAGE_HEIGHT, CenteredDiv } from './styles'
import ThemeProvider from './theme'
import './App.less'

const WRAPPER = styled(CenteredDiv)`
  min-height: ${APP_PAGE_HEIGHT};
  background-color: ${({ theme }) => theme.bg2};
`

export default function App(): JSX.Element {
  return (
    <DarkModeProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Redirect from="/" to="/swap" />
          <Switch>
            <AppLayout>
              <WRAPPER>
                <Route exact path="/swap" component={Swap} />
                <Route exact path="/crypto" component={Crypto} />
                <Route exact path="/synths" component={Synths} />
                <Route exact path="/NFTs" component={NFTs} />
                <Route exact path="/farm" component={Farm} />
              </WRAPPER>
            </AppLayout>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </DarkModeProvider>
  )
}
