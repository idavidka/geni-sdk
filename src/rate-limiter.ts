/**
 * Rate Limiter for Geni API
 *
 * Geni API has a limit of 5,000 requests per day per authenticated user.
 * This rate limiter implements a token bucket algorithm to prevent exceeding the limit.
 */

import type { RateLimiterConfig } from "./types";
import { GeniRateLimitError } from "./errors";

/**
 * Rate Limiter using token bucket algorithm
 */
export class RateLimiter {
	private tokens: number;
	private readonly maxTokens: number;
	private readonly refillRate: number; // tokens per millisecond
	private lastRefill: number;
	private readonly enabled: boolean;

	/**
	 * Create a new rate limiter
	 * @param config - Rate limiter configuration
	 */
	constructor(config: RateLimiterConfig = {}) {
		this.enabled = config.enabled !== false;
		this.maxTokens = config.maxRequestsPerDay || 5000;
		this.tokens = this.maxTokens;
		// Refill rate: maxTokens per day = maxTokens / (24 * 60 * 60 * 1000) per ms
		this.refillRate = this.maxTokens / (24 * 60 * 60 * 1000);
		this.lastRefill = Date.now();
	}

	/**
	 * Refill tokens based on time passed
	 */
	private refill(): void {
		const now = Date.now();
		const timePassed = now - this.lastRefill;
		const tokensToAdd = timePassed * this.refillRate;

		this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
		this.lastRefill = now;
	}

	/**
	 * Consume a token (allow a request)
	 * @returns Promise that resolves when request is allowed
	 * @throws GeniRateLimitError if rate limit is exceeded
	 */
	async consume(): Promise<void> {
		if (!this.enabled) {
			return;
		}

		this.refill();

		if (this.tokens < 1) {
			// Calculate time to wait for next token
			const timeToWait = (1 - this.tokens) / this.refillRate;
			const retryAfter = Math.ceil(timeToWait / 1000); // in seconds

			throw new GeniRateLimitError(
				`Rate limit exceeded. ${this.getStatus()}. Retry after ${retryAfter} seconds.`,
				retryAfter,
			);
		}

		this.tokens -= 1;
	}

	/**
	 * Get rate limiter status
	 */
	getStatus(): string {
		this.refill();
		return `${Math.floor(this.tokens)} / ${this.maxTokens} requests available`;
	}

	/**
	 * Get remaining tokens
	 */
	getRemainingTokens(): number {
		this.refill();
		return Math.floor(this.tokens);
	}

	/**
	 * Reset rate limiter (for testing)
	 */
	reset(): void {
		this.tokens = this.maxTokens;
		this.lastRefill = Date.now();
	}
}
