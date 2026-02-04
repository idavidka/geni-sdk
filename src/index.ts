/**
 * Geni SDK
 *
 * A modern, TypeScript-first SDK for Geni.com API
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { GeniSDK, createGeniSDK } from '@treeviz/geni-sdk';
 *
 * // Create SDK instance
 * const sdk = createGeniSDK({
 *   clientId: 'your-client-id',
 *   accessToken: 'your-oauth-token'
 * });
 *
 * // Get current user profile
 * const profile = await sdk.profiles.getCurrentUser();
 *
 * // Search for profiles
 * const results = await sdk.search.searchProfiles({
 *   query: 'John Smith',
 *   birth_year: 1950
 * });
 * ```
 */

// Core SDK Client
export {
	GeniSDK,
	createGeniSDK,
	initGeniSDK,
	getGeniSDK,
	resetGeniSDK,
} from "./client";

// Types
export type {
	// Core
	GeniSDKConfig,
	SDKLogger,
	RateLimiterConfig,
	GeniApiResponse,
	GeniApiError,
	ProgressCallback,
	// OAuth
	GeniOAuthConfig,
	GeniOAuthTokenResponse,
	OAuthStateValidation,
	OAuthEndpoints,
	OAuthAuthorizationParams,
	OAuthTokenExchangeParams,
	// Profile
	GeniProfile,
	ProfileDate,
	ProfilePhotoUrls,
	ProfileEvent,
	ProfileLocation,
	ImmediateFamilyResponse,
	GeniUnion,
	ProfileSearchResponse,
	// Union
	GeniUnionDetail,
	CreateUnionInput,
	UpdateUnionInput,
	UnionResponse,
	UnionChildrenResponse,
} from "./types";

// Errors
export * from "./errors";

// Auth module
export * from "./auth";

// API modules
export * as ProfilesAPI from "./api/profiles";
export * as UnionsAPI from "./api/unions";
export * as PhotosAPI from "./api/photos";
export * as SearchAPI from "./api/search";

// Utils module
export * from "./utils";
