# Contributing Docs

To run the environment locally for developent, you will need to get the environment variables from a team member. Once you have received these variables, follow the steps on the [README.md](https://github.com/GooseFX1/gfx-web-app) in the root of the `gfx-web-app` repo.

## Dev Cycles

All features should be defined in a ClickUp task with a branch or a PR linked to the task and feature branches linked to milestones. When creating PR, use the title of the ClickUp task. Remove “UI” since the repo is only frontend (UI is just a ClickUp designator since API and Docs etc are tracked there).

Example
In ClickUp, _“UI: Farm - Create V2 Header”_ becomes _“Farm - Create V2 Header”_ for pull request title.

### Branching

**Branch Format**

- dev (origin/HEAD)
- release/staging
- release/prod

The `dev` branch is the default branch of origin (`origin/HEAD`) of the project and therefor, the history of this branch is important and should maintain integrity.

The `release/prod` and `release/staging` will be share a base with dev and will be set to a given commit hash on the `dev`/`origin/HEAD`.

All changes to `dev` will be commited on working branches, ex: `farm-<update>`. These branches will be created off of `dev` where a rebase to `origin/dev` throughout the life of the branch will occur. These working branches will be deleted after pull requests; ideally, this will result in a closed-loop pattern. The merge strategy will be a Rebase and Merge:

> ... commits from the pull request’s branch are rebased on to the tip of the base branch, and then the base branch itself is fast forwarded to this newly rebased head. Rebases automatically set the committer of the rebased commits to the current user, while keeping authorship information intact.

#### Branch Dynamic URLs

Optionally, branches prefixed with `feature/` will auto build and deploy to a url for testing the updates represented in that merge commit. This allows for testing before a merge to `dev`.

When the branch is complete, use Github to merge it into `dev` via PR after looking over the dif **or** request a review from a team member.

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
