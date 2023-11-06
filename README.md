<div align="center">
  <img height="100" src="https://media.goosefx.io/logos/GFX-Monogram.svg" />

  <h4>
    <a href="https://goosefx.io">Website</a>
    <span> | </span>
    <a href="https://docs.goosefx.io">Docs</a>
    <span> | </span>
    <a href="https://discord.com/channels/833693973687173121/833742620371058688">Discord</a>
    <span> | </span>
    <a href="https://www.t.me/goosefx">Telegram</a>
    <span> | </span>
    <a href="https://medium.com/goosefx">Medium</a>
  </h4>
  <br />
  <br />
</div>

GooseFX is a full suite DeFi platform built on the Solana blockchain and Serum DEX, offering a variety of unique decentralized peer-to-peer financial products. We aim to be a complete DeFi experience where you can trade cryptocurrencies, futures, NFTs all through one interface while utilizing your capital across all features seamlessly.

Key Features of GooseFX:

- Our concentrated liquidity market maker (CLMM) swap
- Goose Nest NFT Exchange - An NFT exchange built on the Auction House contract with a launchpad
- First ever single sided liquidity pools on Solana
- Decentralized trading of defi derivatives and perps

For in-depth details, visit the [technical documentation](https://docs.goosefx.io) that elaborates on our tokenomics, features, and roadmap.

## Details

This web application is built using React and Typescript. Yarn handles the package management.

Note: Environment variables are needed to develop locally and need to be obtained via a team member. See [CONTRIBUTING.md](https://github.com/GooseFX1/gfx-web-app/blob/dev/CONTRIBUTING.md) for more details.

## Running Locally

```
$nvm use
$yarn install
$npx install-peerdeps --dev eslint-config-airbnb
$yarn start
```

## Checking Bundle size

If you want more information on vite-bundle-visualizer please run:

```bash
npx vite-bundle-visualizer --help
```

To run the bundle analyzer please run:

```bash
NODE_OPTIONS=--max-old-space-size=32000 npx vite-bundle-visualizer -c vite.config.ts
```

All Rights Reserved 2022 Copyright.
