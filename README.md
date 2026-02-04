# @treeviz/geni-sdk

> Part of the [@treeviz](https://www.npmjs.com/org/treeviz) organization - A collection of tools for genealogy data processing and visualization.

Modern TypeScript SDK for Geni.com API - OAuth, Profiles API, World Family Tree, and genealogy utilities.

## Features

- ✅ **Full TypeScript Support** - Comprehensive type definitions for all APIs
- ✅ **OAuth 2.0 Authentication** - Complete OAuth flow with CSRF protection
- ✅ **Promise-based API** - Modern async/await syntax
- ✅ **Rate Limiting** - Built-in rate limiter (5,000 requests/day)
- ✅ **Modular Architecture** - Use only what you need
- ✅ **Configurable Logging** - Debug mode for troubleshooting
- ✅ **Error Handling** - Comprehensive error classes

## Installation

```bash
npm install @treeviz/geni-sdk
```

## Quick Start

```typescript
import { createGeniSDK } from '@treeviz/geni-sdk';

// Create SDK instance
const sdk = createGeniSDK({
  clientId: 'your-client-id',
  accessToken: 'your-oauth-token',
  debug: true
});

// Get current user profile
const profile = await sdk.profiles.getCurrentUser();
console.log('Current user:', profile.name);

// Search for profiles
const results = await sdk.search.searchProfiles({
  query: 'John Smith',
  birth_year: 1950,
  limit: 10
});
console.log('Found:', results.results.length, 'profiles');
```

## OAuth Authentication

### Client-Side Flow

```typescript
import { OAuthAPI, buildAuthorizationUrl, validateOAuthState } from '@treeviz/geni-sdk/auth';

// 1. Build authorization URL and redirect user
const authUrl = buildAuthorizationUrl({
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  scope: 'read'
});
window.location.href = authUrl;

// 2. Handle OAuth callback (in your callback page)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

// Validate state (CSRF protection)
const validation = validateOAuthState(state);
if (!validation.valid) {
  console.error('OAuth state validation failed:', validation.error);
  return;
}

// 3. Exchange code for token (server-side only - requires client secret)
// This should be done in your backend/Cloud Function
```

### Server-Side Token Exchange

```typescript
import { exchangeCodeForToken } from '@treeviz/geni-sdk/auth';

const tokens = await exchangeCodeForToken(code, {
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret', // Never expose this in client code!
  redirectUri: 'https://your-app.com/callback'
});

console.log('Access token:', tokens.access_token);
```

## API Modules

### Profiles API

```typescript
// Get current user
const user = await sdk.profiles.getCurrentUser();

// Get profile by ID
const profile = await sdk.profiles.getProfile('profile-123');

// Get immediate family
const family = await sdk.profiles.getImmediateFamily('profile-123');

// Get family tree (with depth)
const tree = await sdk.profiles.getTree('profile-123', 3);

// Update profile
const updated = await sdk.profiles.updateProfile('profile-123', {
  first_name: 'John',
  last_name: 'Doe'
});

// Search profiles
const results = await sdk.profiles.searchProfiles('John Smith');
```

### Unions API (Marriages/Partnerships)

```typescript
// Get union details
const union = await sdk.unions.getUnion('union-456');

// Get children of union
const children = await sdk.unions.getChildren('union-456');

// Create union
const newUnion = await sdk.unions.createUnion({
  partner1: 'profile-123',
  partner2: 'profile-456',
  status: 'married',
  marriage_date: '1980-06-15'
});

// Update union
const updated = await sdk.unions.updateUnion('union-456', {
  status: 'divorced',
  divorce_date: '2000-01-01'
});

// Delete union
await sdk.unions.deleteUnion('union-456');
```

### Photos API

```typescript
// Get photo details
const photo = await sdk.photos.getPhoto('photo-789');

// Upload photo
const newPhoto = await sdk.photos.uploadPhoto(
  'https://example.com/photo.jpg',
  'profile-123',
  'Birthday 1950'
);

// Delete photo
await sdk.photos.deletePhoto('photo-789');
```

### Search API

```typescript
// Basic search
const results = await sdk.search.searchProfiles({
  query: 'John Smith'
});

// Advanced search with filters
const filtered = await sdk.search.searchProfiles({
  query: 'John Smith',
  birth_year: 1950,
  death_year: 2020,
  location: 'New York',
  limit: 20
});
```

## Rate Limiting

The SDK automatically enforces Geni's 5,000 requests/day limit:

```typescript
// Check rate limit status
console.log(sdk.getRateLimitStatus());
// Output: "4995 / 5000 requests available"

// Get remaining requests
const remaining = sdk.getRemainingRequests();
console.log('Remaining requests:', remaining);
```

## Error Handling

```typescript
import { GeniError, GeniAuthError, GeniRateLimitError } from '@treeviz/geni-sdk';

try {
  const profile = await sdk.profiles.getProfile('invalid-id');
} catch (error) {
  if (error instanceof GeniAuthError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof GeniRateLimitError) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter, 'seconds');
  } else if (error instanceof GeniError) {
    console.error('Geni API error:', error.message, error.statusCode);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Configuration

```typescript
const sdk = createGeniSDK({
  // Required
  clientId: 'your-client-id',
  
  // Optional
  appKey: 'your-app-key', // Usually same as clientId
  accessToken: 'your-oauth-token',
  debug: false, // Enable debug logging
  logger: customLogger, // Custom logger implementation
  rateLimiter: {
    enabled: true,
    maxRequestsPerDay: 5000
  }
});
```

## Singleton Pattern

```typescript
import { initGeniSDK, getGeniSDK } from '@treeviz/geni-sdk';

// Initialize once
initGeniSDK({
  clientId: 'your-client-id',
  accessToken: 'your-oauth-token'
});

// Use anywhere
const sdk = getGeniSDK();
const profile = await sdk.profiles.getCurrentUser();
```

## TypeScript Support

All types are exported for your convenience:

```typescript
import type {
  GeniProfile,
  GeniUnionDetail,
  GeniOAuthConfig,
  ProfileSearchResponse,
  ImmediateFamilyResponse
} from '@treeviz/geni-sdk';
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## Links

- [Geni API Documentation](https://www.geni.com/platform/developer/help)
- [Geni Developer Console](https://www.geni.com/platform/developer/apps)
- [GitHub Repository](https://github.com/idavidka/gedcom-visualiser)
