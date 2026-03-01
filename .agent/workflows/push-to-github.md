---
description: how to deploy/push changes to GitHub for the Ethereum roadmap project
---

After making any code changes to this project, always run the following to commit and push to GitHub:

// turbo-all
1. Stage all changes, commit with a meaningful message, and push:
```
git add -A && git commit -m "<message describing the change>" && git push
```

Use conventional commit prefixes:
- `feat:` for new features or UI additions
- `fix:` for bug fixes
- `chore:` for minor cleanups or non-functional changes
- `content:` for data/content-only updates

The working directory is always `/Users/fymn/ethereum-roadmap/Ethereum-roadmap-1`.
