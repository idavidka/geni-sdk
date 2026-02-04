/**
 * Error classes for Geni SDK
 */

import type { GeniApiError } from "./types";

/**
 * Base Geni SDK Error
 */
export class GeniError extends Error {
	public readonly code?: string;
	public readonly statusCode?: number;
	public readonly details?: unknown;

	constructor(message: string, code?: string, statusCode?: number, details?: unknown) {
		super(message);
		this.name = "GeniError";
		this.code = code;
		this.statusCode = statusCode;
		this.details = details;
		Object.setPrototypeOf(this, GeniError.prototype);
	}
}

/**
 * Authentication Error
 */
export class GeniAuthError extends GeniError {
	constructor(message: string, code?: string, details?: unknown) {
		super(message, code, 401, details);
		this.name = "GeniAuthError";
		Object.setPrototypeOf(this, GeniAuthError.prototype);
	}
}

/**
 * Rate Limit Error
 */
export class GeniRateLimitError extends GeniError {
	public readonly retryAfter?: number;

	constructor(message: string, retryAfter?: number) {
		super(message, "RATE_LIMIT_EXCEEDED", 429);
		this.name = "GeniRateLimitError";
		this.retryAfter = retryAfter;
		Object.setPrototypeOf(this, GeniRateLimitError.prototype);
	}
}

/**
 * Network Error
 */
export class GeniNetworkError extends GeniError {
	constructor(message: string, details?: unknown) {
		super(message, "NETWORK_ERROR", undefined, details);
		this.name = "GeniNetworkError";
		Object.setPrototypeOf(this, GeniNetworkError.prototype);
	}
}

/**
 * Validation Error
 */
export class GeniValidationError extends GeniError {
	constructor(message: string, details?: unknown) {
		super(message, "VALIDATION_ERROR", 400, details);
		this.name = "GeniValidationError";
		Object.setPrototypeOf(this, GeniValidationError.prototype);
	}
}

/**
 * Create error from API response
 */
export function createErrorFromResponse(
	statusCode: number,
	error?: GeniApiError,
): GeniError {
	const message = error?.message || `Request failed with status ${statusCode}`;
	const code = error?.code;
	const details = error?.details;

	if (statusCode === 401 || statusCode === 403) {
		return new GeniAuthError(message, code, details);
	}

	if (statusCode === 429) {
		return new GeniRateLimitError(message);
	}

	if (statusCode === 400) {
		return new GeniValidationError(message, details);
	}

	return new GeniError(message, code, statusCode, details);
}

/**
 * Create network error
 */
export function createNetworkError(error: unknown): GeniNetworkError {
	if (error instanceof Error) {
		return new GeniNetworkError(error.message, error);
	}
	return new GeniNetworkError("Network request failed", error);
}
