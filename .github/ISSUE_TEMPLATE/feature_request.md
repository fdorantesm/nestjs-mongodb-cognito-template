---
name: Feature request
about: Propose a new capability or module
title: '[feat]: '
labels: enhancement
assignees: ''
---

## Problem

<!-- What problem does this solve? Who benefits? -->

## Proposed solution

<!--
  Describe the desired behavior. Mention which layer it touches
  (`domain`, `application`, `infrastructure`, `presentation`)
  and which modules it affects.
-->

## Alternatives considered

<!-- What other approaches were considered and rejected -->

## Acceptance criteria

- [ ] Defined `domain/` entities / interfaces
- [ ] Implement `application/` use case + handler
- [ ] `infrastructure/` service / repository / config (if needed)
- [ ] `presentation/` HTTP controller + DTO + Swagger annotations
- [ ] Unit tests passing (`yarn test`)
- [ ] E2E test for happy path (`yarn test:e2e`)
- [ ] OpenSpec proposal (`openspec/changes/<name>/proposal.md`)
- [ ] Documentation updated (`README.md` / `docs/`)

## Scope

> Helps release management choose the bump level.

- [ ] patch (`fix:`, `chore:`, `docs:`)
- [ ] minor (`feat:`) — default for new feature
- [ ] major (`BREAKING CHANGE` or `#major`)

## Dependencies

<!-- Other PRs, third-party services, env vars, migrations -->

## Effort estimate

<!-- Small / Medium / Large; or rough T-shirt size -->
