# Pull Request

## Summary

> Briefly describe what this PR does (1-3 sentences).

## Type of change

> Tick the relevant option(s). More than one is fine if the change spans multiple intents.

- [ ] `feat:` new feature
- [ ] `fix:` bug fix
- [ ] `bugfix:` non-critical fix
- [ ] `refactor:` internal change with no behavior change
- [ ] `perf:` performance improvement
- [ ] `docs:` documentation only
- [ ] `test:` adding or fixing tests
- [ ] `chore:` tooling / deps / config
- [ ] `ci:` CI/CD change
- [ ] `build:` build system change
- [ ] `revert:` reverts a previous commit

## Hexagonal architecture impact

> Mark the layers touched. If you touched a layer outside your intent, justify it.

- [ ] `domain/`
- [ ] `application/`
- [ ] `infrastructure/`
- [ ] `presentation/`
- [ ] `core/`
- [ ] `config/`

## Modules affected

> List the modules. e.g. `auth, users, identity, settings`

-

## Conventional Commit

> Title MUST follow Conventional Commits. Use `#major` for breaking changes, `#minor` for feature bumps.

```
<type>(<scope>): <subject>
```

Example: `feat(auth): add mfa challenge endpoint [skip ci]`

## Breaking changes

> Document anything that requires migration, env updates, or downstream changes.

- [ ] No breaking changes
- [ ] Has breaking changes (describe below)

<!--
  If applicable, describe the breaking change and migration path.
  Example:
  - Removed `POST /v1/auth/legacy-login` in favor of `POST /v1/auth/login`
  - Renamed env var `COGNITO_USER_POOL_ID` -> `COGNITO_USER_POOL_UUID`
  - Dropped Mongo collection `legacy_users`
-->

## How has this been tested?

> Tick all that apply.

- [ ] Unit tests (`yarn test`)
- [ ] E2E tests (`yarn test:e2e`)
- [ ] Manual bruno collection (`bruno/`)
- [ ] Lint passes (`yarn lint`)
- [ ] Build passes (`yarn build`)

### Test scenarios covered

<!-- Describe the test cases you ran -->

-

## Evidence

> Paste logs, screenshots, curl output or bruno run output if relevant.

```
$ yarn test
...
```

## Checklist

- [ ] My commits are signed with GPG
- [ ] Commit messages follow Conventional Commits
- [ ] No `any` types were introduced (`grep` `as any`)
- [ ] Imports use absolute paths (`@/modules/...`)
- [ ] Entities instantiated via `Entity.create()` (never `new Entity()`)
- [ ] DI tokens come from `domain/interfaces/*service.interface.ts` constants
- [ ] Handlers depend on services, never on repositories
- [ ] OpenSpec / openspec/changes/ proposal updated (if architectural change)
- [ ] README.md updated (if visible behavior changed)

## Related issues

> Link the issue this PR closes or references.

Closes #

## Release impact

> Helps the release-please + bump workflow decide the next version.

- [ ] patch (`fix:`, `chore:`, `docs:`)
- [ ] minor (`feat:`)
- [ ] major (`#major` or `BREAKING CHANGE`)

## Screenshots

> Optional. UI, bruno run output, or any visual evidence.
