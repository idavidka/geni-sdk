# GitHub Copilot Instructions - Geni SDK

---

## ⚠️ MANDATORY BEHAVIORAL RULES — READ FIRST, ALWAYS APPLY

These rules are **non-negotiable** and apply to **every single response**, without exception.

### 1. 🌐 Response Language

> **ALWAYS respond in the same language the user used in their question.**
> - User writes in Hungarian → respond in Hungarian
> - User writes in English → respond in English
> - **NEVER** switch languages mid-response unless the user explicitly asks
> - This rule overrides all other language rules in this document

### 2. 📝 Suggested Commit Message — ALWAYS Required After Changes

> **EVERY response where any file, code, or configuration was modified MUST end with a suggested commit message.**
> This is automatic and unconditional — never skip it, never ask if needed.

**Required format at the end of every modifying response:**

```
---

## 🎯 Suggested Commit Message

type(scope): brief description
```

**Rules:**
- Use **Conventional Commits** format: `type(scope): subject`
- Keep it **under 72 characters**
- Use **imperative mood** ("add feature", not "added feature")
- **Valid types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

---

## Project Overview

**Geni SDK** (`@treeviz/geni-sdk`) is a modern TypeScript SDK for the Geni.com API. It provides a type-safe interface for OAuth authentication, accessing Profiles, the World Family Tree, and genealogy utilities.

### Tech Stack

- **Language**: TypeScript
- **Build Tool**: tsup
- **Testing**: Vitest (with jsdom)
- **HTTP Client**: Native fetch API
- **OAuth**: Geni.com OAuth 2.0
- **Module Format**: ES Modules + CJS

### Project Structure

```
geni-sdk/
├── src/
│   ├── auth/          # OAuth authentication (login, token exchange, refresh)
│   ├── api/           # API client modules (profiles, family tree, etc.)
│   ├── utils/         # Helper utilities
│   ├── client.ts      # Main SDK client
│   ├── errors.ts      # Typed error classes
│   ├── rate-limiter.ts # Rate limiting logic
│   ├── types/         # TypeScript type definitions
│   ├── __tests__/     # Unit tests
│   └── index.ts       # Main entry point
└── README.md
```

### Key Features

1. **OAuth 2.0 Authentication**: Full Geni.com OAuth flow (authorization, token exchange, refresh)
2. **Profiles API**: Fetch and update Geni profiles (person data, relationships)
3. **World Family Tree**: Navigate and search the Geni World Family Tree
4. **Rate Limiting**: Built-in request throttling to respect Geni API limits
5. **Typed Errors**: Descriptive, typed error classes for all failure cases
6. **Type Safety**: Full TypeScript support with API response types

### Code Style & Conventions

1. **Language**: All code, comments, and documentation must be in **English**
   - Variable names, function names, class names must be in English
   - All inline and documentation comments must be in English
   - All `.md` files must be in English
   - **Copilot Responses**: Always respond in the **same language as the user's question**
2. **TypeScript**: Strict mode enabled, avoid `any` types
3. **File Naming**: `kebab-case.ts`
4. **Error Handling**: Use typed error classes from `errors.ts`
5. **Rate Limiting**: Always respect Geni API rate limits via `rate-limiter.ts`
6. **Testing**: Mock all HTTP requests in tests (no real API calls)

### Commit Message Convention

Follow **Conventional Commits** specification:

**Format:** `<type>(<scope>): <subject>`

**Examples:**
```
feat(auth): add token refresh support
fix(api): handle 429 rate limit responses
docs: update OAuth flow guide
test(profiles): add profile fetch tests
refactor(rate-limiter): improve backoff logic
```

### Common Tasks

#### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

#### Building
```bash
npm run build         # Build for production (tsup)
npm run dev           # Development watch mode
npm run clean         # Remove dist/
```

#### Publishing to NPM
```bash
npm version patch|minor|major
npm run build
npm publish
```

### API Structure

#### Entry Points (package.json exports)

- `.` — Main index (re-exports everything)
- `./auth` — OAuth authentication utilities
- `./api` — API client modules
- `./utils` — Helper utilities

#### Usage Example

```typescript
import { GeniClient } from '@treeviz/geni-sdk';

const client = new GeniClient({
  appId: 'YOUR_APP_ID',
  appSecret: 'YOUR_APP_SECRET',
  redirectUri: 'https://your-app.com/callback'
});

// OAuth flow
const authUrl = client.getAuthUrl();
// Redirect user to authUrl...

// Exchange code for token
await client.authenticate(authCode);

// Fetch a profile
const profile = await client.getProfile('profile-id');

// Fetch immediate family
const family = await client.getImmediateFamily('profile-id');
```

### OAuth Flow

1. Generate authorization URL with `getAuthUrl()`
2. Redirect user to Geni.com login
3. Receive callback with authorization code
4. Exchange code for access token with `authenticate()`
5. Use access token for API requests
6. Refresh token automatically when expired

### Rate Limiting

- Geni API has strict rate limits
- Use `rate-limiter.ts` for all outgoing requests
- Handle 429 responses with exponential backoff
- Never bypass the rate limiter

### Testing Best Practices

1. **Mock HTTP**: Use Vitest to mock fetch responses
2. **Test OAuth Flow**: Mock authorization and token exchange
3. **Error Cases**: Test 404, 401, 429, 500 responses
4. **Rate Limiter**: Test throttling and retry logic separately
5. **Type Safety**: Verify response types match TypeScript definitions

### Security Best Practices

1. **App Secret**: Never expose the app secret in client-side code
2. **Tokens**: Store access tokens securely
3. **State Parameter**: Use OAuth state parameter to prevent CSRF
4. **HTTPS Only**: All API calls must use HTTPS

### Common Issues & Solutions

#### Token Expiration
- Geni access tokens expire; implement automatic refresh
- Store refresh tokens securely

#### Rate Limiting
- Respect Geni API rate limits via the built-in rate limiter
- Use exponential backoff on 429 responses

### Contact & Resources

- **NPM Package**: `@treeviz/geni-sdk`
- **Repository**: https://github.com/idavidka/geni-sdk
- **Geni API Docs**: https://www.geni.com/platform/developer
- **Parent Project**: TreeViz Monorepo

---

**When working on this project:**
1. Always write in English (code, comments, docs)
2. Mock all HTTP requests in tests
3. Follow Geni API guidelines and rate limits
4. Use typed error classes for all failures
5. Never expose the app secret client-side
6. **After completing changes, ALWAYS suggest a commit message** following Conventional Commits format

**Commit Message Reminder:**
After making any changes, ALWAYS provide a suggested commit message at the end of your response:

```
---

## 🎯 Suggested Commit Message

type(scope): brief description
```
