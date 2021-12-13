# gfx-web-app

GooseFX

Welcome to GooseFX, an AMM (automated market maker) platform with peer shared yield farming and perpetual swaps and tokenized stocks built on the Solana blockchain and Serum DEX (decentralized exchange).

Key Features of GooseFX:

- Peer Shared Yield Farming
- Perpetual Swaps with Margin
- Tokenized Stocks
- Options (Exotic + Vanilla) - (TBD)

Peer Shared Yield Farming:
This solves the need for a 1:1 ratio of collateral put up by a single user. Imagine the following scenario:

User A has 100 ABC token
User B has 100 XYZ token

Instead of having User A buy 100 ABC and 100 XYZ, it matches with another person in the swap pool with 100 ABC and splits the APR 50/50 (or whichever the ratio of said pool is). This way, both upside and downside are shared in a peer to peer decentralized manner.

# Running Locally:

```
nvm use
yarn install
yarn start
```

Right now it takes time for the cra dev server to start

# Deploying to staging:

Staging is on test.goosefx.io .
Merge your branch with the dev branch.
Ssh into the staging instance `ssh ubuntu@3.23.85.70` and run `./update_frontend.sh`.

# Deploying to production

Ssh into the instance and run `./update_frontend.sh`.

# Adding images and other assets to the website.

We use Cloudfront and S3 as our asset pipeline. Optimize and compress the image and then upload it to the goosefx/assets bucket on s3. Once uploaded the image will be available through the link media.goosefx.io/<image-name>

All Rights Reserved 2021 Copyright.
