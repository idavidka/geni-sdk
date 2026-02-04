/**
 * OAuth 2.0 types for Geni authentication
 */

/**
 * OAuth Configuration
 */
export interface GeniOAuthConfig {
	/** OAuth Client ID */
	clientId: string;
	/** OAuth Client Secret (server-side only) */
	clientSecret?: string;
	/** Redirect URI for OAuth callback */
	redirectUri: string;
	/** OAuth scope (default: "read") */
	scope?: string;
}

/**
 * OAuth Token Response from Geni
 */
export interface GeniOAuthTokenResponse {
	/** Access token */
	access_token: string;
	/** Token type (usually "Bearer") */
	token_type: string;
	/** Token expiration in seconds */
	expires_in?: number;
	/** Refresh token (if available) */
	refresh_token?: string;
	/** Scope granted */
	scope?: string;
}

/**
 * OAuth State Validation Result
 */
export interface OAuthStateValidation {
	/** Whether state is valid */
	valid: boolean;
	/** Error message if invalid */
	error?: string;
}

/**
 * OAuth Endpoints for Geni
 */
export interface OAuthEndpoints {
	/** Authorization endpoint */
	authorize: string;
	/** Token exchange endpoint */
	token: string;
}

/**
 * OAuth authorization URL parameters
 */
export interface OAuthAuthorizationParams {
	/** OAuth client ID */
	client_id: string;
	/** Redirect URI */
	redirect_uri: string;
	/** Response type (always "code" for authorization code flow) */
	response_type: "code";
	/** OAuth scope */
	scope?: string;
	/** CSRF protection state parameter */
	state?: string;
}

/**
 * OAuth token exchange request parameters
 */
export interface OAuthTokenExchangeParams {
	/** Grant type */
	grant_type: "authorization_code" | "refresh_token";
	/** OAuth client ID */
	client_id: string;
	/** OAuth client secret */
	client_secret: string;
	/** Authorization code (for authorization_code grant) */
	code?: string;
	/** Redirect URI (must match authorization request) */
	redirect_uri?: string;
	/** Refresh token (for refresh_token grant) */
	refresh_token?: string;
}
