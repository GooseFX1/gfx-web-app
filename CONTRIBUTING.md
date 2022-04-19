# Contributing Docs

To run the environment locally for developent, you will need to get the environment variables from a team member. Once you have received these variables, follow the steps on the [README.md](https://github.com/GooseFX1/gfx-web-app) in the root of the `gfx-web-app` repo.

## Dev Cycles

All features should be defined in a ClickUp task with a branch or a PR linked to the task. When creating PR, use the title of the ClickUp task. Remove “UI” since the repo is only frontend (UI is just a ClickUp designator since API and Docs etc are tracked there).

Example
In ClickUp, _“UI: Farm - Create V2 Header”_ becomes _“Farm - Create V2 Header”_ in pull requests

### Branching

**Branch Format**
Features: `feature/small-name`
Fixes: `fix/small-name`

Each feature or fix will be created off of the `dev` branch. After creating a feature branch, open a PR and push commits to the PR on a daily basis as you work toward completion. This allows the feature to demonstrate a dif in Github for review and collaboration should it be needed.

Because the GooseFX platform has several features that are developing on their own timeline, each feature will need to be developed on its own branch until it can move into `dev`. This means that changes merged into `dev` should be ready to be promoted to staging; if they are not ready, continue to develop on the branch.

These features will likely accumulate a lot of changes before merging into `dev` but rebasing will de-risk complications if done regularly. This also means there could be several ClickUp tasks that are represented within a single PR.

Rebasing daily or frequently should allow your feature branch to always be safely merged when the time comes to add it to dev.

Good daily habits on feature branches:

1. `git fetch --all`
2. `git checkout dev`
3. `git pull origin dev`
4. `git checkout feature/<my-feature>`
5. `git rebase dev`

When the feature is complete, use Github to merge it into `dev` after looking over the dif **or** request a review from a team member.

### Staging Release

When releasing to staging, the `release/staging` branch will merge `dev` at the desired commit ID and then will be pushed to `origin/release/staging` which will initialize an auto deploy to the AWS Amplify resource.

### Production Release

It is important to ensure that the staging environment does not possess errors or breaking changes before releasing to production.

When releasing to production, the `release/prod` branch will merge the `release/staging` at the desired commit ID and then will be pushed to `origin/release/prod` which will initialize an auto deploy to the AWS Amplify resource.
