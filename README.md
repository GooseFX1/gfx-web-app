# goosefx
GooseFX

Welcome to GooseFX, a DeFi platform an all encompassing protocol for your DeFi needs.

Key Features of GooseFX:
- NFT Store
- Yield Farming
- Perpetual Swaps with Margin
- Tokenized Stocks
- Options (Exotic + Vanilla) - (TBD)

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
Ssh into the staging instance ```ssh ubuntu@3.23.85.70``` and run ``` ./update_frontend.sh ```. 

# Deploying to production
Ssh into the instance and run ``` ./update_frontend.sh ```.

# Adding images and other assets to the website.
We use Cloudfront and S3 as our asset pipeline. Optimize and compress the image and then upload it to the goosefx/assets bucket on s3. Once uploaded the image will be available through the link media.goosefx.io/<image-name> 


All Rights Reserved 2021 Copyright.
# gfx-web-app
