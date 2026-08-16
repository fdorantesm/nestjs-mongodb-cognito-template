---
name: Bug report
about: Report a defect or unexpected behavior in the NestJS API
title: '[bug]: '
labels: bug
assignees: ''
---

## Environment

- Branch / commit SHA:
- Environment: `local` | `dev` | `qa` | `production`
- Node.js version:
- Yarn version:
- MongoDB version:
- AWS Cognito: `real` | `mocked`

## Reproduction steps

<!--
  Step-by-step. We love curl, bruno, or scripts we can copy-paste.
-->

1.
2.
3.

## Expected behavior

<!-- What should have happened -->

## Actual behavior

<!-- What actually happened -->

## Request / response

```bash
# Example
curl -i -X POST https://api.example.com/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"foo@bar.tld","password":"REDACTED"}'
```

```json
{
  "statusCode": 401,
  "message": "..."
}
```

## Logs

```
[stack trace or relevant logs here]
```

## Impact

- [ ] Blocks release to `main`
- [ ] Blocks a feature under development
- [ ] Minor inconvenience

## Possible cause / area

<!-- Tag the area in case you know: e.g. `auth/guards/permission.guard.ts`, `users/repositories/users.repository.ts` -->

## Suggested fix

<!-- Optional. We will discuss before merging. -->
