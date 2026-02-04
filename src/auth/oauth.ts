/**
 * OAuth 2.0 authentication utilities for Geni
 *
 * Implements OAuth 2.0 authorization code flow for Geni.com
 * Reference: https://www.geni.com/platform/developer/help
 */

import type {
	GeniOAuthConfig,
	GeniOAuthTokenResponse,
	OAuthStateValidation,
	OAuthAuthorizationParams,
	OAuthTokenExchangeParams,
} from "../types";

/**
 * Geni OAuth endpoints
 */
const GENI_OAUTH_ENDPOINTS = {
	authorize: "https://www.geni.com/platform/oauth/authorize",
	token: "https://www.geni.com/platform/oauth/request_token",
} as const;

/**
 * OAuth state storage key
 */
const OAUTH_STATE_KEY = "geni_oauth_state";

/**
 * OAuth tokens storage key
 */
const OAUTH_TOKENS_KEY = "geni_oauth_tokens";

/**
 * Generate a random OAuth state for CSRF protection
 */
export function generateOAuthState(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Store OAuth state in browser storage (CSRF protection)
 */
export function storeOAuthState(state: string): void {
	if (typeof window !== "undefined" && window.localStorage) {
		window.localStorage.setItem(OAUTH_STATE_KEY, state);
	}
}

/**
 * Validate OAuth state from callback
 */
export function validateOAuthState(state: string): OAuthStateValidation {
	if (typeof window === "undefined" || !window.localStorage) {
		return { valid: false, error: "Storage not available" };
	}

	const storedState = window.localStorage.getItem(OAUTH_STATE_KEY);
	if (!storedState) {
		return { valid: false, error: "No stored state found" };
	}

	if (storedState !== state) {
		return { valid: false, error: "State mismatch (CSRF protection)" };
	}

	// Clear stored state after validation
	window.localStorage.removeItem(OAUTH_STATE_KEY);

	return { valid: true };
}

/**
 * Build OAuth authorization URL
 */
export function buildAuthorizationUrl(config: GeniOAuthConfig): string {
	const state = generateOAuthState();
	storeOAuthState(state);

	const params: OAuthAuthorizationParams = {
		client_id: config.clientId,
		redirect_uri: config.redirectUri,
		response_type: "code",
		scope: config.scope || "read",
		state,
	};

	const url = new URL(GENI_OAUTH_ENDPOINTS.authorize);
	Object.entries(params).forEach(([key, value]) => {
		if (value) {
			url.searchParams.append(key, value);
		}
	});

	return url.toString();
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
	code: string,
	config: GeniOAuthConfig,
): Promise<GeniOAuthTokenResponse> {
	if (!config.clientSecret) {
		throw new Error("Client secret is required for token exchange (server-side only)");
	}

	const params: OAuthTokenExchangeParams = {
		grant_type: "authorization_code",
		client_id: config.clientId,
		client_secret: config.clientSecret,
		code,
		redirect_uri: config.redirectUri,
	};

	const url = new URL(GENI_OAUTH_ENDPOINTS.token);
	Object.entries(params).forEach(([key, value]) => {
		if (value) {
			url.searchParams.append(key, value);
		}
	});

	const response = await fetch(url.toString(), {
		method: "POST",
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
	}

	const tokenResponse = (await response.json()) as GeniOAuthTokenResponse;
	return tokenResponse;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
	refreshToken: string,
	config: GeniOAuthConfig,
): Promise<GeniOAuthTokenResponse> {
	if (!config.clientSecret) {
		throw new Error("Client secret is required for token refresh (server-side only)");
	}

	const params: OAuthTokenExchangeParams = {
		grant_type: "refresh_token",
		client_id: config.clientId,
		client_secret: config.clientSecret,
		refresh_token: refreshToken,
	};

	const url = new URL(GENI_OAUTH_ENDPOINTS.token);
	Object.entries(params).forEach(([key, value]) => {
		if (value) {
			url.searchParams.append(key, value);
		}
	});

	const response = await fetch(url.toString(), {
		method: "POST",
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
	}

	const tokenResponse = (await response.json()) as GeniOAuthTokenResponse;
	return tokenResponse;
}

/**
 * Store OAuth tokens in browser storage
 */
export function storeTokens(tokens: GeniOAuthTokenResponse): void {
	if (typeof window !== "undefined" && window.localStorage) {
		window.localStorage.setItem(OAUTH_TOKENS_KEY, JSON.stringify(tokens));
	}
}

/**
 * Get stored access token
 */
export function getStoredAccessToken(): string | null {
	if (typeof window === "undefined" || !window.localStorage) {
		return null;
	}

	const tokensJson = window.localStorage.getItem(OAUTH_TOKENS_KEY);
	if (!tokensJson) {
		return null;
	}

	try {
		const tokens = JSON.parse(tokensJson) as GeniOAuthTokenResponse;
		return tokens.access_token;
	} catch {
		return null;
	}
}

/**
 * Clear stored tokens
 */
export function clearTokens(): void {
	if (typeof window !== "undefined" && window.localStorage) {
		window.localStorage.removeItem(OAUTH_TOKENS_KEY);
	}
}

/**
 * Validate access token (basic check)
 */
export function validateAccessToken(token: string): boolean {
	return typeof token === "string" && token.length > 0;
}

/**
 * OAuth API class
 */
export class OAuthAPI {
	private config: GeniOAuthConfig;

	constructor(config: GeniOAuthConfig) {
		this.config = config;
	}

	/**
	 * Start OAuth flow (redirect to Geni authorization page)
	 */
	startAuthFlow(): void {
		const authUrl = buildAuthorizationUrl(this.config);
		if (typeof window !== "undefined") {
			window.location.href = authUrl;
		}
	}

	/**
	 * Handle OAuth callback (validate state and exchange code for token)
	 */
	async handleCallback(code: string, state: string): Promise<GeniOAuthTokenResponse> {
		// Validate state
		const validation = validateOAuthState(state);
		if (!validation.valid) {
			throw new Error(validation.error || "Invalid OAuth state");
		}

		// Exchange code for token
		const tokens = await exchangeCodeForToken(code, this.config);

		// Store tokens
		storeTokens(tokens);

		return tokens;
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(refreshToken: string): Promise<GeniOAuthTokenResponse> {
		const tokens = await refreshAccessToken(refreshToken, this.config);
		storeTokens(tokens);
		return tokens;
	}

	/**
	 * Get stored access token
	 */
	getAccessToken(): string | null {
		return getStoredAccessToken();
	}

	/**
	 * Clear stored tokens
	 */
	clearTokens(): void {
		clearTokens();
	}
}
