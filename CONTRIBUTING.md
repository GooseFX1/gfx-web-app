# Contributing Docs

To run the environment locally for developent, you will need to get the environment variables from a team member. Once you have received these variables, follow the steps on the [README.md](https://github.com/GooseFX1/gfx-web-app) in the root of the `gfx-web-app` repo.

## Dev Cycles

All features should be defined in a ClickUp task with a branch or a PR linked to the task and feature branches linked to milestones. When creating PR, use the title of the ClickUp task. Remove “UI” since the repo is only frontend (UI is just a ClickUp designator since API and Docs etc are tracked there).

Example
In ClickUp, _“UI: Farm - Create V2 Header”_ becomes _“Farm - Create V2 Header”_ in pull requests

### Branching

The `dev` branch is the `origin/HEAD` of the project and therefor, the history of this branch is important and should maintain its integrity. The `release/prod` and `release/staging` serve as triggers for CI/CD so their history is not as important and can be set and reset as needed. The `feature/*` branches are just clones of the `dev` branch that serve to help with small tests and consolidate changes with `dev`.

**Branch Format**

- release/prod
  - release/staging
    - dev
      - feature/swap-v2
        - add-tokens (merge commits via PR into parent)
      - feature/dex-v2
      - feature/nft-v2
      - feature/farm-v2
        - fix-decimal (merge commits via PR into parent)

#### Feature Branches

There exists a feature branch for each feature on the GooseFX platfrom and is based on the `dev` branch. These branches are versioned: example, `feature/swap-v2`. When working toward feature completion, start by creating a branch off of openning a PR and push commits to the PR on a daily basis as you work toward completion. This allows the feature to demonstrate a dif in Github for review.

Because the GooseFX platform has several features that are developing on their own timeline, each feature will need to be developed on its own branch until it can move into `dev`. This means that changes merged into `dev` should be ready to be promoted to staging; if they are not ready, continue to develop on the branch.

These features will likely accumulate a lot of changes before merging into `dev` but rebasing will de-risk complications if done regularly. This also means there could be several ClickUp tasks that are represented within a single PR.

Rebasing daily or frequently should allow your feature branch to always be safely merged when the time comes to add it to `dev`.

Good daily habits on feature branches (assumes on working branch):

1. `git fetch --all`
2. `git rebase origin/feature/<my-feature>`

Periodic rebasing of the feature branch with latest dev when features complete.

#### Branch Dynamic URLs

Each branch prefixed with `feature/` will auto build and deploy to a url for testing the updates represented in that merge commit. This allows for testing before a commitment to promote it has been made.

When the feature is complete, use Github to merge it into `dev` after looking over the dif **or** request a review from a team member.

### Staging Release

When releasing to staging, the `release/staging` branch will merge `dev` at the desired commit ID and then will be pushed to `origin/release/staging` which will initialize an auto deploy to the AWS Amplify resource.

### Production Release

It is important to ensure that the staging environment does not possess errors or breaking changes before releasing to production.

When releasing to production, the `release/prod` branch will merge the `release/staging` at the desired commit ID and then will be pushed to `origin/release/prod` which will initialize an auto deploy to the AWS Amplify resource.

### Raising a Pull Request

Follow the template located at `./github/pull_request_template.md`

Each PR **MUST**:

- be titled correctly
- list the changes
- contain a link to the ClickUp task or milestone
- loom video (optional but encouraged for large changes)

#### Template

```
<!-- **TITLE FORMATTING** - ClickUp title “UI: Farm - Create Header” becomes “Farm: Create Header” as title of pull request -->

## Description

## How has this been tested?

## Types of changes

- [ ] Technical Debt (non-breaking change which removes unused code/assets)
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Checklist:

- [ ] The related ClickUp task has been linked to this PR
- [ ] The person creating the pull request is listed in "Assignees"
- [ ] Change requires updated documentation

## Screenshots or Loom Video (optional):
```

#### Adding Tokens To Farm Page

1. `git checkout dev`
2. `git checkout -b add-tokens`
3. ./src/context/crypto.tsx add token usdc pair to fetch current price of token from coingeko or other provider
4. ./src/web3/ids.ts in sslPool object, add mint address in the file and the decimal supported (How to find the decimals supported for token ?)
5. Go to solscan and search the mint address of the token, you will find the decimals supported
6. ./public/img/assets/ add image with the token short name
7. Submit PR to dev branch
