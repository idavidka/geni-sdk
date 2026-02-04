/**
 * Core TypeScript types for Geni SDK
 */

/**
 * Geni SDK Configuration
 */
export interface GeniSDKConfig {
	/** Geni OAuth Client ID */
	clientId: string;
	/** Geni App Key (usually same as clientId) */
	appKey?: string;
	/** OAuth access token (optional, can be set later) */
	accessToken?: string;
	/** Enable debug logging */
	debug?: boolean;
	/** Custom logger implementation */
	logger?: SDKLogger;
	/** Rate limiter configuration */
	rateLimiter?: RateLimiterConfig;
}

/**
 * SDK Logger interface
 */
export interface SDKLogger {
	log: (message: string, ...args: unknown[]) => void;
	warn: (message: string, ...args: unknown[]) => void;
	error: (message: string, ...args: unknown[]) => void;
}

/**
 * Rate Limiter Configuration
 */
export interface RateLimiterConfig {
	/** Maximum requests per day (default: 5000) */
	maxRequestsPerDay?: number;
	/** Enable rate limiting (default: true) */
	enabled?: boolean;
}

/**
 * Geni API Response wrapper
 */
export interface GeniApiResponse<T = unknown> {
	/** Response data */
	data?: T;
	/** Error information */
	error?: GeniApiError;
	/** HTTP status code */
	status: number;
	/** Response headers */
	headers?: Record<string, string>;
}

/**
 * Geni API Error
 */
export interface GeniApiError {
	/** Error code */
	code?: string;
	/** Error message */
	message: string;
	/** Additional error details */
	details?: unknown;
}

/**
 * Progress callback for long-running operations
 */
export type ProgressCallback = (current: number, total: number, message?: string) => void;
